import json
from app.services.gemini import generate_response


def analyze_resume(resume_text: str):

    prompt = f"""
    You are an expert ATS evaluator, recruiter, career coach, and technical interviewer.

    Analyze the resume carefully.

    Return ONLY valid JSON.

    Rules:

    1. Extract information exactly from the resume.
    2. Do NOT invent skills, projects, education, or experience.
    3. ATS score must be realistic.
    4. ATS score should rarely exceed 90.
    5. Identify only genuinely missing skills.
    6. Do not recommend skills already present.
    7. Interview questions must be based on the candidate's actual projects and experience.
    8. Cover letter must be personalized.
    9. Roadmap should be based on detected skill gaps.

    Return this format exactly:

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

  ATS Scoring Guidelines:

  - Skills relevance = 30%
  - Project quality = 25%
  - Experience = 20%
  - Education = 10%
  - Resume completeness = 15%

  Skill Gap Guidelines:

  - Recommend maximum 5 missing skills.
  - Do not suggest generic skills unless clearly missing.
  - Explain why each skill matters.

  Roadmap Guidelines:

  - Recommend learning steps based only on actual gaps.
  - Recommend practical projects aligned with target roles.

  Interview Guidelines:

  - Questions must reference actual projects, internships, and technologies found in the resume.

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
      print("\nCLEANED RESPONSE:\n")
      print(response)

      return json.loads(response)

    except Exception as e:

      print("\nJSON PARSE ERROR:\n")
      print(str(e))

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