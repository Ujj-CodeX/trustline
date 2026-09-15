import json
from groq import Groq
from decouple import config

client = Groq(api_key=config('GROQ_API_KEY'))
SYSTEM_PROMPT = """You are an intent extractor. Return ONLY valid JSON, no extra text.
Schema: {"category": one of [cyber_crime, domestic_violence, mental_health, child_helpline, women_safety, legal_aid, general],
"urgency_tier": one of [emergency, urgent, general],
"state": string or null, "district": string or null, "country": string}"""


GROQ_MODEL = config('GROQ_MODEL')

def classify_query(query_text):
    resp =  client.chat.completions.create(
        model = GROQ_MODEL,
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": query_text}
        ],
        temperature = 0,
)
    raw =  resp.choices[0].message.content.strip()
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        data = {}
    return {
        "category": data.get("category") or "general",
        "urgency_tier": data.get("urgency_tier") or "general",
        "state": data.get("state") or None,
        "district": data.get("district") or None,
        "country": data.get("country") or "India",
    }

def format_response(query_text, helplines):
    context = json.dumps(helplines)
    resp = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {"role": "system", "content": (
                "You format helpline info for the user. NEVER invent phone numbers — only use what's given. "
                "Each resource has a 'verification_status' field: 'verified_web' or 'verified_authority' means "
                "confidently confirmed — present normally. 'cross_referenced' or 'legacy_unverified' means NOT "
                "independently confirmed — you MUST label these with '(unverified — please confirm before relying on this)'. "
                "Be warm, brief, actionable."
            )},
            {"role": "user", "content": f"User asked: {query_text}\nVerified resources: {context}\nWrite a short helpful response listing these."}
        ],
        temperature=0.3
    )
    return resp.choices[0].message.content