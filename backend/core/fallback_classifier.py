KEYWORD_MAP = {
    "cyber_crime": ["fraud", "hack", "scam", "online cheat", "cyber"],
    "domestic_violence": ["husband", "beat", "domestic", "abuse at home"],
    "child_helpline": ["child abuse", "missing child"],
    "women_safety": ["harassment", "stalking", "unsafe"],
}


def keyword_fallback_classify(query_text):
    text = query_text.lower()

    for category, keywords in KEYWORD_MAP.items():
        if any(kw in text for kw in keywords):
            for category, keywords in  KEYWORD_MAP.items():
                if any(kw in text for kw in keywords):
                    return {
                        "category": category, "urgency_tier": "urgent", "state": None, "district": None, "country": "India"
                    }
            return {"category": "general", "urgency_tier": "general", "state": None, "district": None, "country": "India"}
                