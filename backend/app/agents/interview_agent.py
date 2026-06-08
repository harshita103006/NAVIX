import json

from app.core.state import NavixState
from app.services.gemini import generate_response


def interview_agent(state: NavixState):

    print("Interview Agent Running...")

    role = state["target_roles"][0]

    prompt = f"""
    Generate interview questions for:

    {role}

    Return ONLY valid JSON.

    {{
      "technical_questions": [],
      "hr_questions": []
    }}
    """

    response = generate_response(prompt)

    response = response.replace("```json", "")
    response = response.replace("```", "")
    response = response.strip()

    try:
        questions = json.loads(response)

    except Exception:

        print("Gemini unavailable. Using fallback questions.")

        questions = {
            "technical_questions": [
                "Explain your latest project.",
                "What is FastAPI?",
                "What is REST API?"
            ],
            "hr_questions": [
                "Tell me about yourself.",
                "Why should we hire you?",
                "What are your strengths?"
            ]
        }

    return {
        "interview_questions": questions
    }