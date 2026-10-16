import json

from decouple import config
from groq import Groq
from pydantic import ValidationError

from .schemas import RoutingSchema
from .rate_limiter import check_outbound_limit
from .intent_classifier import classify_intent


GROQ_MODEL = "openai/gpt-oss-120b"

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


ROUTING_SYSTEM_PROMPT = """
You are the primary intent and scope router for TrustLine.

TrustLine helps people find relevant, verified helplines and support
resources. You are NOT a general-purpose chatbot.

Return ONLY valid JSON with these fields:
{
  "route": "in_scope" | "needs_clarification" | "out_of_scope",
  "category": supported category or null,
  "urgency_tier": "emergency" | "urgent" | "general",
  "state": string or null,
  "district": string or null,
  "country": string,
  "language": string,
  "clarification_question": string or null
}

Supported categories:
cyber_crime, domestic_violence, mental_health, child_helpline,
women_safety, legal_aid, health_emergency, animal_husbandry,
senior_citizen, disaster_relief, labour_rights, consumer_complaint,
road_accident, missing_person, general.

Routing rules:

1. in_scope:
   The user is seeking help that fits a supported category.
   Select the most relevant category.
   Use "general" only when the user clearly needs support or helpline
   discovery but no more specific category fits.
   Set clarification_question to null.

2. needs_clarification:
   The request may relate to support, but the actual need is unclear.
   Do not guess a category.
   Set category to null and ask ONE short, relevant question in the
   user's language.
   Use recent conversation context when it is available and relevant.

3. out_of_scope:
   The request is clearly unrelated to helplines or supported support
   services, such as unrelated coding help, jokes, entertainment, or
   general trivia.
   Set category and clarification_question to null.
   Do not answer the unrelated request.

4. SAFETY:
   Never classify a possible crisis, abuse, self-harm, or immediate
   danger request as out_of_scope merely because the wording is short
   or ambiguous.
   If the support need is unclear, use needs_clarification and ask a
   safety-relevant question. If the need is clear, choose the relevant
   support category and in_scope.

5. LOCATION:
   Extract a location only when the user explicitly provides one.
   If no country is mentioned, return an empty string for country.
   Do not infer a location from the language.
   Return null for an unmentioned state or district.

6. LANGUAGE:
   Identify the language of the user's current message.
   Return the clarification question in that language when clarification
   is needed.

7. Output rules:
   For in_scope, category MUST be one of the supported categories.
   For needs_clarification and out_of_scope, category MUST be null.
   Do not invent helpline numbers, agencies, or resources.
"""



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

        return result

    except (json.JSONDecodeError, ValidationError, ValueError):
        return _sentence_transformer_fallback(query_text)

    except Exception:
        # Includes missing API key, timeout, and provider errors.
        return _sentence_transformer_fallback(query_text)


    

def format_response(query_text,resources=None, user_lang="English"):
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
                {"role": "system", "content": (
                    "You are a response formatter for a verified helpline system. "
                    "Write EXACTLY 2-3 short sentences. Nothing more.\n"
                    "RULES (zero exceptions):\n"
                    "1. Never mention any phone number, URL, email, website, or portal name — "
                    "not even well-known ones — unless it is word-for-word in the verified context given.\n"
                    "2. Never suggest 'visit the website' or give step-by-step instructions naming "
                    "specific agencies/portals not explicitly given to you.\n"
                    "3. Only give brief emotional support + one safety tip (e.g. preserve evidence, "
                    "don't share OTPs). The resource cards below already show contact details.\n"
                    "4. Use markdown formatting: **bold** for key terms, bullet points if listing tips.\n"
                    f"5. Respond in {user_lang}, regardless of what language the query was in."
                )},
                {"role": "user", "content": f"User asked: {query_text}{context_notes}"},
            ],
            temperature=0,
            timeout=5,
        )
        return resp.choices[0].message.content.strip()

    except Exception:
        return "We found some verified resources for you below. If this is urgent, please contact them directly."

