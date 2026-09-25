from typing import Literal, Optional
from pydantic import BaseModel

class IntentSchema(BaseModel):
    
    urgency_tier: Literal[ 
        
        "emergency",
        "urgent",
        "general",
    ]

    state: Optional[str] = None
    district: Optional[str] = None
    country: str
    language: Optional[str] = "English"

