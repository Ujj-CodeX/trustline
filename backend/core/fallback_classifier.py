KEYWORD_MAP = {
    "cyber_crime": ["fraud", "hack", "scam", "online cheat", "cyber"],
    "domestic_violence": ["husband", "beat", "domestic", "abuse at home"],
    "child_helpline": ["child abuse", "missing child"],
    "women_safety": ["harassment", "stalking", "unsafe"],
    "mental_health": ["suicide", "suicidal", "depression", "anxiety", "self harm"],
    "legal_aid": ["legal help", "lawyer", "court", "rights"],
    "animal_husbandry": ["animal", "cattle", "livestock", "pet injured"],
    "senior_citizen": ["elderly", "elder abuse", "senior citizen"],
    "disaster_relief": ["flood", "earthquake", "fire disaster", "evacuation"],
    "labour_rights": ["wage", "workplace dispute", "labour exploitation"],
    "consumer_complaint": ["consumer complaint", "product fraud", "service fraud"],
    "road_accident": ["road accident", "car crash", "traffic accident"],
    "missing_person": ["missing person", "kidnapped", "not found"],
}


def keyword_fallback_classify(query_text):
    text = query_text.lower()
    for category, keywords in KEYWORD_MAP.items():
        if any(kw in text for kw in keywords):
            return {"category": category, "urgency_tier": "urgent", "state": None, "district": None, "country": "", "language": "English"}
    return {"category": "general", "urgency_tier": "general", "state": None, "district": None, "country": "", "language": "English"}

