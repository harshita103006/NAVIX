import json

from app.core.state import NavixState
from app.services.gemini import generate_response


def role_agent(state: NavixState):

    print("Role Agent Running...")

    resume_data = state["resume_data"]

    prompt = f"""
    Based on this candidate profile, suggest the top 3 most suitable job roles.

    Return ONLY valid JSON.

    Format:

    {{
      "roles": [
        "Role 1",
        "Role 2",
        "Role 3"
      ]
    }}

    Candidate:
    {resume_data}
    """

    response = generate_response(prompt)

    response = response.replace("```json", "")
    response = response.replace("```", "")
    response = response.strip()

    print("\nRAW ROLE RESPONSE:\n")
    print(response)
    try:
      roles = json.loads(response)

      if isinstance(roles, dict):
        target_roles = roles["roles"]

      else:
        target_roles = roles

    except Exception:

      print("Gemini unavailable. Using fallback roles.")

      target_roles = [
        "Python Developer",
        "Machine Learning Engineer",
        "Computer Vision Engineer"
      ]

    return {
      "target_roles": target_roles
    }

   