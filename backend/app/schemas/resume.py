from pydantic import BaseModel


class ResumeProfile(BaseModel):
    name: str
    email: str

    skills: list[str]
    projects: list

    experience: list
    education: list