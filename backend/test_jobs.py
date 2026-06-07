from app.services.jobs import search_adzuna_jobs

import os


jobs = search_adzuna_jobs(
    "Machine Learning Engineer"
)

print(jobs)