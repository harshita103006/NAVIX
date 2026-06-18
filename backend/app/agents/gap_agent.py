from app.core.state import NavixState
def gap_agent(state: NavixState):

    print("Gap Agent Running...")

    gaps = state.get("skill_gaps", {})

    if not gaps:
        gaps = {
            "missing_skills": []
        }

    return {
        "skill_gaps": gaps
    }