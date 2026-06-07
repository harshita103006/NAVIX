import json

from app.core.state import NavixState
from app.services.gemini import generate_response


def gap_agent(state: NavixState):

    print("Gap Agent Running...")

    prompt = f"""
    You are an expert career mentor.

    Candidate Resume:
    {state["resume_data"]}

    Target Roles:
    {state["target_roles"]}

    Identify missing skills.

    Return ONLY valid JSON.

    {{
      "missing_skills": [
        {{
          "skill": "",
          "importance": "",
          "reason": ""
        }}
      ]
    }}
    """

    response = generate_response(prompt)

    response = response.replace("```json", "")
    response = response.replace("```", "")
    response = response.strip()

    gaps = json.loads(response)

    return {
        "skill_gaps": gaps
    }