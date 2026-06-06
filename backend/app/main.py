from fastapi import FastAPI
from app.routes.resume import router as resume_router

app = FastAPI(
    title="NAVIX",
    description="Autonomous Career Intelligence Agent",
    version="1.0.0"
)

app.include_router(resume_router)

@app.get("/")
def root():
    return {
        "message": "NAVIX Backend Running"
    }