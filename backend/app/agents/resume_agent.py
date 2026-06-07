from app.core.state import NavixState


def resume_agent(state: NavixState):

    print("Resume Agent Running...")

    resume_data = state["resume_data"]

    print(f"Candidate: {resume_data.get('name')}")

    return {}