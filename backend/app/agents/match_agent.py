from app.core.state import NavixState

def match_agent(state: NavixState):

    print("Match Agent Running...")

    resume_skills = {
        skill.lower()
        for skill in state["resume_data"].get("skills", [])
    }

    matches = []

    for job in state["jobs"]:

        title = job.get("title", "").lower()

        score = 40

        if "python" in title and "python" in resume_skills:
            score += 20

        if "machine learning" in title and (
            "machine learning" in resume_skills
            or "ai" in resume_skills
        ):
            score += 20

        if "computer vision" in title and (
            "computer vision" in resume_skills
            or "opencv" in resume_skills
        ):
            score += 20

        if "backend" in title and (
            "fastapi" in resume_skills
            or "flask" in resume_skills
        ):
            score += 15

        matches.append({
            "job": job.get("title"),
            "company": job.get("company"),
            "score": min(score, 100)
        })

    matches.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return {
        "matches": matches
    }