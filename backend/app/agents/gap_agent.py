from app.core.state import NavixState


def gap_agent(state: NavixState):

    print("Gap Agent Running...")

    return {
        "skill_gaps": state.get(
            "skill_gaps",
            {}
        )
    }