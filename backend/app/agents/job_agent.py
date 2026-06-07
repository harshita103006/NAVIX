from app.core.state import NavixState


def job_agent(state: NavixState):

    print("Job Agent Running...")

    print(
        "Suggested Roles:",
        state["target_roles"]
    )

    jobs = [
        {
            "title": "Machine Learning Engineer",
            "skills": ["Python", "PyTorch"]
        },
        {
            "title": "Backend Developer",
            "skills": ["Python", "FastAPI"]
        }
    ]

    return {
        "jobs": jobs
    }