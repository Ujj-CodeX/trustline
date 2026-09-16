import json
from groq import Groq
from decouple import config


from .schemas import IntentSchema
from pydantic import ValidationError
from .rate_limiter import check_outbound_limit

from .fallback_classifier import keyword_fallback_classify

GROQ_MODEL = "openai/gpt-oss-120b"

client = Groq(api_key=config('GROQ_API_KEY'))
SYSTEM_PROMPT = """You are an intent extractor. Return ONLY valid JSON, no extra text.
Schema: {"category": one of [cyber_crime, domestic_violence, mental_health, child_helpline, women_safety, legal_aid, animal_husbandry, general],
"urgency_tier": one of [emergency, urgent, general],
"state": string or null, "district": string or null, "country": string}"""


def classify_query(query_text):
    if not check_outbound_limit():
        return {"category": "general", "urgency_tier": "general", "state": None, "district": None, "country": "India",
                "warning": "Rate limit reached — showing general fallback. Please try again shortly."}
    resp = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": query_text},
        ],
        temperature=0,
    )

    raw = resp.choices[0].message.content.strip()

    try:

        parsed = json.loads(raw)
        validated = IntentSchema.model_validate(parsed)

        return validated.model_dump()

    except (json.JSONDecodeError, ValidationError):

        return {
           "category": "general",
           "urgency_tier": "general",
           "state": None,
           "district": None,
           "country": "India",
    }
    except Exception:
        # Groq timeout / API down
        data = keyword_fallback_classify(query_text)
        data['warning'] = "AI classification unavailable — basic keyword match used."
        return data


def format_response(query_text):
    """Generate only natural-language guidance.

    Resource facts such as phone numbers, names, verification status, and URLs
    are intentionally NOT passed to the LLM. They are returned separately by
    the backend from the trusted resource store. """

    try:
        resp = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": (
                    "You are the response assistant for a verified support routing system. "
                    "Write a short, warm, actionable response to the user's query. "
                    "Do not provide phone numbers, URLs, organization names, or other factual "
                    "resource details. Those details are supplied separately by the backend."
                )},
                {"role": "user", "content": f"User asked: {query_text}"},
            ],
            temperature=0.3,
            timeout=5,
        )
        return resp.choices[0].message.content.strip()

    except Exception:
        return "We found some verified resources for you below. If this is urgent, please contact them directly."
