from fastapi import APIRouter

router = APIRouter()


@router.get("/cover-letter")
def cover_letter():

    return {
        "message": "Cover letter endpoint working"
    }