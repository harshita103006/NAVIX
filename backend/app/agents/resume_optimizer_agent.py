from app.core.state import NavixState


def resume_optimizer_agent(
    state: NavixState
):

    print(
        "Resume Optimizer Agent Running..."
    )

    return {
        "resume_optimization":
        state.get(
            "resume_optimization",
            {
                "ats_score": 75
            }
        )
    }