from app.core.state import NavixState


def match_agent(state: NavixState):

    print("Match Agent Running...")

    resume_skills = set(
        state["resume_data"].get("skills", [])
    )

    matches = []

    for job in state["jobs"]:

        job_skills = set(job["skills"])

        score = len(
            resume_skills.intersection(job_skills)
        ) / len(job_skills) * 100

        matches.append(
            {
                "job": job["title"],
                "score": round(score, 2)
            }
        )

    state["matches"] = matches

    return {
        "matches": matches
    }