NATIONAL_FALLBACK = {

    "India": {
        "cyber_crime": [{"name": "National Cyber Crime Helpline", "phone": "1930"}],
        "mental_health": [{"name": "Tele-MANAS", "phone": "14416"}],
        "child_helpline": [{"name": "Child Helpline", "phone": "1098"}],
        "women_safety": [{"name": "Women Helpline", "phone": "181"}],
        "domestic_violence": [{"name": "Women Helpline", "phone": "181"}],
        "legal_aid": [{"name": "NALSA Legal Services", "phone": "15100"}],
        "senior_citizen": [{"name": "Elder Line", "phone": "14567"}],
        "disaster_relief": [{"name": "Disaster Management", "phone": "1078"}],
        "consumer_complaint": [{"name": "National Consumer Helpline", "phone": "1915"}],
        "road_accident": [{"name": "National Emergency", "phone": "112"}],
        "missing_person": [{"name": "Police Emergency", "phone": "112"}],
        "default": [{"name": "National Emergency", "phone": "112"}],
    },

    "United States": {
        "cyber_crime": [{"name": "FBI Internet Crime Complaint Center", "phone": "980"}],
        "mental_health": [{"name": "988 Suicide & Crisis Lifeline", "phone": "988"}],
        "child_helpline": [{"name": "Childhelp National Child Abuse Hotline", "phone": "1-800-422-4453"}],
        "women_safety": [{"name": "National Domestic Violence Hotline", "phone": "800-799-7233"}],
        "domestic_violence": [{"name": "National Domestic Violence Hotline", "phone": "800-799-7233"}],
        "default": [{"name": "Emergency Services", "phone": "911"}]
    },

    "Canada": {
        "mental_health": [{"name": "Suicide Crisis Helpline", "phone": "988"}],
        "child_helpline": [{"name": "Kids Help Phone", "phone": "1-800-668-6868"}],
        "women_safety": [{"name": "Assaulted Women's Helpline", "phone": "1-866-863-0511"}],
        "default": [{"name": "Emergency Services", "phone": "911"}]
    },

    "United Kingdom": {
        "mental_health": [{"name": "Samaritans", "phone": "116123"}],
        "child_helpline": [{"name": "Childline UK", "phone": "08001111"}],
        "women_safety": [{"name": "National Domestic Abuse Helpline", "phone": "08082000247"}],
        "default": [{"name": "Emergency Services", "phone": "999"}]
    },

    "Australia": {
        "mental_health": [{"name": "Lifeline Australia", "phone": "131114"}],
        "child_helpline": [{"name": "Kids Helpline", "phone": "1800551800"}],
        "default": [{"name": "Emergency Services", "phone": "000"}]
    },

    "Germany": {
        "mental_health": [{"name": "TelefonSeelsorge", "phone": "08001110111"}],
        "child_helpline": [{"name": "Nummer gegen Kummer", "phone": "116111"}],
        "default": [{"name": "Emergency Services", "phone": "112"}]
    },

    "France": {
        "child_helpline": [{"name": "Allo Enfance en Danger", "phone": "119"}],
        "mental_health": [{"name": "Suicide Prevention", "phone": "3114"}],
        "default": [{"name": "Emergency Services", "phone": "112"}]
    },

    "Spain": {
        "child_helpline": [{"name": "ANAR Foundation", "phone": "116111"}],
        "default": [{"name": "Emergency Services", "phone": "112"}]
    },

    "Italy": {
        "child_helpline": [{"name": "Telefono Azzurro", "phone": "19696"}],
        "default": [{"name": "Emergency Services", "phone": "112"}]
    },

    "Netherlands": {
        "child_helpline": [{"name": "Kindertelefoon", "phone": "08000432"}],
        "default": [{"name": "Emergency Services", "phone": "112"}]
    },

    "Belgium": {
        "child_helpline": [{"name": "Child Focus", "phone": "116000"}],
        "default": [{"name": "Emergency Services", "phone": "112"}]
    },

    "Japan": {
        "mental_health": [{"name": "Yorisoi Hotline", "phone": "0120279338"}],
        "child_helpline": [{"name": "Child Guidance Hotline", "phone": "189"}],
        "default": [{"name": "Police", "phone": "110"}]
    },

    "South Korea": {
        "mental_health": [{"name": "Mental Health Crisis Hotline", "phone": "15770199"}],
        "child_helpline": [{"name": "Child Protection Hotline", "phone": "112"}],
        "default": [{"name": "Emergency Services", "phone": "119"}]
    },

    "Singapore": {
        "mental_health": [{"name": "Samaritans of Singapore", "phone": "1767"}],
        "default": [{"name": "Emergency Services", "phone": "999"}]
    },

    "Brazil": {
        "mental_health": [{"name": "CVV Emotional Support", "phone": "188"}],
        "child_helpline": [{"name": "Disque 100", "phone": "100"}],
        "default": [{"name": "Police Emergency", "phone": "190"}]
    },

    "South Africa": {
        "mental_health": [{"name": "SADAG Suicide Crisis Line", "phone": "0800567567"}],
        "child_helpline": [{"name": "Childline South Africa", "phone": "116"}],
        "default": [{"name": "Emergency Services", "phone": "112"}]
    },

    "default": {
        "default": [{
            "name": "General Guidance",
            "phone": None,
            "note": "Please contact your local emergency services."
        }]
    }
}

def get_fallback(country, category):
    country_data = NATIONAL_FALLBACK.get(
        country,
        NATIONAL_FALLBACK["default"]
    )

    return country_data.get(
        category,
        country_data.get(
            "default",
            NATIONAL_FALLBACK["default"]["default"]
        )
    )
