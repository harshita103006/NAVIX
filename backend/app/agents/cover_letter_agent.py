import json

from app.core.state import NavixState
from app.services.gemini import generate_response


def cover_letter_agent(state: NavixState):

    print("Cover Letter Agent Running...")

    job = state["jobs"][0]

    prompt = f"""
    Write a professional cover letter.

    Candidate:
    {state["resume_data"]}

    Job:
    {job}

    Return ONLY valid JSON.

    {{
      "cover_letter": ""
    }}
    """

    response = generate_response(prompt)

    response = response.replace("```json", "")
    response = response.replace("```", "")
    response = response.strip()

    try:
        result = json.loads(response)

    except Exception:

        print("Gemini unavailable. Using fallback cover letter.")

        result = {
            "cover_letter":
            f"Dear Hiring Manager, I am interested in the {job['title']} position and believe my Python, FastAPI, OpenCV and AI experience make me a strong candidate."
        }

    return result