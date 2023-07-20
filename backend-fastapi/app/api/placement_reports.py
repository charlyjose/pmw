import os
from typing import Any, Optional

from fastapi import APIRouter, Depends, UploadFile
from fastapi import status as http_status
from fastapi.encoders import jsonable_encoder

import app.pnp_helpers.user as user_pnp_helpers
from app.api.models import action_status
from app.api.models.placement_report import CleanedReportForUser, ReportForm, ReportInDB
from app.api.models.response import JSONResponseModel
from app.pnp_helpers.client_response import json_response
from app.utils.auth import pyJWTDecodedUserId
from app.utils.db import placement_report as placement_report_db
from app.utils.reponse import ClientResponse
from starlette.responses import FileResponse

router = APIRouter()


PLACEMENT_REPORT_FILE_PATH = "uploads/student/placement/reports"


async def read_report(title: str, month: str, file_type: str, report: UploadFile):
    return ReportForm(title=title, month=month, file_type=file_type, report=report)


# Write file to disk
async def save_report_to_store(location: str, file: Any):
    os.makedirs(os.path.dirname(location), exist_ok=True)
    with open(location, "wb+") as file_object:
        file_object.write(file.read())


# Read file from disk
async def read_report_from_store(location: str):
    with open(location, "rb") as file_object:
        return file_object.read()


async def add_new_report(ownerId: str, title: str, month: str, file_type: str, report_name: str) -> Optional[ReportInDB]:
    print(ownerId, title, month, file_type, report_name)
    try:
        report = ReportInDB(ownerId=ownerId, title=title, month=month, file_type=file_type, report_name=report_name).dict()
        return await placement_report_db.create_new_report(report)
    except Exception:
        return None


# Check if a report for a given month already exists
async def check_report_exists(ownerId: str, month: str) -> bool:
    try:
        report = await placement_report_db.get_report_by_month(ownerId, month)
        if report:
            return True
        return False
    except Exception:
        return False


@router.post("/student/placement/reports", summary="Add new placement report", tags=["placement_reports"])
async def add_new_palcement_report(user_id: str = Depends(pyJWTDecodedUserId()), report_form: ReportForm = Depends(read_report)):
    try:
        report_name = report_form.report.filename
        month = report_form.month.value

        # Check if report already exists
        report_exists = await check_report_exists(user_id, month)
        if report_exists:
            message = "Report already exists for this month"
            response = json_response(
                http_status=http_status.HTTP_400_BAD_REQUEST, action_status=action_status.DATA_NOT_CREATED, message=message
            )
            return ClientResponse(**response)()

        # Save report file to disk
        file_location = f"{PLACEMENT_REPORT_FILE_PATH}/users/{user_id}/{month}/{report_name}"
        file = report_form.report.file
        await save_report_to_store(file_location, file)

        # Save report data to database
        new_report = await add_new_report(user_id, report_form.title, report_form.month, report_form.file_type, report_name=report_name)
        if not new_report:
            message = "Something went wrong. Could not create report."
            response = json_response(
                http_status=http_status.HTTP_400_BAD_REQUEST, action_status=action_status.UNKNOWN_ERROR, message=message
            )
            return ClientResponse(**response)()

        message = "Report added"
        response = json_response(http_status=http_status.HTTP_200_OK, action_status=action_status.NO_ERROR, message=message)
        return ClientResponse(**response)()
    except Exception:
        message = "Something went wrong"
        response = json_response(
            http_status=http_status.HTTP_500_INTERNAL_SERVER_ERROR, action_status=action_status.DATA_NOT_CREATED, message=message
        )
        return ClientResponse(**response)()


@router.get("/student/placement/reports", summary="Get all placement reports for a user", tags=["placement_reports"])
async def get_own_placement_report(user_id: str = Depends(pyJWTDecodedUserId())) -> JSONResponseModel:
    if user_id:
        reports = await placement_report_db.get_all_reports_by_user_id(user_id)
        if not reports:
            message = "No reports found"
            data = {"reports": []}
            response = json_response(
                http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_NOT_FOUND, message=message, data=data
            )
            return ClientResponse(**response)()

        cleaned_reports = []
        for report in reports:
            cleaned_report_for_user = CleanedReportForUser(**report.dict()).dict()
            json_compatible_cleaned_report = jsonable_encoder(cleaned_report_for_user)
            cleaned_reports.append(json_compatible_cleaned_report)

        message = "Reports fetched"
        data = {"reports": cleaned_reports}
        response = json_response(http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_FETCHED, message=message, data=data)
        return ClientResponse(**response)()

    else:
        return user_pnp_helpers.user_not_found()


# eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGIxZTliZmRiOTQ3N2ZkNzA3NTdiZTgiLCJleHAiOjE2ODk5MDY5MTgsImlhdCI6MTY4OTgyMDUxOCwibmJmIjoxNjg5ODIwNTE4LCJpc3MiOiJwbXctYmFja2VuZC1mYXN0YXBpIn0.qn0U0GWN0mUxAbbEtV3AK_M3iHA3GFjPr18Edd4PGMY


@router.get("/student/placement/reports/download", summary="Download a placement report", tags=["placement_reports"])
async def download_placement_report(report_id: str) -> FileResponse:
    report = await placement_report_db.get_report_by_id(report_id)
    if not report:
        message = "Report not found"
        response = json_response(http_status=http_status.HTTP_404_NOT_FOUND, action_status=action_status.DATA_NOT_FOUND, message=message)
        return ClientResponse(**response)()

    '''
    # Check if user is owner of the report
    if report.ownerId != user_id:
        message = "You are not authorized to access this report"
        response = json_response(
            http_status=http_status.HTTP_401_UNAUTHORIZED, action_status=action_status.UNAUTHORIZED, message=message
        )
        return ClientResponse(**response)()
    '''

    # Get file path
    file_path = f"{PLACEMENT_REPORT_FILE_PATH}/{report.ownerId}/{report.month}/{report.report_name}"

    # Check if file exists
    if not os.path.exists(file_path):
        message = "File not found"
        response = json_response(http_status=http_status.HTTP_404_NOT_FOUND, action_status=action_status.DATA_NOT_FOUND, message=message)
        return ClientResponse(**response)()

    # Return file
    # Read file from disk
    # file = await read_report_from_store(file_path)
    # return FileResponse(file_path, media_type='application/octet-stream', filename=report.report_name)

    # Set content disposition header to force browser to download file and not open it and set filename to the original file name
    return FileResponse(
        file_path,
        media_type='application/octet-stream',
        filename=report.report_name,
        headers={"Content-Disposition": "attachment; filename=" + report.report_name},
    )

    # return FileResponse(file_path, media_type='application/octet-stream', filename=report.report_name)


# @router.get("/student/placement/reports/download", summary="Download a placement report", tags=["placement_reports"])
# async def download_placement_report(report_id: str, user_id: str = Depends(pyJWTDecodedUserId())) -> FileResponse:
#     if user_id:
#         report = await placement_report_db.get_report_by_id(report_id)
#         if not report:
#             message = "Report not found"
#             response = json_response(
#                 http_status=http_status.HTTP_404_NOT_FOUND, action_status=action_status.DATA_NOT_FOUND, message=message
#             )
#             return ClientResponse(**response)()

#         '''
#         # Check if user is owner of the report
#         if report.ownerId != user_id:
#             message = "You are not authorized to access this report"
#             response = json_response(
#                 http_status=http_status.HTTP_401_UNAUTHORIZED, action_status=action_status.UNAUTHORIZED, message=message
#             )
#             return ClientResponse(**response)()
#         '''

#         # Get file path
#         file_path = f"{PLACEMENT_REPORT_FILE_PATH}/{report.ownerId}/{report.month}/{report.report_name}"

#         # Check if file exists
#         if not os.path.exists(file_path):
#             message = "File not found"
#             response = json_response(
#                 http_status=http_status.HTTP_404_NOT_FOUND, action_status=action_status.DATA_NOT_FOUND, message=message
#             )
#             return ClientResponse(**response)()

#         # Return file
#         # Read file from disk
#         file = await read_report_from_store(file_path)
#         return FileResponse(file_path, media_type='application/octet-stream', filename=report.report_name)

#     else:
#         return user_pnp_helpers.user_not_found()
