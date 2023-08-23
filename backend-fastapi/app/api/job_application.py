import os
from typing import Any, Optional

from fastapi import APIRouter, Depends, File, UploadFile
from fastapi import status as http_status
from fastapi.encoders import jsonable_encoder
from starlette.responses import FileResponse

from app.api.auth import ValidateUserRole
from app.api.models import action_status
from app.api.models.auth import Role as UserRole
from app.api.models.job_application import CleanedJobApplicationForUser, JobApplicationForm, JobApplicationInDB, JobFiles
from app.api.models.response import JSONResponseModel
from app.pnp_helpers.auth import no_access_to_content_response
from app.pnp_helpers.client_response import json_response
from app.pnp_helpers.json_response_wrapper import default_response
from app.pnp_helpers.user import user_not_found_response
from app.utils.auth import pyJWTDecodedUserId
from app.utils.db import job as job_db
from app.utils.db import job_application as job_application_db
from app.utils.reponse import ClientResponse

router = APIRouter()


JOB_APPLICATION_FILE_PATH = "uploads/student/job/applications/users"


# Write file to disk
async def save_application_to_store(location: str, file: Any):
    os.makedirs(os.path.dirname(location), exist_ok=True)
    with open(location, "wb+") as file_object:
        file_object.write(file.read())


# Read file from disk
async def read_application_from_store(location: str):
    with open(location, "rb") as file_object:
        return file_object.read()


async def add_new_application(
    ownerId: str,
    job_id: str,
    name: str,
    email: str,
    cvFileType: str,
    cvName: str,
    clFileType: Optional[str] = None,
    clName: Optional[str] = None,
) -> Optional[JobApplicationInDB]:
    try:
        application = JobApplicationInDB(
            ownerId=ownerId,
            jobId=job_id,
            name=name,
            email=email,
            cvFileType=cvFileType,
            cvName=cvName,
            clFileType=clFileType,
            clName=clName,
        ).dict()
        return await job_application_db.create_new_application(application)
    except Exception:
        return None


# Check if a job application already exists
async def check_application_exists(ownerId: str, job_id: str) -> bool:
    try:
        application = await job_application_db.get_application(ownerId, job_id)
        if application:
            return True
        return False
    except Exception:
        return False


async def read_application(
    id: str, name: str, email: str, cvFileType: str, cv: UploadFile, cl: Optional[UploadFile] = File(None), clFileType: Optional[str] = None
) -> JobApplicationForm:
    return JobApplicationForm(jobId=id, name=name, email=email, cvFileType=cvFileType, cv=cv, cl=cl, clFileType=clFileType)


@router.post("/student/jobs/apply/job", summary="Add new job application", tags=["job_applications"])
async def add_new_job_application(
    user_id: str = Depends(pyJWTDecodedUserId()), application_form: JobApplicationForm = Depends(read_application)
):
    try:
        cv_name = application_form.cv.filename
        cl_name = application_form.cl.filename if application_form.cl else None
        job_id = application_form.jobId

        # Check if application already exists
        application_exists = await check_application_exists(user_id, job_id)
        if application_exists:
            message = "Application already submitted for this job"
            return default_response(
                http_status=http_status.HTTP_400_BAD_REQUEST, action_status=action_status.DATA_NOT_CREATED, message=message
            )

        # Save cv to disk
        file_location = f"{JOB_APPLICATION_FILE_PATH}/{user_id}/{job_id}/CV/{cv_name}"
        file = application_form.cv.file
        await save_application_to_store(file_location, file)

        # Save cover letter to disk
        if application_form.cl:
            file_location = f"{JOB_APPLICATION_FILE_PATH}/{user_id}/{job_id}/CL/{cl_name}"
            file = application_form.cl.file
            await save_application_to_store(file_location, file)

        # Save report data to database
        new_application = await add_new_application(
            user_id,
            application_form.jobId,
            application_form.name,
            application_form.email,
            application_form.cvFileType,
            cvName=cv_name,
            clName=cl_name,
            clFileType=application_form.clFileType if application_form.cl else None,
        )
        if not new_application:
            message = "Something went wrong. Could not add application."
            return default_response(
                http_status=http_status.HTTP_400_BAD_REQUEST, action_status=action_status.UNKNOWN_ERROR, message=message
            )

        message = "Application added"
        response = json_response(http_status=http_status.HTTP_200_OK, action_status=action_status.NO_ERROR, message=message)
        return ClientResponse(**response)()
    except Exception:
        message = "Something went wrong"
        return default_response(
            http_status=http_status.HTTP_500_INTERNAL_SERVER_ERROR, action_status=action_status.DATA_NOT_CREATED, message=message
        )


