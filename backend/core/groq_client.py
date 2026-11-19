import json

from decouple import config
from groq import Groq
from pydantic import ValidationError

from .knowledge.tools import TOOL_DEFINITIONS, execute_tool

from .schemas import RoutingSchema
from .rate_limiter import check_outbound_limit
from .intent_classifier import classify_intent
from .prompts import (
    ROUTING_SYSTEM_PROMPT,
    build_response_user_prompt,
    build_response_system_prompt,
)
from .knowledge.retrieval import retrieve_knowledge, build_knowledge_context

import logging

logger = logging.getLogger(__name__)

GROQ_MODEL = config(
    "GROQ_MODEL",
    default="openai/gpt-oss-120b",
)

GROQ_ROUTING_TIMEOUT = config(
    "GROQ_ROUTING_TIMEOUT",
    default=8,
    cast=int
)

GROQ_FORMAT_TIMEOUT = config(
    "GROQ_FORMAT_TIMEOUT",
    default=5,
    cast=int
)
ROUTING_JSON_SCHEMA = {
    "type": "object",
    "properties": {
        "route": {
            "type": "string",
            "enum": ["in_scope", "needs_clarification", "out_of_scope"]
        },
        "category": {
            "anyOf": [
                {
                    "type": "string",
                    "enum": [
                        "cyber_crime", "domestic_violence",
                        "mental_health", "child_helpline",
                        "women_safety", "legal_aid",
                        "health_emergency", "animal_husbandry",
                        "senior_citizen", "disaster_relief",
                        "labour_rights", "consumer_complaint",
                        "road_accident", "missing_person", "general"
                    ]
                },
                {"type": "null"}
            ]
        },
        "urgency_tier": {
            "type": "string",
            "enum": ["emergency", "urgent", "general"]
        },
        "state": {
            "anyOf": [{"type": "string"}, {"type": "null"}]
        },
        "district": {
            "anyOf": [{"type": "string"}, {"type": "null"}]
        },
        "country": {"type": "string"},
        "language": {"type": "string"},
        "clarification_question": {
            "anyOf": [{"type": "string"}, {"type": "null"}]
        }
    },
    "required": [
        "route", "category", "urgency_tier", "state",
        "district", "country", "language", "clarification_question"
    ],
    "additionalProperties": False
}

_client = None


def get_groq_client():
    """Initialize Groq lazily so local fallback can work without an API key."""
    global _client

    if _client is None:
        api_key = config("GROQ_API_KEY", default="").strip()

        if not api_key:
            raise RuntimeError("GROQ_API_KEY is not configured")

        _client = Groq(api_key=api_key)

    return _client






def _sentence_transformer_fallback(query_text):
    """Use local semantic routing when Groq is unavailable."""

    try:
        intent = classify_intent(query_text)
        route = intent.get("route")
        category = intent.get("category")

        base_result = {
            "route": route,
            "category": None,
            "urgency_tier": "general",
            "state": None,
            "district": None,
            "country": "",
            "language": "English",
            "clarification_question": None,
            "routing_source": "sentence_transformer",
            "confidence": intent.get("confidence", 0),
        }

        if route == "out_of_scope":
            return base_result

        if route == "in_scope" and category:
            base_result["category"] = category
            return base_result

        base_result["route"] = "needs_clarification"
        base_result["clarification_question"] = (
            "What kind of support or helpline do you need?"
        )
        return base_result

    except Exception:
        return {
            "route": "needs_clarification",
            "category": None,
            "urgency_tier": "general",
            "state": None,
            "district": None,
            "country": "",
            "language": "English",
            "clarification_question": (
                "Please briefly describe the support you need."
            ),
            "routing_source": "fallback_unavailable",
        }


def classify_query(query_text, context=None):
    """
    Primary: Groq scope + intent routing.
    Fallback: existing local Sentence Transformer classifier.
    """

    if not check_outbound_limit():
        return _sentence_transformer_fallback(query_text)

    messages = [
        {"role": "system", "content": ROUTING_SYSTEM_PROMPT}
    ]

    # Optional recent context; it is passed for this request only.
    if isinstance(context, list):
        for item in context[-2:]:
            if not isinstance(item, dict):
                continue

            role = item.get("role")
            content = item.get("content")

            if (
                role in ("user", "assistant")
                and isinstance(content, str)
                and content.strip()
            ):
                messages.append({
                    "role": role,
                    "content": content.strip()[:800],
                })

    messages.append({
        "role": "user",
        "content": query_text,
    })

    try:
        response = get_groq_client().chat.completions.create(
            model=GROQ_MODEL,
            messages=messages,
            temperature=0,
            timeout=8,
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name":"trustline_routing",
                    "strict": True,
                    "schema": ROUTING_JSON_SCHEMA,
                }

                }

        )

        raw = response.choices[0].message.content

        if not raw:
            raise ValueError("Groq returned an empty response")

        parsed = json.loads(raw)

