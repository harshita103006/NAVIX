import requests


def search_remoteok_jobs(role):

    url = "https://remoteok.com/api"

    response = requests.get(
        url,
        headers={"User-Agent": "NAVIX"}
    )

    data = response.json()

    jobs = []

    for job in data[1:]:

        title = job.get("position", "")
        print(title)
        if role.lower() not in title.lower():
            continue

        jobs.append(
            {
                "title": title,
                "company": job.get("company"),
                "skills": job.get("tags", [])
            }
        )

        if len(jobs) >= 5:
            break

    return jobs