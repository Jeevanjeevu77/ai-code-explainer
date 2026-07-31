"""
routers/explain.py
===================
This router handles the /api/explain endpoint.

A "router" in FastAPI is like a mini-application that handles
a specific group of related endpoints. We separate them to keep
the code organized and easy to find.
"""

from fastapi import APIRouter, HTTPException
from models.schemas import CodeRequest
from services.ai_service import ai_service

# Create a router instance
# All routes defined here will be prefixed with /api (from main.py)
router = APIRouter()


@router.post("/explain", response_model=None)
async def explain_code(request: CodeRequest):
    """
    Main endpoint: Explain code in beginner-friendly terms.
    
    Accepts:
    - code: The source code to explain
    - language: Programming language (or 'auto' for detection)
    - mode: 'beginner' or 'intermediate'
    
    Returns:
    - simple_explanation: Overview of what the code does
    - line_by_line: Each line explained
    - key_concepts: Important concepts used
    - language_detected: The detected/confirmed language
    """
    
    # Validate that code isn't just whitespace
    if not request.code.strip():
        raise HTTPException(
            status_code=400,  # 400 = Bad Request
            detail={
                "error": "Empty code",
                "detail": "Please paste some code before clicking Explain!",
                "suggestion": "Try pasting a few lines of Python, JavaScript, or any other language."
            }
        )
    
    try:
        # Call our AI service to get the explanation
        result = await ai_service.explain_code(
            code=request.code,
            language=request.language,
            mode=request.mode
        )
        return result
        
    except ValueError as e:
        # ValueError usually means something wrong with the input or AI response parsing
        raise HTTPException(
            status_code=422,  # 422 = Unprocessable Entity
            detail={
                "error": "Processing error",
                "detail": str(e),
                "suggestion": "Try with simpler code or check if the code is valid."
            }
        )
    except Exception as e:
        # Catch-all for unexpected errors (API down, network issues, etc.)
        error_msg = str(e)
        
        # Give helpful messages for common errors
        if "API key" in error_msg or "authentication" in error_msg.lower():
            detail = "Invalid API key. Please check your OPENAI_API_KEY in the .env file."
        elif "rate limit" in error_msg.lower():
            detail = "Too many requests. Please wait a moment and try again."
        elif "model" in error_msg.lower():
            detail = f"Model error: {error_msg}"
        else:
            detail = f"An unexpected error occurred: {error_msg}"
            
        raise HTTPException(
            status_code=500,  # 500 = Internal Server Error
            detail={
                "error": "AI service error",
                "detail": detail,
                "suggestion": "Check that your API key is valid and has credits."
            }
        )
