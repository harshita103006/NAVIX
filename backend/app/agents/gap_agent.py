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

    try:

      response = response.replace("```json", "")
      response = response.replace("```", "")
      response = response.strip()

      gaps = json.loads(response)

    except Exception:

      print("Gemini unavailable. Using fallback gaps.")

      gaps = {
        "missing_skills": [
            {
                "skill": "Docker",
                "importance": "High",
                "reason": "Required for deployment"
            },
            {
                "skill": "AWS",
                "importance": "Medium",
                "reason": "Useful for cloud projects"
            }
        ]
      }

    return {
      "skill_gaps": gaps
    }