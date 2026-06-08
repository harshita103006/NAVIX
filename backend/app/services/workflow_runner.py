from app.workflow import graph


def run_navix_workflow(analysis):

    state = {

        "resume_data":
            analysis["candidate"],

        "target_roles":
            analysis["roles"],

        "jobs": [],

        "matches": [],

        "skill_gaps": {
            "missing_skills": analysis["skill_gaps"]
        },

        "career_report":
            analysis["career_roadmap"],

        "resume_optimization": {
            "ats_score":
                analysis["ats_score"]
            },

        "interview_questions":
            analysis["interview_questions"],

        "cover_letter":
            analysis["cover_letter"],

        "learning_resources": [],

        "mock_interview": {}
    }

    print("\nDEBUG SKILL GAPS:")
    print(state["skill_gaps"])
    
    result = graph.invoke(state)

    return result