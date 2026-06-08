from typing import TypedDict, List, Dict


class NavixState(TypedDict):
    resume_data: Dict

    target_roles: List[str]

    jobs: List[Dict]

    matches: List[Dict]

    skill_gaps: Dict

    career_report: Dict

    resume_optimization: Dict

    interview_questions: Dict

    cover_letter: Dict

    learning_resources: List[Dict]

    mock_interview: Dict