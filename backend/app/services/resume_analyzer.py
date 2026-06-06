import json
from app.services.gemini import generate_response


def analyze_resume(resume_text: str):

    prompt = f"""
    Analyze the following resume.

    Return ONLY valid JSON.

    {{
      "name": "",
      "email": "",
      "skills": [],
      "projects": [],
      "experience": [],
      "education": []
    }}

    Resume:
    {resume_text}
    """

    response = generate_response(prompt)

    response = response.replace("```json", "")
    response = response.replace("```", "")
    response = response.strip()

    return json.loads(response)