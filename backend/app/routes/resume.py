from fastapi import APIRouter, UploadFile, File
from tempfile import NamedTemporaryFile

from app.services.parser import extract_text_from_pdf
from app.services.resume_analyzer import analyze_resume
from app.services.workflow_runner import run_navix_workflow
router = APIRouter()


@router.post("/analyze-resume")
async def analyze(file: UploadFile = File(...)):

    with NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:

        temp_file.write(await file.read())

        resume_text = extract_text_from_pdf(
            temp_file.name
        )

    resume_data = analyze_resume(resume_text)
    
    result = run_navix_workflow(
        resume_data
    )
    return {
        "candidate": result["resume_data"],
        "roles": result["target_roles"],
        "top_jobs": result["jobs"][:5],
        "ats_score": result["resume_optimization"]["ats_score"],
        "skill_gaps": result["skill_gaps"],
        "learning_resources": result["learning_resources"],
        "interview_questions": result["interview_questions"],
        "mock_interview": result["mock_interview"],
        "mock_interview":result["mock_interview"],
        "cover_letter": result["cover_letter"]
    }

    return {
        "candidate": result["resume_data"],

        "roles": result["target_roles"],

        "top_jobs": result["jobs"][:5],

        "ats_score": result["resume_optimization"][
            "ats_score"
        ],

        "skill_gaps": result["skill_gaps"],

        "learning_resources":
             result["learning_resources"],

        "interview_questions":
            result["interview_questions"],

        "mock_interview":
            result["mock_interview"],
        "cover_letter":
             result["cover_letter"]
    }

    return analysis