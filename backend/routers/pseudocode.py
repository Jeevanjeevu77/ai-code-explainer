"""
routers/pseudocode.py
======================
Handles the /api/pseudocode endpoint.
Converts actual code to plain English pseudocode.

Pseudocode is a great learning tool because it shows the LOGIC
of a program without getting lost in syntax details.
"""

from fastapi import APIRouter, HTTPException
from models.schemas import CodeRequest, PseudocodeResponse
from services.ai_service import ai_service

router = APIRouter()


@router.post("/pseudocode", response_model=None)
async def convert_to_pseudocode(request: CodeRequest):
    """
    Convert source code to pseudocode.
    
    Pseudocode is like a "recipe" for your algorithm written in plain English.
    It helps you understand WHAT the code does without worrying about HOW
    the specific language syntax works.
    
    Returns:
    - pseudocode: The plain English version
    - steps: Step-by-step breakdown
    - explanation: What the algorithm does overall
    """
    
    if not request.code.strip():
        raise HTTPException(
            status_code=400,
            detail={
                "error": "Empty code",
                "detail": "No code was provided to convert.",
                "suggestion": "Paste some code to convert it to pseudocode!"
            }
        )
    
    try:
        result = await ai_service.convert_to_pseudocode(
            code=request.code,
            language=request.language,
            mode=request.mode
        )
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Conversion failed",
                "detail": str(e),
                "suggestion": "Try with different code or check your API connection."
            }
        )
