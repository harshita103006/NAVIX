from app.core.state import NavixState

def resume_agent(state: NavixState):

    print("Resume Agent Running...")

    candidate = state.get(
        "resume_data",
        {}
    )

    print(
        f"Candidate: {candidate.get('name', 'Unknown')}"
    )

    return {
        "resume_data": candidate
    }