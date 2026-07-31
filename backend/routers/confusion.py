"""
routers/confusion.py
=====================
Handles the /api/confusion endpoint.
Detects confusing patterns in code and explains them.

This is one of the most powerful features for beginners -
it proactively identifies parts that are typically hard to understand
and gives extra explanation for those specific parts.
"""

from fastapi import APIRouter, HTTPException
from models.schemas import CodeRequest, ConfusionResponse
from services.ai_service import ai_service

router = APIRouter()


@router.post("/confusion", response_model=None)
async def detect_confusion(request: CodeRequest):
    """
    Detect confusing patterns in code for beginners.
    
    This endpoint scans code for patterns that are typically
    difficult to understand, like:
    - Nested loops and conditions
    - Recursion
    - Complex operators
    - Closures and scope
    - Language-specific tricks
    
    Returns:
    - overall_complexity: easy/medium/hard
    - confusion_items: List of confusing spots with explanations
    - summary: Overall assessment
    """
    
    if not request.code.strip():
        raise HTTPException(
            status_code=400,
            detail={
                "error": "Empty code",
                "detail": "No code was provided to analyze.",
                "suggestion": "Paste some code to detect confusing parts!"
            }
        )
    
    try:
        result = await ai_service.detect_confusion(
            code=request.code,
            language=request.language,
            mode=request.mode
        )
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Analysis failed",
                "detail": str(e),
                "suggestion": "Try with different code or check your API connection."
            }
        )
