from typing import List, Optional

from prisma.models import JobApplication

from app.prisma import prisma


async def create_new_application(application: dict) -> Optional[JobApplication]:
    return await prisma.jobapplication.create(application)


async def get_application(ownerId: str, jobId: str) -> Optional[JobApplication]:
    return await prisma.jobapplication.find_first(where={"ownerId": ownerId, "jobId": jobId})


# Get all placement reports for a given user
async def get_all_application_by_user_id(ownerId: str) -> List[JobApplication]:
    return await prisma.jobapplication.find_many(where={"ownerId": ownerId})


# Get a report by its id
async def get_application_by_id(applicationId: str) -> Optional[JobApplication]:
    return await prisma.jobapplication.find_unique(where={"id": applicationId})
