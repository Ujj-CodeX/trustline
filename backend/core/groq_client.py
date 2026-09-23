import json
from groq import Groq
from decouple import config


from .schemas import IntentSchema
from pydantic import ValidationError
from .rate_limiter import check_outbound_limit

from .fallback_classifier import keyword_fallback_classify

from .intent_classifier import classify_intent

GROQ_MODEL = "openai/gpt-oss-120b"

client = Groq(api_key=config('GROQ_API_KEY'))


SYSTEM_PROMPT = """You are an intent extractor. Return ONLY valid JSON, no extra text.
Schema: {"category": one of [cyber_crime, domestic_violence, mental_health, child_helpline, women_safety, legal_aid, health_emergency, animal_husbandry, general],
"urgency_tier": one of [emergency, urgent, general],
"state": string or null, "district": string or null, "country": string or empty string if not mentioned,
"language": the language the user wrote their query in, e.g. "English", "Hindi", "Tamil"}

IMPORTANT RULES:
- If the query mentions fraud, scam, hacking, online theft, or financial cyber crime, category MUST be "cyber_crime".
- If the query mentions a specific city or district, extract it into "district" and infer its "state" if it's an Indian city.
- If the query does NOT explicitly mention a location, return "country": "", "state": null, "district": null.
- Detect "language" from the script/words used in the query itself, not the topic.

Examples:
Query: "cyber fraud happened to my friend in Lucknow"
Output: {"category": "cyber_crime", "urgency_tier": "urgent", "state": "Uttar Pradesh", "district": "Lucknow", "country": "India", "language": "English"}

Query: "mujhe madad chahiye, mera paisa cheat ho gaya"
Output: {"category": "cyber_crime", "urgency_tier": "urgent", "state": null, "district": null, "country": "", "language": "Hindi"}
"""


def classify_query(query_text):
    if not check_outbound_limit():
        return {"category": "general", "urgency_tier": "general", "state": None, "district": None, "country": "",
                "warning": "Rate limit reached — showing general fallback."}

    intent_result = classify_intent(query_text)

    try:
        resp = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},  
                {"role": "user", "content": query_text},
            ],
            temperature=0,
            timeout=5,
        )
        raw = resp.choices[0].message.content.strip()
        parsed = json.loads(raw)
        validated = IntentSchema.model_validate(parsed)
        result = validated.model_dump()

        result["category"]=intent_result["category"]
        result["confidence"] = intent_result["confidence"]

        return result

    except (json.JSONDecodeError, ValidationError):
        return {"category": intent_result["category"], "confidence": intent_result["confidence"],
                "urgency_tier": "general", "state": None, "district": None, "country": ""}
    except Exception:
        data = keyword_fallback_classify(query_text)
        data["category"] = intent_result["category"]
        data["confidence"] = intent_result["confidence"]
        data["warning"] = "AI location extraction unavailable — category still classified via local model."
        return data


    

def format_response(query_text,resources=None, user_lang="English"):
    """Generate only natural-language guidance.

    Resource facts such as phone numbers, names, verification status, and URLs
    are intentionally NOT passed to the LLM. They are returned separately by
    the backend from the trusted resource store. """

    context_notes = ""

    if resources:
        descriptions = [r.get("description") for r in resources if r.get("description")]
        if descriptions:
            context_notes = "\nVerified context (use ONLY this, nothing else): " + " | ".join(descriptions)

    try:
        resp = client.chat.completions.create(
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
