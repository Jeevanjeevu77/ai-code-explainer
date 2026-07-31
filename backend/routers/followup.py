"""
routers/followup.py
===================
This router handles the /api/followup endpoint for the "Ask a Question" feature.
"""

from fastapi import APIRouter, HTTPException
from models.schemas import FollowUpRequest, FollowUpResponse
from services.ai_service import ai_service

# Create a router instance
router = APIRouter()


@router.post("/followup", response_model=FollowUpResponse)
async def ask_question(request: FollowUpRequest):
    """
    Handles follow-up questions about the code.
    Users can ask specific questions like "What does line 5 do?" or "Why use a loop here?".
    """
    
    if not request.question.strip():
        raise HTTPException(
            status_code=400,
            detail={
                "error": "Empty question",
                "detail": "Please type a question before clicking Ask!",
                "suggestion": "Try asking something like 'What does this function return?'"
            }
        )
    
    try:
        # Call our AI service to get the answer
        result = await ai_service.answer_followup(
            code=request.code,
            question=request.question,
            language=request.language,
            mode=request.mode,
            conversation_history=request.conversation_history
        )
        return result
        
    except Exception as e:
        # Catch and format errors nicely
        error_msg = str(e)
        detail = "An unexpected error occurred while processing your question."
        
        if "API key" in error_msg or "authentication" in error_msg.lower():
            detail = "Invalid API key. Please check your .env file."
        elif "rate limit" in error_msg.lower():
            detail = "Too many requests. Please wait a moment."
            
        raise HTTPException(
            status_code=500,
            detail={
                "error": "AI service error",
                "detail": detail,
                "suggestion": "Check your connection and API key configuration."
            }
        )
