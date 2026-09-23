from typing import Literal, Optional
from pydantic import BaseModel

class IntentSchema(BaseModel):
    category: Literal["cyber_crime", "domestic_violence", "mental_health", "child_helpline", "women_safety", "legal_aid", "animal_husbandry", "general"]

    urgency_tier: Literal[ 
        
        "emergency",
        "urgent",
        "general",
    ]

    state: Optional[str] = None
    district: Optional[str] = None
    country: str
    language: Optional[str] = "English"