# If the model omits urgency or returns null,
# use a safe default instead of triggering fallback.
        if parsed.get("urgency_tier") not in {
          "emergency",
          "urgent",
          "general",
        }:
           parsed["urgency_tier"] = "general"

        validated = RoutingSchema.model_validate(parsed)
        
        result = validated.model_dump()
        result["routing_source"] = "groq"

        if result["route"] == "in_scope":
           semantic_check = classify_intent(query_text)
           semantic_route = semantic_check.get("route")

    # Do not allow uncertain or unrelated queries to reach lookup.
           if semantic_route != "in_scope":
                result["route"] = (
                   semantic_route
                if semantic_route in {
                   "needs_clarification",
                   "out_of_scope",
                }
                else "needs_clarification"
            )

                result["category"] = None
                result["clarification_question"] = None
                result["routing_source"] = (
               "groq_guarded_by_sentence_transformer"
            )

        return result

    except (json.JSONDecodeError, ValidationError, ValueError):
        return _sentence_transformer_fallback(query_text)

    except Exception:
        # Includes missing API key, timeout, and provider errors.
        return _sentence_transformer_fallback(query_text)


    

def format_response(query_text,resources=None, user_lang="English", knowledge_context=" "):
    """Generate only natural-language guidance.

    Resource facts such as phone numbers, names, and URLs are intentionally
    NOT passed to the LLM — those come from the backend's trusted store.
    Resource descriptions (admin-curated context) ARE passed as reference,
    but the LLM is instructed not to invent facts beyond what's given.
    """

    context_notes = ""

    if resources:
        descriptions = [r.get("description") for r in resources if r.get("description")]
        if descriptions:
            context_notes = "\nVerified context (use ONLY this, nothing else): " + " | ".join(descriptions)

    try:
        resp = get_groq_client().chat.completions.create(
            model=GROQ_MODEL,
           messages=[
    {
        "role": "system",
        "content": build_response_system_prompt(user_lang),
    },
    {
        "role": "user",
        "content": build_response_user_prompt(
            query_text,
            context_notes=context_notes,
            knowledge_context=knowledge_context,
        ),
    },
],
            temperature=0,
            timeout=GROQ_FORMAT_TIMEOUT,
        )
        return resp.choices[0].message.content.strip()

    except Exception:
        return "We found some verified resources for you below. If this is urgent, please contact them directly."

def format_response_with_tools(query_text, resources=None, user_lang="English"):
    context_notes = ""

    if resources:
        descriptions = [
            item.get("description")
            for item in resources
            if isinstance(item, dict) and item.get("description")
        ]

        if descriptions:
            context_notes = (
                "\nVerified context (use ONLY this, nothing else): "
                + " | ".join(descriptions)
            )

    messages = [
        {
            "role": "system",
            "content": build_response_system_prompt(user_lang),
        },
        {
            "role": "user",
            "content": build_response_user_prompt(
                query_text,
                context_notes=context_notes,
                knowledge_context="",
            ),
        },
    ]

    knowledge_results = []

    try:
        response = get_groq_client().chat.completions.create(
            model=GROQ_MODEL,
            messages=messages,
            tools=TOOL_DEFINITIONS,
            tool_choice="auto",
            parallel_tool_calls=False,
            temperature=0,
            timeout=GROQ_FORMAT_TIMEOUT,
        )

        assistant_message = response.choices[0].message

        if not assistant_message.tool_calls:
            return {
                "reply": (
                    "I couldn't retrieve relevant guidance from the "
                    "knowledge base. Please contact a verified support "
                    "service directly."
                ),
                "knowledge_results": [],
            }

        messages.append(
            assistant_message.model_dump(exclude_none=True)
        )

        for tool_call in assistant_message.tool_calls:
            tool_name = tool_call.function.name

            try:
                arguments = json.loads(tool_call.function.arguments)
                tool_result = execute_tool(tool_name, arguments)

                if tool_name == "search_official_guidance":
                    results = tool_result.get("results", [])
                    if isinstance(results, list):
                        knowledge_results.extend(results)

            except Exception:
                logger.exception("Tool execution failed: %s", tool_name)
                tool_result = {"error": "Tool execution failed."}

            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": json.dumps(tool_result),
            })

        if not knowledge_results:
            return {
                "reply": (
                    "I couldn't retrieve relevant verified guidance "
                    "at the moment. Please contact a verified support "
                    "service directly."
                ),
                "knowledge_results": [],
            }

        knowledge_context = build_knowledge_context(
            knowledge_results,
            max_chars=5000,
        )

        messages[1]["content"] = build_response_user_prompt(
            query_text,
            context_notes=context_notes,
            knowledge_context=knowledge_context,
        )

        final_messages = [
            {
                "role": "system",
                "content": build_response_system_prompt(user_lang),
            },
            {
                "role": "user",
                "content": build_response_user_prompt(
                    query_text,
                    context_notes=context_notes,
                    knowledge_context=knowledge_context,
                ),
            },
        ]

        final_response = get_groq_client().chat.completions.create(
            model=GROQ_MODEL,
            messages=final_messages,
            temperature=0,
            timeout=GROQ_FORMAT_TIMEOUT,
        )
        reply = (
            final_response.choices[0].message.content or ""
        ).strip()

        if not reply:
            raise ValueError("Groq returned an empty response")

        return {
            "reply": reply,
            "knowledge_results": knowledge_results,
        }

    except Exception:
        logger.exception("Tool-enabled response generation failed")

        return {
            "reply": (
                "We could not generate a grounded response at the "
                "moment. Please contact a verified support service directly."
            ),
            "knowledge_results": knowledge_results,
        }