@router.get("/student/jobs/applications", summary="Get all job application for a user", tags=["job_applications"])
async def get_own_job_application(user_id: str = Depends(pyJWTDecodedUserId())) -> JSONResponseModel:
    if user_id:
        applications = await job_application_db.get_all_application_by_user_id(user_id)
        if not applications:
            message = "No application found"
            data = {"applications": []}
            return default_response(
                http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_NOT_FOUND, message=message, data=data
            )

        # Get job details for a list of job ids
        job_ids = [application.jobId for application in applications]
        jobs = await job_db.get_job_by_id(job_ids)
        if not jobs:
            message = "No application found"
            data = {"applications": []}
            return default_response(
                http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_NOT_FOUND, message=message, data=data
            )

        cleaned_applications = []
        for application in applications:
            # Get job details for a given job id
            job = next((job for job in jobs if job.id == application.jobId), None)

            cleaned_application_for_user = CleanedJobApplicationForUser(role=job.role, company=job.company, **application.dict()).dict()
            json_compatible_cleaned_application = jsonable_encoder(cleaned_application_for_user)
            cleaned_applications.append(json_compatible_cleaned_application)

        message = "Application fetched"
        data = {"applications": cleaned_applications}
        return default_response(http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_FETCHED, message=message, data=data)
    else:
        return user_not_found_response()


@router.get("/student/jobs/applications/download", summary="Download application cv", tags=["job_applications"])
async def download_placement_report(application_id: str, file: JobFiles, user_id: str = Depends(pyJWTDecodedUserId())) -> FileResponse:
    if user_id:
        application = await job_application_db.get_application_by_id(application_id)
        if not application:
            message = "Application not found"
            return default_response(http_status=http_status.HTTP_404_NOT_FOUND, action_status=action_status.DATA_NOT_FOUND, message=message)

        roles = [UserRole.CSD, UserRole.TUTOR]
        valid_user_role = await ValidateUserRole(user_id, roles)()
        valid_user = user_id == application.ownerId

        if valid_user or valid_user_role:
            '''
            # Check if user is owner of the report
            if report.ownerId != user_id:
                message = "You are not authorized to access this report"
                response = json_response(
                    http_status=http_status.HTTP_401_UNAUTHORIZED, action_status=action_status.UNAUTHORIZED, message=message
                )
                return ClientResponse(**response)()
            '''

            filename = application.cvName if file == JobFiles.CV else application.clName

            file_path = f'{JOB_APPLICATION_FILE_PATH}/{application.ownerId}/{application.jobId}'
            if file == JobFiles.CV:
                file_path = f'{file_path}/CV/{application.cvName}'
            elif file == JobFiles.CL:
                file_path = f'{file_path}/CL/{application.clName}'
            else:
                message = "File not found"
                return default_response(
                    http_status=http_status.HTTP_404_NOT_FOUND, action_status=action_status.DATA_NOT_FOUND, message=message
                )

            # Check if file exists
            if not os.path.exists(file_path):
                message = "File not found"
                return default_response(
                    http_status=http_status.HTTP_404_NOT_FOUND, action_status=action_status.DATA_NOT_FOUND, message=message
                )

            # Set content disposition header to force browser to download file and not open it and set filename to the original file name
            return FileResponse(
                file_path,
                media_type='application/octet-stream',
                filename=filename,
                headers={"Content-Disposition": "attachment; filename=" + filename},
            )
        else:
            return no_access_to_content_response(message="No valid previlages to access this content")
    else:
        return user_not_found_response()
