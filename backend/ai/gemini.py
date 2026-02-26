import google.generativeai as genai
import json
import re
from typing import Optional
import os

class GeminiService:
    def __init__(self):
        self.model = None
        self._configure()

    def _configure(self):
        api_key = os.getenv('GEMINI_API_KEY', '')
        if not api_key:
            return

        try:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel(
                model_name='gemini-2.0-flash',
                system_instruction="""You are Clarity AI, an intelligent insurance data analytics assistant embedded in the Clarity BI dashboard.
You have access to REAL, DETAILED data provided in each message under sections like:
  === MONTHLY SALES ===, === DEALER PERFORMANCE ===, === PRODUCT MIX ===,
  === CLAIMS BY STATUS ===, === MONTHLY CLAIMS TREND ===, etc.

RULES:
- ALWAYS read and use the exact numbers from the data context provided.
- When asked "which month has most/least sales" → scan the MONTHLY SALES table and give the specific period and premium value.
- When asked about top/bottom dealers, products, makes → scan the relevant breakdown table in the context.
- Never say you don't have data if it is present in the context.
- Quote exact figures: e.g. **March 2024 had the highest premium at 1,245,300.00**.
- Highlight rankings, comparisons, and percentage differences where helpful.
- Keep responses concise but precise. Use bullet points for lists.
- Use **bold** for key numbers and periods.
- Remember prior messages in the conversation.

RESPONSE STYLE:
- Lead with the direct answer in one sentence.
- Then provide supporting detail (table rows, comparisons, trend direction).
- End with a short actionable insight or recommendation if relevant.

ACTIONS:
When your response relates to navigating or filtering the dashboard, include a JSON action block at the VERY END, wrapped in ```action``` markers.

Available actions:
1. navigate - Switch to a specific dashboard view
   views: "report" | "analytics" | "claims" | "performance" | "partners" | "data-manager"
2. filters - Apply data filters (use exact values from AVAILABLE FILTER VALUES in the context)
   keys: dealer, product, year, month, make, claim_status, date_from, date_to
3. create_template - Create a pre-built report page
   templates: "executive-summary" | "sales-performance" | "claims-analysis" | "risk-monitor" | "dealer-insights" | "product-focus"

Examples:
```action
{"navigate": "claims", "filters": {"claim_status": "Approved"}}
```
```action
{"filters": {"year": "2024", "month": "3"}}
```
```action
{"create_template": "sales-performance"}
```

Only include an action when it adds clear value. Put the action block at the VERY END, after all text."""
            )
        except Exception as e:
            print(f"Gemini configuration error: {e}")
            self.model = None

    @property
    def is_available(self) -> bool:
        return self.model is not None

    def _build_history(self, history: list[dict]) -> list[dict]:
        """Convert frontend history format to Gemini format."""
        gemini_history = []
        for msg in history:
            role = msg.get('role', '')
            content = msg.get('content', '')
            if role == 'user':
                gemini_history.append({'role': 'user', 'parts': [content]})
            elif role == 'assistant':
                gemini_history.append({'role': 'model', 'parts': [content]})
        return gemini_history

    def chat(self, message: str, data_context: str, history: list[dict] = None) -> dict:
        """Send a message with data context and history to Gemini."""
        if not self.is_available:
            return {
                'text': "⚠️ AI is not configured. Please set your GEMINI_API_KEY in the .env file.",
                'actions': None,
                'next_suggestions': []
            }

        try:
            full_message = f"""--- LIVE DATA CONTEXT (use this to answer precisely) ---
{data_context}
--- END DATA CONTEXT ---

USER QUESTION: {message}

Answer using the actual numbers from the data context above."""

            # Use chat session with history for memory
            gemini_history = self._build_history(history or [])
            chat_session = self.model.start_chat(history=gemini_history)
            response = chat_session.send_message(full_message)
            raw_text = response.text

            # Extract action block
            text, actions = self._extract_actions(raw_text)

            # Generate 3 context-aware follow-up suggestions
            next_suggestions = self._get_next_suggestions(data_context, message, text)

            return {
                'text': text.strip(),
                'actions': actions,
                'next_suggestions': next_suggestions
            }

        except Exception as e:
            return {
                'text': f"⚠️ AI Error: {str(e)}. Please try again.",
                'actions': None,
                'next_suggestions': []
            }

    def _get_next_suggestions(self, data_context: str, last_question: str, last_answer: str) -> list[str]:
        """Generate 3 short follow-up questions based on the conversation."""
        if not self.is_available:
            return []
        try:
            prompt = f"""Based on this conversation about insurance analytics data:

User asked: {last_question}
AI answered: {last_answer[:500]}

Suggest exactly 3 short follow-up questions the user might want to ask next.
Each question should be on its own line, no numbering, no explanation — just the question text.
Keep them concise (under 12 words each) and directly relevant to the answer."""

            response = self.model.generate_content(prompt)
            questions = [q.strip() for q in response.text.strip().split('\n') if q.strip()]
            # Remove any accidental numbering or bullets
            cleaned = []
            for q in questions[:3]:
                q = re.sub(r'^[\d\.\-\*\•]+\s*', '', q).strip()
                if q:
                    cleaned.append(q)
            return cleaned[:3]
        except Exception:
            return []

    def _extract_actions(self, text: str) -> tuple[str, Optional[dict]]:
        """Extract structured action JSON from response text."""
        pattern = r'```action\s*\n?(.*?)\n?```'
        matches = re.findall(pattern, text, re.DOTALL)

        if matches:
            try:
                action_json = json.loads(matches[-1].strip())
                clean_text = re.sub(pattern, '', text, flags=re.DOTALL).strip()
                return clean_text, action_json
            except json.JSONDecodeError:
                pass

        return text, None

    def get_suggestions(self, data_context: str) -> list[str]:
        """Generate suggested questions based on current data — question types that the data can actually answer."""
        if not self.is_available:
            return []

        try:
            prompt = f"""You are an insurance analytics AI. Based on the data below, suggest 5 short, specific questions a user would want to ask. 
The questions must be answerable from the data provided (monthly tables, dealer lists, product mix, claims breakdown).
Prefer questions like: "Which month had the highest premium?", "Who is the top dealer?", "What is the most common claim status?"

Data:
{data_context[:3000]}

Return ONLY the questions, one per line, no numbering, no bullets."""

            response = self.model.generate_content(prompt)
            suggestions = [s.strip() for s in response.text.strip().split('\n') if s.strip()]
            return suggestions[:5]

        except Exception:
            return [
                "Which month had the highest premium?",
                "Who is the top performing dealer?",
                "What is the most common claim status?",
                "Which product generates the most revenue?",
                "What is the current loss ratio trend?",
            ]
