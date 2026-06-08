from app.core.state import NavixState


def mock_interview_agent(state: NavixState):

    print("Mock Interview Agent Running...")

    role = state["target_roles"][0]

    return {
        "mock_interview": {
            "question":
                f"What makes you suitable for a {role} position?",

            "expected_points": [
                "Relevant skills",
                "Projects",
                "Problem solving"
            ],

            "sample_answer":
                f"My experience aligns well with {role}."
        }
    }