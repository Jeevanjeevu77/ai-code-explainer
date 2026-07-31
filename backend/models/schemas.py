"""
models/schemas.py
==================
Pydantic models define the shape of data going in and out of our API.
Think of them as blueprints or contracts for our data.

Pydantic automatically:
- Validates that required fields are present
- Checks that data types are correct
- Gives clear error messages when something is wrong
"""

from pydantic import BaseModel, Field
from typing import Optional, Literal


class CodeRequest(BaseModel):
    """
    The data we expect when a user sends code to be explained.
    
    Example JSON body:
    {
        "code": "for i in range(10): print(i)",
        "language": "python",
        "mode": "beginner"
    }
    """
    code: str = Field(
        ...,  # ... means this field is REQUIRED
        min_length=1,
        max_length=10000,
        description="The source code to analyze"
    )
    language: str = Field(
        default="auto",
        description="Programming language (python, javascript, java, cpp, auto)"
    )
    mode: Literal["beginner", "intermediate"] = Field(
        default="beginner",
        description="Explanation mode - beginner uses simpler language"
    )


class FollowUpRequest(BaseModel):
    """
    For the 'Ask a follow-up question' feature.
    Users can chat with the AI about their code.
    """
    code: str = Field(..., min_length=1, max_length=10000)
    question: str = Field(..., min_length=1, max_length=500)
    language: str = Field(default="auto")
    mode: Literal["beginner", "intermediate"] = Field(default="beginner")
    # Optional: previous conversation for context
    conversation_history: Optional[list] = Field(default=[])


class LineExplanation(BaseModel):
    """Explanation for a single line of code."""
    line_number: int
    code: str           # The actual line of code
    explanation: str    # What this line does


class ExplainResponse(BaseModel):
    """
    What we send back after explaining code.
    """
    simple_explanation: str         # The "big picture" explanation
    line_by_line: list[LineExplanation]   # Each line explained
    key_concepts: list[str]         # Important concepts used in the code
    language_detected: str          # Which language we think it is


class ImproveResponse(BaseModel):
    """Response for the code improvement feature."""
    improved_code: str              # The better version of the code
    changes_made: list[str]         # List of improvements made
    explanation: str                # Why these changes are better


class PseudocodeResponse(BaseModel):
    """Response for converting code to pseudocode."""
    pseudocode: str                 # Human-readable pseudocode
    steps: list[str]               # Step-by-step breakdown
    explanation: str               # What the algorithm does overall


class ConfusionItem(BaseModel):
    """A single confusing part of the code."""
    line_numbers: list[int]         # Which lines are confusing
    code_snippet: str               # The confusing code
    why_confusing: str             # Why beginners find this hard
    simplified_explanation: str    # A clearer way to understand it
    difficulty_level: Literal["mild", "moderate", "complex"]


class ConfusionResponse(BaseModel):
    """Response for the confusion detector feature."""
    overall_complexity: Literal["easy", "medium", "hard"]
    confusion_items: list[ConfusionItem]
    summary: str                    # Overall assessment


class FollowUpResponse(BaseModel):
    """Response to a follow-up question about code."""
    answer: str
    related_concepts: list[str]


class ErrorResponse(BaseModel):
    """Standard error response format."""
    error: str
    detail: str
    suggestion: str    # What the user can do to fix it
