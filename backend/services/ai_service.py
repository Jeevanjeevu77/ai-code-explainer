"""
services/ai_service.py
========================
This is the heart of our application - where we talk to the AI!

This service:
1. Builds carefully crafted prompts for each feature
2. Calls the OpenAI-compatible API
3. Parses and returns the responses

Key concept: PROMPT ENGINEERING
Good prompts = Good AI responses. We've designed specific prompts
for each feature to get the best possible results.

"""

import os
import json
import re
import logging
from openai import AsyncOpenAI
from typing import Optional

logger = logging.getLogger(__name__)


class AIService:
    """
    Handles all communication with the AI model.
    
    We use AsyncOpenAI which allows multiple requests to run
    simultaneously (great for performance!).
    """
    
    def __init__(self):
        # Get the API key from environment variables (stored in .env file)
        api_key = os.getenv("OPENAI_API_KEY")
        base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
        self.model = os.getenv("AI_MODEL", "gpt-4o-mini")
        # Store credentials and defer client initialization until first use.
        # This prevents raising at import time so the app can start even
        # when environment variables are not yet configured during development.
        self.api_key = api_key
        self.base_url = base_url
        self.client = None
    
    async def call_ai(self, system_prompt: str, user_prompt: str, expect_json: bool = True) -> str:
        """
        Low-level function to call the AI API.
        
        Parameters:
        - system_prompt: Instructions for how the AI should behave
        - user_prompt: The actual question or task
        - expect_json: If True, we tell the AI to respond in JSON format
        
        Returns: The AI's response as a string
        """
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        # Build request parameters
        kwargs = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.3,   # Lower = more consistent/factual responses
            "max_tokens": 3000,
        }
        
        # Ask for JSON format if needed
        if expect_json:
            kwargs["response_format"] = {"type": "json_object"}
        
        try:
            # Initialize client lazily if not already created
            if self.client is None:
                if not self.api_key:
                    raise ValueError(
                        "OPENAI_API_KEY not found! Please add it to your .env file.\n"
                        "See .env.example for the format."
                    )
                self.client = AsyncOpenAI(api_key=self.api_key, base_url=self.base_url)

            response = await self.client.chat.completions.create(**kwargs)
            content = response.choices[0].message.content
            if not content:
                raise ValueError("The AI model returned an empty response. This may be due to content filtering or credit limits.")
            return content
        except Exception as e:
            logger.exception("AI API call failed")
            raise Exception(f"AI API call failed: {str(e)}")
    
    def _get_mode_instructions(self, mode: str) -> str:
        """
        Returns instructions that shape how the AI explains things
        based on the user's chosen mode.
        """
        if mode == "beginner":
            return """
            You are explaining to someone who has NEVER coded before.
            - Use simple everyday language, NO jargon
            - Use real-world analogies (like explaining to a 10-year-old)
            - Compare code concepts to things from daily life
            - Keep sentences short and clear
            - If you must use a technical term, immediately explain it
            """
        else:  # intermediate
            return """
            You are explaining to someone who knows programming basics.
            - Use proper technical terminology
            - Explain design patterns and best practices
            - Mention time/space complexity where relevant
            - Reference standard library functions and their documentation
            - Discuss edge cases and potential improvements
            """
    
    # =========================================================
    # FEATURE 1: CODE EXPLANATION
    # =========================================================
    
    async def explain_code(self, code: str, language: str, mode: str) -> dict:
        """
        Explains code in simple terms with line-by-line breakdown.
        
        This uses a carefully crafted prompt to get structured output
        that we can display nicely in the frontend.
        """
        mode_instructions = self._get_mode_instructions(mode)
        
        system_prompt = f"""
        You are a friendly coding teacher who specializes in making code easy to understand.
        
        {mode_instructions}
        
        Always respond with valid JSON in exactly this format:
        {{
            "simple_explanation": "A clear 2-3 sentence overview of what this code does",
            "line_by_line": [
                {{
                    "line_number": 1,
                    "code": "the actual line of code",
                    "explanation": "what this line does in simple terms"
                }}
            ],
            "key_concepts": ["concept1", "concept2"],
            "language_detected": "the programming language"
        }}
        
        For the line_by_line, include ALL non-empty lines.
        Skip blank lines and comment-only lines unless they're important.
        """
        
        user_prompt = f"""
        Please explain this {language} code:
        
        ```{language}
        {code}
        ```
        
        Mode: {mode}
        Remember: Use the {mode} explanation style!
        """
        
        response_text = await self.call_ai(system_prompt, user_prompt)
        return self._safe_parse_json(response_text)
    
    # =========================================================
    # FEATURE 2: CODE IMPROVEMENT
    # =========================================================
    
    async def improve_code(self, code: str, language: str, mode: str) -> dict:
        """
        Suggests improvements to make code cleaner and better.
        """
        mode_instructions = self._get_mode_instructions(mode)
        
        system_prompt = f"""
        You are a senior developer doing a friendly code review.
        Your goal is to help beginners write better code.
        
        {mode_instructions}
        
        Focus on:
        - Readability (is it easy to understand?)
        - Best practices for the language
        - Potential bugs or errors
        - Performance (if relevant)
        
        Respond with valid JSON:
        {{
            "improved_code": "the complete improved version of the code",
            "changes_made": [
                "Changed X to Y because...",
                "Added Z because..."
            ],
            "explanation": "Overall explanation of why these changes make the code better"
        }}
        
        IMPORTANT: Always provide the COMPLETE improved code, not just snippets.
        """
        
        user_prompt = f"""
        Please improve this {language} code and explain the improvements:
        
        ```{language}
        {code}
        ```
        """
        
        response_text = await self.call_ai(system_prompt, user_prompt)
        return self._safe_parse_json(response_text)
    
    # =========================================================
    # FEATURE 3: PSEUDOCODE CONVERSION
    # =========================================================
    
    async def convert_to_pseudocode(self, code: str, language: str, mode: str) -> dict:
        """
        Converts code to plain English pseudocode.
        Great for understanding the algorithm without syntax noise.
        """
        mode_instructions = self._get_mode_instructions(mode)
        
        system_prompt = f"""
        You are an expert at explaining algorithms.
        Convert code into clear, readable pseudocode that anyone can understand.
        
        {mode_instructions}
        
        Pseudocode rules:
        - Write in plain English
        - Use simple keywords like: START, END, IF, ELSE, FOR EACH, WHILE, SET, PRINT
        - Indent to show structure
        - No programming language syntax
        
        Respond with valid JSON:
        {{
            "pseudocode": "the complete pseudocode as a formatted string",
            "steps": [
                "Step 1: ...",
                "Step 2: ..."
            ],
            "explanation": "What this algorithm does overall in plain English"
        }}
        """
        
        user_prompt = f"""
        Convert this {language} code to pseudocode:
        
        ```{language}
        {code}
        ```
        """
        
        response_text = await self.call_ai(system_prompt, user_prompt)
        return self._safe_parse_json(response_text)
    
    # =========================================================
    # FEATURE 4: CONFUSION DETECTOR
    # =========================================================
    
    async def detect_confusion(self, code: str, language: str, mode: str) -> dict:
        """
        Identifies parts of code that are typically confusing for beginners.
        Highlights tricky patterns and explains them clearly.
        """
        system_prompt = f"""
        You are an expert at identifying what makes code confusing for beginners.
        
        Look for patterns like:
        - Complex nested logic (loops inside loops, nested conditions)
        - Tricky operators (ternary, bitwise, walrus operator)
        - Recursion
        - Closures and scope issues
        - Pointer/reference confusion
        - Complex data transformations
        - Magic numbers or unclear variable names
        - Advanced language features
        
        Respond with valid JSON:
        {{
            "overall_complexity": "easy" | "medium" | "hard",
            "confusion_items": [
                {{
                    "line_numbers": [1, 2, 3],
                    "code_snippet": "the confusing code snippet",
                    "why_confusing": "Why beginners find this hard to understand",
                    "simplified_explanation": "A clearer way to think about this",
                    "difficulty_level": "mild" | "moderate" | "complex"
                }}
            ],
            "summary": "Overall assessment of the code's complexity and main challenges"
        }}
        
        If the code is simple with no confusing parts, return an empty confusion_items array.
        """
        
        user_prompt = f"""
        Analyze this {language} code for confusing patterns:
        
        ```{language}
        {code}
        ```
        
        Focus on what a {mode}-level programmer would find confusing.
        """
        
        response_text = await self.call_ai(system_prompt, user_prompt)
        return self._safe_parse_json(response_text)
    
    # =========================================================
    # FEATURE 5: FOLLOW-UP QUESTIONS (Chat with Code)
    # =========================================================
    
    async def answer_followup(
        self,
        code: str,
        question: str,
        language: str,
        mode: str,
        conversation_history: Optional[list] = None
    ) -> dict:
        """
        Answers follow-up questions about the code.
        Maintains conversation context for multi-turn chat.
        """
        mode_instructions = self._get_mode_instructions(mode)
        
        system_prompt = f"""
        You are a patient coding tutor helping a student understand code.
        You have access to their code and are answering their questions about it.
        
        {mode_instructions}
        
        Keep answers focused and relevant to the code.
        If the question is unrelated to the code, gently redirect.
        
        Respond with valid JSON:
        {{
            "answer": "Your clear, helpful answer to the question",
            "related_concepts": ["concept1", "concept2"]
        }}
        """
        
        # Build conversation context if we have history
        context = ""
        if conversation_history:
            context = "\n\nPrevious conversation:\n"
            for msg in conversation_history[-4:]:  # Keep last 4 messages for context
                role = "Student" if msg.get("role") == "user" else "Tutor"
                context += f"{role}: {msg.get('content', '')}\n"
        
        user_prompt = f"""
        Here is the code we're discussing:
        
        ```{language}
        {code}
        ```
        {context}
        
        Student's question: {question}
        """
        
        response_text = await self.call_ai(system_prompt, user_prompt)
        return self._safe_parse_json(response_text)
    
    # =========================================================
    # UTILITY FUNCTIONS
    # =========================================================
    
    def _safe_parse_json(self, text: str) -> dict:
        """
        Safely parses JSON from the AI response.
        Sometimes AI wraps JSON in markdown code blocks, so we handle that.
        """
        # Remove markdown code fences if present
        # The AI sometimes wraps JSON in ```json ... ``` blocks
        if not text:
            raise ValueError("No response text received from AI to parse.")
            
        text = text.strip()
        
        # Extract the first substring that looks like a JSON object
        match = re.search(r'(\{.*\})', text, re.S)
        if match:
            text = match.group(1)
        
        try:
            return json.loads(text)
        except json.JSONDecodeError as e:
            # If we can't parse JSON, return a structured error
            raise ValueError(f"Failed to parse AI response as JSON: {str(e)}\nResponse was: {text[:200]}")


# Create a single instance to be reused across the app
# This is the Singleton pattern - one shared instance
ai_service = AIService()
