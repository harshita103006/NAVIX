from app.workflow import graph


def run_navix_workflow(resume_data):

    state = {
        "resume_data": resume_data,
        "target_roles": [],
        "jobs": [],
        "matches": [],
        "skill_gaps": {},
        "career_report": {},
        "resume_optimization": {},
        "interview_questions": {},
        "cover_letter": {},
        "learning_resources": []
    }

    result = graph.invoke(state)

    return result