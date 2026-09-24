KEYWORD_MAP = {
    "cyber_crime":

     ["fraud", "hack", "hacked", "scam", "cyber",
        "online cheat", "online fraud", "otp fraud",
        "upi fraud", "bank fraud", "phishing",
        "account hacked", "identity theft",
        "digital arrest", "investment scam",
        "crypto scam", "blackmail", "sextortion",
        "money stolen", "cyber bullying",
        "fake call", "fake website"],

    "domestic_violence":

    [ "domestic violence", "abuse at home",
        "husband beat", "wife beat",
        "family abuse", "physical abuse",
        "violence at home", "marital abuse",
        "dowry harassment", "dowry",
        "forced marriage"],

    "child_helpline": 

    ["child abuse", "missing child",
        "child labour", "child labor",
        "child trafficking",
        "child marriage",
        "orphan child",
        "child neglect"],

    "women_safety": 

    ["harassment", "stalking",
        "unsafe", "eve teasing",
        "sexual harassment",
        "molestation",
        "rape threat",
        "gender violence",
        "workplace harassment"],

    "mental_health": 

    ["depression", "anxiety",
        "panic attack", "stress",
        "mental health",
        "suicidal", "suicide",
        "self harm",
        "lonely", "hopeless",
        "can't sleep", "insomnia",
        "overthinking",
        "emotional support",
        "feeling low"],

    "legal_aid":

      ["lawyer", "court",
        "legal help",
        "legal aid",
        "case file",
        "legal advice",
        "rights violation",
        "consumer court",
        "property dispute"],

    "animal_husbandry":

      ["animal", "cattle",
        "livestock", "cow",
        "buffalo", "goat",
        "sheep", "poultry",
        "veterinary",
        "animal disease",
        "pet injured",
        "animal treatment",
        "milk production"],

    "senior_citizen":

      ["elderly",
        "elder abuse",
        "senior citizen",
        "old age",
        "retired person",
        "aging parent"],

    "disaster_relief": 

    ["flood",
        "earthquake",
        "cyclone",
        "landslide",
        "tsunami",
        "fire disaster",
        "evacuation",
        "natural disaster"],

    "labour_rights":

      [ "salary not paid",
        "wage issue",
        "labour exploitation",
        "workplace dispute",
        "forced labour",
        "contract issue",
        "employer abuse"],

    "consumer_complaint": 

    [  "consumer complaint",
        "service fraud",
        "product fraud",
        "refund issue",
        "defective product",
        "fake product",
        "seller cheated"],

    "road_accident":

      ["road accident",
        "car crash",
        "bike accident",
        "hit and run",
        "traffic accident",
        "vehicle collision"],

    "missing_person": 

    ["missing person",
        "kidnapped",
        "not found",
        "lost person",
        "person disappeared",
        "run away"],
}


def keyword_fallback_classify(query_text):
    text = query_text.lower()
    for category, keywords in KEYWORD_MAP.items():
        if any(kw in text for kw in keywords):
            return {"category": category, "urgency_tier": "urgent", "state": None, "district": None, "country": "", "language": "English"}
    return {"category": "general", "urgency_tier": "general", "state": None, "district": None, "country": "", "language": "English"}

