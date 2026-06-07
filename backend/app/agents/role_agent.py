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

    roles = json.loads(response)

    state["target_roles"] = roles["roles"]

    return state