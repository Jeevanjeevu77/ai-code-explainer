"""
routers/improve.py
===================
Handles the /api/improve endpoint.
Suggests ways to make code cleaner, more efficient, and follow best practices.
"""

from fastapi import APIRouter, HTTPException
from models.schemas import CodeRequest, ImproveResponse
from services.ai_service import ai_service

router = APIRouter()


@router.post("/improve", response_model=None)
async def improve_code(request: CodeRequest):
    """
    Analyzes code and provides improvement suggestions.
    
    This feature acts like a friendly senior developer
    doing a code review for you!
    
    Returns:
    - improved_code: A better version of your code
    - changes_made: List of specific improvements made
    - explanation: Why these changes make the code better
    """
    
    if not request.code.strip():
        raise HTTPException(
            status_code=400,
            detail={
                "error": "Empty code",
                "detail": "No code was provided to improve.",
                "suggestion": "Paste your code first, then click Improve Code!"
            }
        )
    
    # Don't try to improve very short snippets - they might not have much to improve
    if len(request.code.strip()) < 10:
        raise HTTPException(
            status_code=400,
            detail={
                "error": "Code too short",
                "detail": "The code snippet is too short to meaningfully improve.",
                "suggestion": "Try with a longer code snippet (at least a few lines)."
            }
        )
    
    try:
        result = await ai_service.improve_code(
            code=request.code,
            language=request.language,
            mode=request.mode
        )
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Improvement failed",
                "detail": str(e),
                "suggestion": "Check your API key and try again."
            }
        )
