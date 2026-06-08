from app.core.state import NavixState


def interview_agent(state: NavixState):

    print("Interview Agent Running...")

    return {
        "interview_questions":
        state.get(
            "interview_questions",
            {}
        )
    }