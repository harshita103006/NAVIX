from fastapi import FastAPI

from app.routes.resume import router as resume_router
from app.routes.interview import router as interview_router
from app.routes.cover_letter import router as cover_letter_router

app = FastAPI(
    title="NAVIX",
    description="Autonomous Career Intelligence Agent",
    version="1.0.0"
)


app.include_router(resume_router)
app.include_router(interview_router)
app.include_router(cover_letter_router)

@app.get("/")
def root():
    return {
        "message": "NAVIX Backend Running"
    }