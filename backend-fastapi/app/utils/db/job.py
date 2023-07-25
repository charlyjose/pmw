from typing import List

from prisma.models import Job

from app.prisma import prisma


# A helper function to add a new job to the database
async def add_new_job_to_db(job: dict) -> Job:
    '''
    A helper function to add a new job to the database
    :param job: dict
    :return: Job
    '''
    return await prisma.job.create(job)


# A helper function to get all jobs from the database
async def get_all_jobs_from_db() -> List[Job]:
    '''
    A helper function to get all appointments from the database
    :return: List[Job]
    '''
    return await prisma.job.find_many()


# A helper function to get all jobs from the database with pagination
async def get_all_jobs_paginated(skip: int, take: int = 10) -> List[Job]:
    '''
    A helper function to get all appointments from the database
    :param skip: int
    :param take: int
    :return: List[Job]
    '''
    return await prisma.job.find_many(skip=skip, take=take)
