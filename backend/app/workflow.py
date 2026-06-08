from langgraph.graph import StateGraph, END

from app.core.state import NavixState

from app.agents.resume_agent import resume_agent
from app.agents.job_agent import job_agent
from app.agents.match_agent import match_agent
from app.agents.career_agent import career_agent
from app.agents.role_agent import role_agent
from app.agents.gap_agent import gap_agent
from app.agents.resume_optimizer_agent import resume_optimizer_agent
from app.agents.interview_agent import interview_agent
from app.agents.cover_letter_agent import cover_letter_agent
from app.agents.learning_agent import learning_agent
from app.agents.mock_interview_agent import mock_interview_agent

builder = StateGraph(NavixState)

builder.add_node("resume_agent", resume_agent)
builder.add_node("job_agent", job_agent)
builder.add_node("match_agent", match_agent)
builder.add_node("career_agent", career_agent)
builder.add_node("role_agent", role_agent)
builder.add_node("gap_agent", gap_agent)
builder.add_node(
    "resume_optimizer_agent",
    resume_optimizer_agent
)
builder.add_node(
    "interview_agent",
    interview_agent
)
builder.add_node(
    "cover_letter_agent",
    cover_letter_agent
)
builder.add_node(
    "learning_agent",
    learning_agent
)
builder.add_node(
    "mock_interview_agent",
    mock_interview_agent
)

builder.set_entry_point("resume_agent")

builder.add_edge("resume_agent", "role_agent")
builder.add_edge("role_agent", "job_agent")
builder.add_edge("job_agent", "match_agent")
builder.add_edge("match_agent", "gap_agent")
builder.add_edge(
    "gap_agent",
    "learning_agent"
)

builder.add_edge(
    "learning_agent",
    "resume_optimizer_agent"
)

builder.add_edge(
    "resume_optimizer_agent",
    "interview_agent"
)

builder.add_edge(
    "interview_agent",
    "mock_interview_agent"
)

builder.add_edge(
    "mock_interview_agent",
    "cover_letter_agent"
)

builder.add_edge(
    "cover_letter_agent",
    "career_agent"
)

builder.add_edge("career_agent", END)
graph = builder.compile()