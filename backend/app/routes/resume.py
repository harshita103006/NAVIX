from fastapi import APIRouter, UploadFile, File
from tempfile import NamedTemporaryFile

from app.services.parser import extract_text_from_pdf
from app.services.resume_analyzer import analyze_resume

router = APIRouter()


@router.post("/analyze-resume")
async def analyze(file: UploadFile = File(...)):

    with NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:

        temp_file.write(await file.read())

        resume_text = extract_text_from_pdf(
            temp_file.name
        )

    analysis = analyze_resume(resume_text)

    return analysis