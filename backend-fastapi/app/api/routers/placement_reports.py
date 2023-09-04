import os
from typing import Any, Optional

from fastapi import APIRouter, Depends, UploadFile
from fastapi import status as http_status
from fastapi.encoders import jsonable_encoder
from starlette.responses import FileResponse

from app.api.models import action_status
from app.api.models.auth import Role as UserRole
from app.api.models.placement_report import CleanedReportForUser, ReportForm, ReportInDB
from app.api.models.response import JSONResponseModel
from app.api.routers.auth import ValidateUserRole
from app.pnp_helpers.auth import no_access_to_content_response
from app.pnp_helpers.json_response_wrapper import default_response
from app.pnp_helpers.user import user_not_found_response
from app.utils.auth import pyJWTDecodedUserId
from app.utils.db import placement_report as placement_report_db
from app.utils.db import user as user_db

router = APIRouter()


PLACEMENT_REPORT_FILE_PATH = "uploads/student/placement/reports/users"


async def read_report(title: str, month: str, file_type: str, report: UploadFile) -> ReportForm:
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
    # Check for valid user id is and user role
    if not user_id and not await ValidateUserRole(user_id, [UserRole.STUDENT.value])():
        return no_access_to_content_response()

    try:
        report_name = report_form.report.filename
        month = report_form.month.value

        # Check if student is in a placement
        student = await user_db.get_user_by_id(user_id)
        if not student:
            return user_not_found_response()

        if student.studentStatus != "ON_PLACEMENT":
            message = "You are not on placement"
            return default_response(
                http_status=http_status.HTTP_400_BAD_REQUEST, action_status=action_status.DATA_NOT_CREATED, message=message
            )

        # Check if report already exists
        report_exists = await check_report_exists(user_id, month)
        if report_exists:
            message = "Report already exists for this month"
            return default_response(
                http_status=http_status.HTTP_400_BAD_REQUEST, action_status=action_status.DATA_NOT_CREATED, message=message
            )

        # Save report file to disk
        file_location = f"{PLACEMENT_REPORT_FILE_PATH}/{user_id}/{month}/{report_name}"
        file = report_form.report.file
        await save_report_to_store(file_location, file)

        # Save report data to database
        new_report = await add_new_report(user_id, report_form.title, report_form.month, report_form.file_type, report_name=report_name)
        if not new_report:
            message = "Something went wrong. Could not create report."
            return default_response(
                http_status=http_status.HTTP_400_BAD_REQUEST, action_status=action_status.UNKNOWN_ERROR, message=message
            )

        message = "Report added"
        return default_response(http_status=http_status.HTTP_200_OK, action_status=action_status.NO_ERROR, message=message)
    except Exception:
        message = "Something went wrong"
        return default_response(
            http_status=http_status.HTTP_500_INTERNAL_SERVER_ERROR, action_status=action_status.DATA_NOT_CREATED, message=message
        )


@router.get("/student/placement/reports", summary="Get all placement reports for a user", tags=["placement_reports"])
async def get_own_placement_report(user_id: str = Depends(pyJWTDecodedUserId())) -> JSONResponseModel:
    if not user_id and not await ValidateUserRole(user_id, [UserRole.STUDENT.value])():
        return no_access_to_content_response()

    reports = await placement_report_db.get_all_reports_by_user_id(user_id)
    if not reports:
        message = "No reports found"
        data = {"reports": []}
        return default_response(http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_NOT_FOUND, message=message, data=data)

    cleaned_reports = []
    for report in reports:
        cleaned_report_for_user = CleanedReportForUser(**report.dict()).dict()
        json_compatible_cleaned_report = jsonable_encoder(cleaned_report_for_user)
        cleaned_reports.append(json_compatible_cleaned_report)

    message = "Reports fetched"
    data = {"reports": cleaned_reports}
    return default_response(http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_FETCHED, message=message, data=data)


@router.get("/student/placement/reports/download", summary="Download placement report", tags=["placement_reports"])
async def download_placement_report(report_id: str, user_id: str = Depends(pyJWTDecodedUserId())) -> FileResponse:
    if not user_id and not await ValidateUserRole(user_id, [UserRole.STUDENT.value, UserRole.TUTOR.value])():
        return no_access_to_content_response()

    report = await placement_report_db.get_report_by_id(report_id)
    if not report:
        message = "Report not found"
        return default_response(http_status=http_status.HTTP_404_NOT_FOUND, action_status=action_status.DATA_NOT_FOUND, message=message)

    roles = [UserRole.CSD, UserRole.TUTOR]
    valid_user_role = await ValidateUserRole(user_id, roles)()
    valid_user = user_id == report.ownerId

    if valid_user or valid_user_role:
        # Get file path
        file_path = f'{PLACEMENT_REPORT_FILE_PATH}/{report.ownerId}/{report.month}/{report.report_name}'

        # Check if file exists
        if not os.path.exists(file_path):
            message = "File not found"
            return default_response(http_status=http_status.HTTP_404_NOT_FOUND, action_status=action_status.DATA_NOT_FOUND, message=message)

        # Set content disposition header to force browser to download file and not open it and set filename to the original file name
        return FileResponse(
            file_path,
            media_type='application/octet-stream',
            filename=report.report_name,
            headers={"Content-Disposition": "attachment; filename=" + report.report_name},
        )
    else:
        return no_access_to_content_response()


# Get all placement reports submitted catergorised by student name for a tutor by department paginated
@router.get(
    "/tutor/placement/reports",
    summary="Get all placement reports submitted catergorised by student name for a tutor by department paginated",
    tags=["placement_reports"],
)
async def get_placement_reports_for_tutor(user_id: str = Depends(pyJWTDecodedUserId()), page: int = 1) -> JSONResponseModel:
    if not user_id and not await ValidateUserRole(user_id, [UserRole.TUTOR.value])():
        return no_access_to_content_response()

    try:
        if not page > 0:
            message = "Page number should be greater than 0"
            return default_response(
                http_status=http_status.HTTP_204_NO_CONTENT, action_status=action_status.DATA_NOT_FOUND, message=message
            )

        skip = (page - 1) * 10
        take = 10

        # Get tutor department
        tutor = await user_db.get_user_by_id(user_id)
        if not tutor:
            return user_not_found_response()

        tutor_department = tutor.department

        # Get all students from user table by department
        students = await user_db.get_all_users_by_department_paginated(tutor_department, skip, take)

        # Get all students user ids
        student_ids = [student.id for student in students]

        # Get all reports from db by student ids
        reports = await placement_report_db.get_all_reports_by_owner_ids(student_ids)

        # Sort each reports into their respective student list
        student_list = []
        for student in students:
            student_reports = []
            for report in reports:
                if report.ownerId == student.id:
                    cleaned_report_for_user = CleanedReportForUser(**report.dict()).dict()
                    student_reports.append(cleaned_report_for_user)

            json_compatible_reports = jsonable_encoder(student_reports)

            # Append only if there are reports for the student
            count_reports = len(json_compatible_reports)
            if count_reports > 0:
                student_list.append(
                    {"id": student.id, "studentName": student.name, "count": count_reports, "reports": json_compatible_reports}
                )

        # Set hasMore to true if there are more students to be fetched
        hasMore = len(students) == 10
        data = {"students": student_list, "hasMore": hasMore}
        message = "Reports fetched"
        return default_response(http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_FETCHED, message=message, data=data)

    except Exception:
        message = "Something went wrong"
        return default_response(http_status=http_status.HTTP_400_BAD_REQUEST, action_status=action_status.UNKNOWN_ERROR, message=message)
