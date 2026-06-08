import json

from app.core.state import NavixState
from app.services.gemini import generate_response


def mock_interview_agent(state: NavixState):

    print("Mock Interview Agent Running...")

    role = state["target_roles"][0]

    prompt = f"""
    Generate one mock interview question.

    Role:
    {role}

    Return ONLY valid JSON.

    {{
      "question": "",
      "expected_points": [],
      "sample_answer": ""
    }}
    """

    response = generate_response(prompt)

    response = response.replace("```json", "")
    response = response.replace("```", "")
    response = response.strip()

    try:
        result = json.loads(response)

    except Exception:

        print("Gemini unavailable. Using fallback interview.")

        result = {
            "question":
            f"What makes you suitable for a {role} position?",

            "expected_points": [
                "Relevant skills",
                "Projects",
                "Problem solving"
            ],

            "sample_answer":
            f"My experience aligns well with {role}."
        }

    return {
        "mock_interview": result
    }