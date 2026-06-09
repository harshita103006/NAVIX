from app.core.state import NavixState


def mock_interview_agent(state: NavixState):

    print("Mock Interview Agent Running...")

    questions = state.get(
        "interview_questions",
        {}
    )

    technical = questions.get(
        "technical_questions",
        []
    )

    if technical:

        question = technical[0]

    else:

        question = (
            "Tell me about your most challenging project."
        )

    return {
        "mock_interview": {
            "question": question,
            "expected_points": [
                "Technical understanding",
                "Problem solving",
                "Implementation details"
            ],
            "sample_answer":
                "Provide a structured answer with project context, challenges and outcomes."
        }
    }