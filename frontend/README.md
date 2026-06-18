# NAVIX — Career Intelligence OS

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Backend

Requires FastAPI running at http://localhost:8000

```
POST /analyze-resume
Content-Type: multipart/form-data
field: file (PDF)

Response: {
  "candidate": {},
  "roles": [],
  "top_jobs": [],
  "ats_score": 75,
  "skill_gaps": {},
  "learning_resources": [],
  "interview_questions": {},
  "mock_interview": {},
  "cover_letter": ""
}
```

## Stack

- React 18
- Vite 5
- Framer Motion 11
- Axios
