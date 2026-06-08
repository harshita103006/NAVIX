from app.core.state import NavixState


def role_agent(state: NavixState):

    print("Role Agent Running...")

    return {
        "target_roles": state.get(
            "target_roles",
            []
        )
    }