"""
AI Code Explainer - FastAPI Backend
====================================
This is the main entry point for our backend server.
FastAPI is a modern Python web framework that's fast and easy to use.
"""

import os
import sys
from pathlib import Path

# -------------------------------------------------------------------
# Ensure the *backend* directory is on sys.path so that
# `from routers import ...` and `from models import ...` work
# regardless of the current working directory.
# -------------------------------------------------------------------
_backend_dir = Path(__file__).resolve().parent
if str(_backend_dir) not in sys.path:
    sys.path.insert(0, str(_backend_dir))

from dotenv import load_dotenv

# Load environment variables from backend/.env
# We build the absolute path so it works no matter where you launch from.
load_dotenv(dotenv_path=_backend_dir / ".env", override=True)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import explain, improve, pseudocode, confusion, followup
from models.schemas import CodeRequest, FollowUpRequest, ExplainResponse, FollowUpResponse

# Create the FastAPI application instance
app = FastAPI(
    title="AI Code Explainer API",
    description="A beginner-friendly API to explain, improve, and understand code using AI.",
    version="1.0.0"
)

# -------------------------------------------------------------------
# Validate required environment variables at startup
# -------------------------------------------------------------------
@app.on_event("startup")
async def startup_event():
    # 1. Validate Env Vars without crashing the app during deployment
    required = ["OPENAI_API_KEY", "AI_MODEL", "OPENAI_BASE_URL"]
    missing = [var for var in required if not os.getenv(var)]
    if missing:
        print(f"⚠️ Missing environment variables: {', '.join(missing)}")
    else:
        print(f"--- AI Model: {os.getenv('AI_MODEL')} ---")

    # 2. Print registered routes for verification
    print("\n--- Registered Endpoints ---")
    for route in app.routes:
        if hasattr(route, "path"):
            methods = getattr(route, "methods", ["GET"])
            print(f"{list(methods)} {route.path}")
    print("---------------------------\n")

# CORS (Cross-Origin Resource Sharing) allows our React frontend (running on port 3000)
# to communicate with this backend (running on port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],   # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],   # Allow all headers
)

# Register all our route modules
# Each router handles a specific feature of the app
app.include_router(explain.router, prefix="/api", tags=["explain"])
app.include_router(improve.router, prefix="/api", tags=["improve"])
app.include_router(pseudocode.router, prefix="/api", tags=["pseudocode"])
app.include_router(confusion.router, prefix="/api", tags=["confusion"])
app.include_router(followup.router, prefix="/api", tags=["followup"])


@app.get("/")
def root():
    """Health check endpoint - confirms the server is running."""
    return {
        "message": "AI Code Explainer API is running!",
        "docs": "/docs",       # FastAPI auto-generates interactive docs here
        "redoc": "/redoc"      # Alternative docs UI
    }


@app.get("/health")
def health_check():
    """Simple health check for monitoring."""
    return {"status": "healthy"}
