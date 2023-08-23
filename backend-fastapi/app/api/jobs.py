import os
from typing import Optional, Union

from bson import ObjectId
from fastapi import APIRouter, Depends
from fastapi import status as http_status
from fastapi.encoders import jsonable_encoder
from prisma.models import Job

from app.api.auth import ValidateUserRole
from app.api.models import action_status
from app.api.models.auth import Role as UserRole
from app.api.models.job import CleanedJobForUser, CleanedJobWithCreaterName, JobForm, JobFunction, JobInDB, JobIndustry
from app.api.models.response import JSONResponseModel
from app.pnp_helpers.auth import no_access_to_content_response
from app.pnp_helpers.client_response import json_response
from app.pnp_helpers.json_response_wrapper import default_response
from app.pnp_helpers.user import user_not_found_response
from app.utils.auth import pyJWTDecodedUserId
from app.utils.db import job as job_db
from app.utils.db import user as user_db
from app.utils.reponse import ClientResponse

router = APIRouter()


# A helper function to prepare and add a new job to the database and return the cleaned job
async def add_new_job(ownerId: str, job: dict) -> Union[Job, None]:
    try:
        job = JobInDB(ownerId=ownerId, **job.dict()).dict()
        return await job_db.add_new_job_to_db(job)
    except Exception:
        return None


# TODO: In the future, we will perform validation on the appointment form
async def read_job(jobForm: JobForm) -> JobForm:
    return jobForm


@router.post("/jobs", summary="Create new job", tags=["jobs"])
async def create_new_job(user_id: str = Depends(pyJWTDecodedUserId()), jobForm: JobForm = Depends(read_job)) -> JSONResponseModel:
    if user_id:
        roles = [UserRole.CSD, UserRole.TUTOR]
        valid_user_role = await ValidateUserRole(user_id, roles)()
        if valid_user_role:
            # Add job to database
            new_job = await add_new_job(user_id, jobForm)
            if not new_job:
                message = "Something went wrong. Could not create job."
                response = json_response(
                    http_status=http_status.HTTP_400_BAD_REQUEST, action_status=action_status.UNKNOWN_ERROR, message=message
                )
                return ClientResponse(**response)()

            # Create a new cleaned job object with the owner's name and convert it to a JSON compatible object
            owner_name = await user_db.get_user_name_by_user_id(user_id)
            cleaned_job = CleanedJobWithCreaterName(**new_job.dict(), createdBy=owner_name).dict()
            json_compatible_cleaned_job = jsonable_encoder(cleaned_job)

            message = "Job created"
            response = json_response(
                http_status=http_status.HTTP_200_OK,
                action_status=action_status.DATA_CREATED,
                message=message,
                data=json_compatible_cleaned_job,
            )
            return ClientResponse(**response)()
        else:
            return no_access_to_content_response(message="No valid previlages to create job")
    else:
        return user_not_found_response()


@router.get("/jobs", summary="View jobs", tags=["jobs"])
async def get_all_jobs_paginated(
    page: int = 1,
    industry: Optional[JobIndustry] = None,
    function: Optional[JobFunction] = None,
    user_id: str = Depends(pyJWTDecodedUserId()),
):
    if user_id:
        # Page nmber should be greater than 0
        if page > 0:
            skip = (page - 1) * 10
            take = 10

            conditions = {}
            if industry:
                conditions["industry"] = industry
            if function:
                conditions["function"] = function

            # Get paginated jobs from the database
            jobs = await job_db.get_all_jobs_paginated(skip=skip, take=take, conditions=conditions)

            job_list = []
            for job in jobs:
                cleaned_job_for_user = CleanedJobForUser(**job.dict()).dict()
                json_compatible_cleaned_job = jsonable_encoder(cleaned_job_for_user)
                job_list.append(json_compatible_cleaned_job)

            # Set hasMore to true if there are more jobs to be fetched
            hasMore = len(jobs) == 10

            message = "Jobs fetched"
            data = {"jobs": job_list, "hasMore": hasMore}
            response = json_response(
                http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_FETCHED, message=message, data=data
            )
            return ClientResponse(**response)()
        else:
            message = "Page number should be greater than 0"
            response = json_response(
                http_status=http_status.HTTP_404_NOT_FOUND, action_status=action_status.DATA_NOT_FOUND, message=message
            )
            return ClientResponse(**response)()
    else:
        return user_not_found_response()


# @router.get("/jobs", summary="View jobs", tags=["jobs"])
# async def get_all_jobs_paginated(page: int = 1, user_id: str = Depends(pyJWTDecodedUserId())):
#     if user_id:
#         # Page nmber should be greater than 0
#         if page > 0:
#             skip = (page - 1) * 10
#             take = 10
#             # Get paginated jobs from the database
#             jobs = await job_db.get_all_jobs_paginated(skip=skip, take=take)

#             job_list = []
#             for job in jobs:
#                 cleaned_job_for_user = CleanedJobForUser(**job.dict()).dict()
#                 json_compatible_cleaned_job = jsonable_encoder(cleaned_job_for_user)
#                 job_list.append(json_compatible_cleaned_job)

#             # Set hasMore to true if there are more jobs to be fetched
#             hasMore = len(jobs) == 10

#             data = {"jobs": job_list, "hasMore": hasMore}
#             message = "Jobs fetched"
#             response = json_response(
#                 http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_FETCHED, message=message, data=data
#             )
#             return ClientResponse(**response)()
#         else:
#             message = "Page number should be greater than 0"
#             response = json_response(
#                 http_status=http_status.HTTP_204_NO_CONTENT, action_status=action_status.DATA_NOT_FOUND, message=message
#             )
#             return ClientResponse(**response)()
#     else:
#         return user_not_found_response()


# Get a single job by id
@router.get("/jobs/{id}", summary="View job", tags=["jobs"])
async def get_job_by_id(id: str, user_id: str = Depends(pyJWTDecodedUserId())):
    if user_id:
        # Check if ID is a valid ObjectId string for MongoDB
        if not ObjectId.is_valid(id):
            message = "Invalid job id"
            return default_response(http_status=http_status.HTTP_404_NOT_FOUND, action_status=action_status.DATA_NOT_FOUND, message=message)

        jobs = await job_db.get_job_by_id([id])
        if jobs:
            for job in jobs:
                cleaned_job_for_user = CleanedJobForUser(**job.dict()).dict()
                json_compatible_cleaned_job = jsonable_encoder(cleaned_job_for_user)
                message = "Job fetched"
                data = {"job": json_compatible_cleaned_job}
                return default_response(
                    http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_FETCHED, message=message, data=data
                )
        else:
            message = "Job not found"
            return default_response(http_status=http_status.HTTP_404_NOT_FOUND, action_status=action_status.DATA_NOT_FOUND, message=message)

    else:
        return user_not_found_response()
