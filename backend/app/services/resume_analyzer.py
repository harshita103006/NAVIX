import json
from app.services.gemini import generate_response


def analyze_resume(resume_text: str):

    prompt = f"""
    Analyze this resume.

    Return ONLY valid JSON.

    {{
      "candidate": {{
      "name": "",
      "email": "",
      "skills": [],
      "projects": [],
      "experience": [],
      "education": []
    }},

    "roles": [],

    "skill_gaps": [
      {{
        "skill": "",
        "importance": "",
        "reason": ""
      }}
    ],

    "ats_score": 0,

    "interview_questions": {{
      "technical_questions": [],
      "hr_questions": []
    }},

    "cover_letter": "",

    "career_roadmap": {{
      "learning_roadmap": [],
      "projects_to_build": []
    }}
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
        "candidate": {
          "name": "Unknown Candidate",
          "email": "",
          "skills": [],
          "projects": [],
          "experience": [],
          "education": []
        },

        "roles": [
          "Python Developer",
          "Machine Learning Engineer",
          "Computer Vision Engineer"
        ],

        "skill_gaps": [],

        "ats_score": 75,

        "interview_questions": {
          "technical_questions": [],
          "hr_questions": []
        },

        "cover_letter": "",

        "career_roadmap": {
          "learning_roadmap": [],
          "projects_to_build": []
        }
      }