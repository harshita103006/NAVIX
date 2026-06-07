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

    Skill Gaps:
    {state["skill_gaps"]}

    Resume Optimization:
    {state["resume_optimization"]}

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

    try:

      response = response.replace("```json", "")
      response = response.replace("```", "")
      response = response.strip()

      report = json.loads(response)

    except Exception:

      print("Gemini unavailable. Using fallback career report.")

      report = {
          "learning_roadmap": [
             "Learn Docker",
              "Learn AWS Basics",
              "Deploy FastAPI Applications"
          ],
          "projects_to_build": [
             "AI Resume Analyzer",
              "Computer Vision Project",
              "MLOps Deployment Project"
          ],
          "internship_strategy": [
              "Apply through LinkedIn",
              "Apply through Wellfound",
            " Target AI startups"
          ]
      }

    return {
      "career_report": report
    }