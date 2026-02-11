"""
Gemini AI Service — Context-aware chat with live data summaries + structured actions.
"""

import google.generativeai as genai
import json
import re
from typing import Optional
import os


class GeminiService:
    def __init__(self):
        self.model = None
        self.chat_session = None
        self._configure()

    def _configure(self):
        api_key = os.getenv('GEMINI_API_KEY', '')
        if not api_key:
            return

        try:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel(
                model_name='gemini-2.0-flash',
                system_instruction="""You are Clarity AI, an intelligent insurance data analytics assistant.
You help users understand their Sales & Claims data with precise, data-driven insights.

RULES:
- Always base your answers on the provided data context
- Use exact numbers from the data when available
- Provide actionable insights and recommendations
- Format key metrics clearly (use percentages, ratios, currency values)
- When the user asks about trends, explain what the data shows
- For comparisons, highlight significant differences
- If you don't have enough data, say so clearly
- Keep responses concise but informative
- Use markdown formatting for better readability
- Highlight important numbers in **bold**

ACTIONS:
When your response relates to specific data, you MUST include a JSON action block at the very end of your response.
The action block should be wrapped in ```action``` markers.

Available actions:
1. navigate - Switch to a specific dashboard view
   views: "report" | "analytics" | "claims" | "performance" | "partners" | "data-manager"
2. filter - Apply filters to focus on specific data
   keys: dealer, product, year, month, make, claim_status

Example action blocks:
```action
{"navigate": "claims", "filters": {"claim_status": "Approved"}}
```

```action
{"navigate": "analytics", "filters": {"dealer": "Dealer AJA", "year": "2021"}}
```

```action
{"navigate": "performance", "filters": {"make": "BMW"}}
```

Only include actions when the user asks about specific data. For general questions, omit the action block.
Always put the action block at the VERY END of your response, after all text."""
            )
        except Exception as e:
            print(f"Gemini configuration error: {e}")
            self.model = None

    @property
    def is_available(self) -> bool:
        return self.model is not None

    def chat(self, message: str, data_context: str, history: list[dict] = None) -> dict:
        """Send a message with data context to Gemini. Returns text + optional actions."""
        if not self.is_available:
            return {
                'text': "⚠️ AI is not configured. Please set your GEMINI_API_KEY in the .env file.",
                'actions': None
            }

        try:
            full_prompt = f"""CURRENT DATA CONTEXT:
{data_context}

USER QUESTION: {message}

Provide a helpful, data-driven response based on the above context. Be specific with numbers and percentages when available.
If the question relates to specific filtered data, include an action block at the end."""

            response = self.model.generate_content(full_prompt)
            raw_text = response.text

            # Extract action block from response
            text, actions = self._extract_actions(raw_text)

            return {
                'text': text.strip(),
                'actions': actions
            }

        except Exception as e:
            return {
                'text': f"⚠️ AI Error: {str(e)}. Please try again.",
                'actions': None
            }

    def _extract_actions(self, text: str) -> tuple[str, Optional[dict]]:
        """Extract structured action JSON from response text."""
        # Try to find ```action ... ``` blocks
        pattern = r'```action\s*\n?(.*?)\n?```'
        matches = re.findall(pattern, text, re.DOTALL)

        if matches:
            try:
                action_json = json.loads(matches[-1].strip())
                # Remove the action block from the visible text
                clean_text = re.sub(pattern, '', text, flags=re.DOTALL).strip()
                return clean_text, action_json
            except json.JSONDecodeError:
                pass

        return text, None

    def get_suggestions(self, data_context: str) -> list[str]:
        """Generate suggested questions based on current data."""
        if not self.is_available:
            return []

        try:
            prompt = f"""Based on this insurance data summary, suggest 5 short analytical questions a user would want to ask:

{data_context}

Return ONLY the questions, one per line, no numbering."""

            response = self.model.generate_content(prompt)
            suggestions = [s.strip() for s in response.text.strip().split('\n') if s.strip()]
            return suggestions[:5]

        except Exception:
            return [
                "What is the overall claim rate?",
                "Which dealer has the highest loss ratio?",
                "What are the most common part failures?",
                "How does premium trend over time?",
                "Which vehicle make has the most claims?"
            ]
