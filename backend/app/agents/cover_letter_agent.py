from app.core.state import NavixState


def cover_letter_agent(state: NavixState):

    print("Cover Letter Agent Running...")

    return {
        "cover_letter":
        state.get(
            "cover_letter",
            ""
        )
    }