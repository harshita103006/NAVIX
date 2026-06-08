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

    print("\nRAW RESUME RESPONSE:\n")
    print(response)

    try:
      return json.loads(response)

    except Exception:

      print("Gemini unavailable. Using fallback resume.")

      return {
        "name": "Unknown Candidate",
        "email": "",
        "skills": [],
        "projects": [],
        "experience": [],
        "education": []
      }