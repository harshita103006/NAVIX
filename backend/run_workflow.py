from app.workflow import graph

state = {
    "resume_data": {
        "name": "Harshita Joshi",
        "skills": [
            "Python",
            "FastAPI",
            "OpenCV",
            "PyTorch"
        ]
    },

    "target_roles": [],

    "jobs": [],
    "matches": [],
    "career_report": {}
}

result = graph.invoke(state)

print("\nFINAL OUTPUT\n")
print(result)