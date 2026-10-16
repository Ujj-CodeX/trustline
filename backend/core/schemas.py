from typing import Literal, Optional
from pydantic import BaseModel,model_validator


SupportCategory = Literal[
    "cyber_crime",
    "domestic_violence",
    "mental_health",
    "child_helpline",
    "women_safety",
    "legal_aid",
    "health_emergency",
    "animal_husbandry",
    "senior_citizen",
    "disaster_relief",
    "labour_rights",
    "consumer_complaint",
    "road_accident",
    "missing_person",
    "general",
]

RouteType = Literal[
    "in_scope",
    "needs_clarification",
    "out_of_scope",
]

class IntentSchema(BaseModel):

    category: Optional[SupportCategory] = None
    
    urgency_tier: Literal[ 
        
        "emergency",
        "urgent",
        "general",
    ]

    state: Optional[str] = None
    district: Optional[str] = None
    country: str
    language: Optional[str] = "English"

class RoutingSchema(BaseModel):
    route: RouteType
    category: Optional[SupportCategory] = None

    urgency_tier: Literal[
        "emergency",
        "urgent",
        "general",
    ]="general"

    state: Optional[str] = None
    district: Optional[str] = None
    country: str
    language:str = "English"

    clarification_question: Optional[str] = None


    @model_validator(mode="after")
    def validate_route_category(self):
        if self.route == "in_scope" and self.category is None:
            raise ValueError(
                "An in-scope request must have a support category."
            )

        if self.route != "in_scope" and self.category is not None:
            raise ValueError(
                "Non-support routes must not have a support category."
            )

        return self

    

    

        

