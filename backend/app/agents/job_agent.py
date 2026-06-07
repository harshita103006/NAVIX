from app.core.state import NavixState
from app.services.jobs import search_adzuna_jobs


def job_agent(state: NavixState):

    print("Job Agent Running...")

    jobs = []

    for role in state["target_roles"]:

        print("Searching:", role)

        jobs.extend(
            search_adzuna_jobs(role)
        )

    return {
        "jobs": jobs
    }