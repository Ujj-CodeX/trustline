from sentence_transformers import SentenceTransformer ,util

CATEGORIES = [
    "cyber_crime", "domestic_violence", "mental_health", "child_helpline",
    "women_safety", "legal_aid", "health_emergency", "animal_husbandry",
    "senior_citizen", "disaster_relief", "labour_rights", "consumer_complaint",
    "road_accident", "missing_person", "general"
]

CATEGORY_DESCRIPTIONS = {
    "cyber_crime": 
       "online fraud, cyber fraud, hacking, hacked account, phishing, scam, OTP fraud, UPI fraud, banking fraud, investment scam, sextortion, blackmail, identity theft, digital arrest, fake website, fake call, social media hack, cyber bullying, financial cyber crime",
    "domestic_violence":
       "domestic violence, family abuse, abuse at home, husband beating wife, wife abuse, marital abuse, physical violence, emotional abuse, family harassment, dowry harassment, forced marriage, intimate partner violence",
    "mental_health": 
       "depression, anxiety, panic attack, emotional crisis, suicidal thoughts, self harm, loneliness, hopelessness, counseling, mental stress, overthinking, trauma, emotional support, mental wellbeing, psychological help",
    "child_helpline": 
        "child abuse, child neglect, missing child, child labour, child trafficking, child marriage, child exploitation, child safety, orphan child, child protection",
    "women_safety": 
       "women safety, harassment, sexual harassment, stalking, molestation, gender violence, workplace harassment, eve teasing, unsafe environment, abuse against women, rape threat",
    "legal_aid":
       "legal help, lawyer, court case, legal advice, rights violation, legal aid services, property dispute, consumer court, legal representation, legal consultation",
    "health_emergency":
       "medical emergency, ambulance, serious injury, accident, unconscious person, heart attack, stroke, severe bleeding, emergency treatment, urgent healthcare",
    "animal_husbandry":
        "animal husbandry, livestock support, cattle care, cow health, buffalo health, goat farming, poultry farming, veterinary support, animal disease, pet injury, dairy farming",
    "senior_citizen": 
       "senior citizen support, elderly abuse, elder care, old age assistance, aging parent support, pensioner help, elder neglect, elderly welfare",
    "disaster_relief": 
      "flood, earthquake, cyclone, landslide, tsunami, natural disaster, fire disaster, evacuation support, disaster response, emergency shelter",
    "labour_rights": 
       "labour rights, workplace dispute, salary not paid, wage issue, labour exploitation, worker rights, employer abuse, contract violation, unfair dismissal",
    "consumer_complaint": 
      "consumer complaint, defective product, service complaint, refund issue, fake product, seller fraud, consumer rights violation, poor service, warranty dispute",
    "road_accident": 
      "road accident, traffic accident, car crash, bike accident, vehicle collision, hit and run, highway accident, emergency roadside assistance",
    "missing_person": 
      "missing person, missing adult, kidnapped person, person disappeared, person not found, runaway individual, tracing missing individual",
    "general":
       "general help, emergency assistance, support services, public helpline, civic assistance, unspecified problem"
}

_model = None
CATEGORY_EMBEDDINGS = None

def get_category_embeddings():
    global CATEGORY_EMBEDDINGS

    if CATEGORY_EMBEDDINGS is None:
        model = get_model()
        CATEGORY_EMBEDDINGS = model.encode(
            list(CATEGORY_DESCRIPTIONS.values()),
            convert_to_tensor=True
        )

    return CATEGORY_EMBEDDINGS

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
    sorted_indices = scores.argsort(descending=True)


    top_idx = sorted_indices[0].item()
    second_idx = sorted_indices[1].item()


    top_score = round(scores[top_idx].item(), 2)
    margin = round(top_score - scores[second_idx].item(), 2)

    MIN_CONFIDENCE = 0.35
    MIN_MARGIN = 0.05

    if top_score < MIN_CONFIDENCE or margin < MIN_MARGIN:
        return {"category": "general", "confidence": top_score, "ambiguous": True}

    return {"category": CATEGORIES[top_idx], "confidence": top_score, "ambiguous": False}






