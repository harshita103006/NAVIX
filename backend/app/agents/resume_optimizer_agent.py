import json

from app.core.state import NavixState
from app.services.gemini import generate_response


def resume_optimizer_agent(state: NavixState):

    print("Resume Optimizer Agent Running...")

    prompt = f"""
    You are an ATS resume expert.

    Resume:
    {state["resume_data"]}

    Target Roles:
    {state["target_roles"]}

    Skill Gaps:
    {state["skill_gaps"]}

    Return ONLY valid JSON.

    {{
      "ats_score": 0,
      "missing_keywords": [],
      "resume_improvements": []
    }}
    """

    response = generate_response(prompt)

    response = response.replace("```json", "")
    response = response.replace("```", "")
    response = response.strip()

    result = json.loads(response)

    return {
        "resume_optimization": result
    }