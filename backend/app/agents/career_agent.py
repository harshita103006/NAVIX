from app.core.state import NavixState


def career_agent(state: NavixState):

    print("Career Agent Running...")

    return {
        "career_report":
        state.get(
            "career_report",
            {}
        )
    }