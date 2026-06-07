import json

from app.core.state import NavixState
from app.services.gemini import generate_response


def career_agent(state: NavixState):

    print("Career Agent Running...")

    prompt = f"""
    You are an expert career strategist.

    Candidate:
    {state['resume_data']}

    Suggested Roles:
    {state['target_roles']}

    Job Matches:
    {state['matches']}

    Return ONLY valid JSON.

    Do NOT return empty arrays.

    Analyze the candidate thoroughly.

    The roadmap, projects and strategy must contain at least 3 items each.

    Format:

    {{
      "skill_gaps": [],
      "learning_roadmap": [],
      "projects_to_build": [],
      "internship_strategy": []
    }}
    """

    response = generate_response(prompt)

    response = response.replace("```json", "")
    response = response.replace("```", "")
    response = response.strip()

    print("\nRAW CAREER RESPONSE:\n")
    print(response)
    report = json.loads(response)

    return {
        "career_report": report
    }