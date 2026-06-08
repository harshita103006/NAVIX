from app.core.state import NavixState


def learning_agent(state: NavixState):

    print("Learning Agent Running...")

    resources = []

    gaps = state["skill_gaps"]["missing_skills"]

    for gap in gaps:

        skill = gap["skill"]

        resources.append({
            "skill": skill,
            "course": f"Learn {skill} on Coursera/Udemy",
            "documentation": f"Official {skill} Documentation",
            "project": f"Build a project using {skill}"
        })

    return {
        "learning_resources": resources
    }