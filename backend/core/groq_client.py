import json
from groq import Groq
from decouple import config

client = Groq(api_key=config("GROQ_API_KEY"))

GROQ_MODEL = config("GROQ_MODEL")

SYSTEM_PROMPT = """You are an intent extractor. Return ONLY valid JSON, no extra text.
Schema: {"category": one of [cyber_crime, domestic_violence, mental_health, child_helpline, women_safety, legal_aid, animal_husbandry, general],
"urgency_tier": one of [emergency, urgent, general],
"state": string or null, "district": string or null, "country": string}"""


def classify_query(query_text):
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
        data = json.loads(raw)
    except json.JSONDecodeError:
        data = {}

    return {
        "category": data.get("category") or "general",
        "urgency_tier": data.get("urgency_tier") or "general",
        "state": data.get("state") or None,
        "district": data.get("district") or None,
        "country": data.get("country") or "India",
    }


def format_response(query_text):
    """Generate only natural-language guidance.

    Resource facts such as phone numbers, names, verification status, and URLs
    are intentionally NOT passed to the LLM. They are returned separately by
    the backend from the trusted resource store.
    """
    resp = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are the response assistant for a verified support routing system. "
                    "Write a short, warm, actionable response to the user's query. "
                    "Do not provide phone numbers, URLs, organization names, or other factual "
                    "resource details. Those details are supplied separately by the backend."
                ),
            },
            {
                "role": "user",
                "content": f"User asked: {query_text}",
            },
        ],
        temperature=0.3,
    )

    return resp.choices[0].message.content.strip()
