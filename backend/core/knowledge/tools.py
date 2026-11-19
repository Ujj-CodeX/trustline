from pydantic import BaseModel, ConfigDict, Field
from .retrieval import retrieve_knowledge, build_knowledge_context

class SearchGuidanceInput(BaseModel):
    model_config = ConfigDict(
        extra="forbid",
        str_strip_whitespace=True,
    )
    query: str = Field(min_length=3, max_length=1000)
    top_k: int = Field(default=3, ge=1, le=3)


def search_official_guidance(arguments):
    validated = SearchGuidanceInput.model_validate(arguments)

    results = retrieve_knowledge(
        validated.query,
        top_k=validated.top_k,
    )

    return {
        "results" : results,
    }

TOOL_REGISTRY = {
    "search_official_guidance": search_official_guidance,
}

TOOL_DEFINITIONS = [
    {
        "type": "function",
        "function": {
            "name": "search_official_guidance",
            "description": (
                "Search approved TrustLine knowledge documents "
                "for official support guidance. Use this for "
                "procedures and instructions, not phone numbers."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Knowledge topic to search."
                    },
                    "top_k": {
                        "type": "integer",
                        "description": "Number of results, maximum 3.",
                        "minimum": 1,
                        "maximum": 3
                    }
                },
                "required": ["query"],
                "additionalProperties": False
            }
        }
    }
]

def execute_tool(name, arguments):
    tool = TOOL_REGISTRY.get(name)

    if tool is None:
        raise ValueError(f"Tool not allowed: {name}")

    if not isinstance(arguments, dict):
        raise ValueError("Arguments must be a dictionary")

    return tool(arguments)


