from typing import TypedDict, List, Dict


class NavixState(TypedDict):
    resume_data: Dict

    target_roles: List[str]

    jobs: List[Dict]

    matches: List[Dict]

    career_report: Dict