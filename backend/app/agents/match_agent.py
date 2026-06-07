from app.core.state import NavixState

def match_agent(state: NavixState):

    print("Match Agent Running...")

    resume_skills = set(
        skill.lower()
        for skill in state["resume_data"].get("skills", [])
    )

    matches = []

    for job in state["jobs"]:

        title = job["title"].lower()

        score = 60

        if "machine learning" in title:
            score += 20

        if "computer vision" in title:
            score += 20

        if "python" in title:
            score += 15

        matches.append(
            {
                "job": job["title"],
                "company": job.get("company"),
                "score": min(score, 100)
            }
        )

    return {
        "matches": matches
    }