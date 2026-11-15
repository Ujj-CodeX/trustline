from sentence_transformers import SentenceTransformer ,util
from .fallback_classifier import keyword_fallback_classify

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


OUT_OF_SCOPE_DESCRIPTIONS = {
    "small_talk": (
    "Casual social greetings, friendly pleasantries, and informal "
    "conversation that does not request assistance. Includes "
    "greeting someone, asking how they are doing, and social "
    "check-ins in English, Hindi, Hinglish, or other languages, "
    "without asking for support resources or helplines."
),
    "entertainment": (
        "Humor, jokes, riddles, movie recommendations, games, and "
        "entertainment requests unrelated to support services."
    ),
    "software_development": (
        "General programming, software debugging, code generation, "
        "framework questions, and technical development help unrelated "
        "to finding support or helplines."
    ),
    "general_information": (
        "General knowledge, trivia, educational explanations, "
        "ordinary mathematics, and factual questions unrelated to "
        "support services."
    ),
    "creative_and_daily_tasks": (
        "Creative writing, poems, recipes, greetings, logo design, "
        "and everyday writing tasks unrelated to support services."
    ),
    "other_unrelated_requests": (
        "Shopping recommendations, astrology, stock predictions, "
        "and other ordinary requests unrelated to helplines or "
        "supported assistance."
    ),
}


_model = None
CATEGORY_EMBEDDINGS = None
OUT_OF_SCOPE_EMBEDDINGS = None

def get_category_embeddings():
    global CATEGORY_EMBEDDINGS

    if CATEGORY_EMBEDDINGS is None:
        model = get_model()
        CATEGORY_EMBEDDINGS = model.encode(
            list(CATEGORY_DESCRIPTIONS.values()),
            convert_to_tensor=True
        )

    return CATEGORY_EMBEDDINGS

def get_out_of_scope_embeddings():
    global OUT_OF_SCOPE_EMBEDDINGS

    if OUT_OF_SCOPE_EMBEDDINGS is None:
        model = get_model()

        OUT_OF_SCOPE_EMBEDDINGS = model.encode(
            list(OUT_OF_SCOPE_DESCRIPTIONS.values()),
            convert_to_tensor=True,
        )
    return OUT_OF_SCOPE_EMBEDDINGS


def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")
    return _model






def classify_intent(query_text):
    model = get_model()

    # Encode the incoming query only once.
    query_emb = model.encode(
        query_text,
        convert_to_tensor=True,
    )

    category_embeddings = get_category_embeddings()
    out_of_scope_embeddings = get_out_of_scope_embeddings()

    category_scores = util.cos_sim(
        query_emb, category_embeddings
    )[0]

    out_of_scope_scores = util.cos_sim(
        query_emb, out_of_scope_embeddings
    )[0]

    sorted_indices = category_scores.argsort(descending=True)

    top_idx = sorted_indices[0].item()
    second_idx = sorted_indices[1].item()

    top_category = CATEGORIES[top_idx]
    support_score = float(category_scores[top_idx].item())
    second_score = float(category_scores[second_idx].item())
    category_margin = support_score - second_score

    out_of_scope_score = float(out_of_scope_scores.max().item())

    # Initial conservative thresholds; these still need calibration.
    MIN_SUPPORT_CONFIDENCE = 0.18
    MIN_OUT_OF_SCOPE_CONFIDENCE = 0.30
    OUT_OF_SCOPE_WIN_MARGIN = 0.04
    MIN_CATEGORY_MARGIN = 0.05

    scores = {
        "confidence": round(support_score, 3),
        "support_confidence": round(support_score, 3),
        "out_of_scope_confidence": round(out_of_scope_score, 3),
    }

    # Reject only when unrelated intent scores clearly beat
    # the strongest supported category.
    if (
        out_of_scope_score >= MIN_OUT_OF_SCOPE_CONFIDENCE
        and out_of_scope_score
        >= support_score + OUT_OF_SCOPE_WIN_MARGIN
    ):
        return {
            "route": "out_of_scope",
            "category": None,
            "ambiguous": False,
            **scores,
        }

    # Low support confidence is uncertainty, not proof of irrelevance.
    if support_score < MIN_SUPPORT_CONFIDENCE:
        return {
            "route": "needs_clarification",
            "category": None,
            "ambiguous": True,
            **scores,
        }

    # If support and unrelated intent are too close, do not guess.
    if (
        abs(support_score - out_of_scope_score) < 0.03
        and max(support_score, out_of_scope_score) >= 0.25
    ):
        return {
            "route": "needs_clarification",
            "category": None,
            "ambiguous": True,
            **scores,
        }

    # Resolve close category scores only when an existing
    # specific keyword category agrees with one of the top categories.
    if category_margin < MIN_CATEGORY_MARGIN:
        keyword_category = keyword_fallback_classify(
            query_text
        ).get("category")

        top_two_categories = {
            CATEGORIES[top_idx],
            CATEGORIES[second_idx],
        }

        if (
            keyword_category
            and keyword_category != "general"
            and keyword_category in top_two_categories
        ):
            top_category = keyword_category
        else:
            return {
                "route": "needs_clarification",
                "category": None,
                "ambiguous": True,
                **scores,
            }

    return {
        "route": "in_scope",
        "category": top_category,
        "ambiguous": False,
        **scores,
    }
