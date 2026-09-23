from sentence_transformers import SentenceTransformer ,util

CATEGORIES = [ 
    "cyber_crime", "domestic_violence", "mental_health", "child_helpline",
    "women_safety", "legal_aid", "health_emergency", "animal_husbandry", "general"
]

CATEGORY_DESCRIPTIONS = {

    "cyber_crime": "online fraud, hacking, scam, phishing, financial cyber crime",
    "domestic_violence": "abuse at home, violence by partner or family",
    "mental_health": "depression, anxiety, suicide, emotional crisis, counseling",
    "child_helpline": "child abuse, missing child, child safety",
    "women_safety": "harassment, stalking, women's safety, gender violence",
    "legal_aid": "legal help, lawyer, court, consumer rights",
    "health_emergency": "medical emergency, injury, accident, ambulance",
    "animal_husbandry": "animal, cattle, livestock, pet injured",
    "general": "general emergency, unspecified help",

}


_model = None

def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model

def classify_intent(query_text):
    model = get_model()
    query_emb = model.encode(query_text, convert_to_tensor=True)
    cat_texts = list(CATEGORY_DESCRIPTIONS.values())
    cat_embs = model.encode(cat_texts, convert_to_tensor=True)

    scores = util.cos_sim(query_emb, cat_embs)[0]
    best_idx = scores.argmax().item()
    confidence = round(scores[best_idx].item(),2)

    return {
        "category": CATEGORIES[best_idx],
        "confidence": confidence,
    }


