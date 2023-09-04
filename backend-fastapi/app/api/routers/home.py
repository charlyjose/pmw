from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from fastapi import status as http_status

from app.api.models import action_status
from app.api.models.auth import Role as UserRole
from app.api.models.response import JSONResponseModel
from app.pnp_helpers.json_response_wrapper import default_response
from app.pnp_helpers.user import user_not_found_response
from app.utils.auth import pyJWTDecodedUserId
from app.utils.db import appointment as appointment_db
from app.utils.db import placement_application as placement_application_db
from app.utils.db import placement_visit as placement_visit_db
from app.utils.db import placement_visit_itinerary as placement_visit_itinerary_db
from app.utils.db import user as user_db

router = APIRouter()


# Get the tutor department
async def get_user_department(user_id: str) -> str:
    return await user_db.get_user_department(user_id)


# Get Number of students under the tutor
async def get_number_of_students_under_tutor(user_id):
    tutor_department = await get_user_department(user_id)
    # Get the number of students under the tutor department
    return await user_db.get_number_of_students_under_tutor_department(tutor_department)


# Get Number of future appointments
async def get_number_of_future_appointments(team):
    return await appointment_db.get_number_of_future_appointments_by_team_from_db(team.upper())


# Get Number of placement applications not yet approved
async def get_number_of_placement_applications_not_yet_approved(user_id):
    return await placement_application_db.get_count_of_placement_applications_by_reviewer_not_equal_to_approved(user_id)


# Get placements info
async def get_placement_students_under_a_tutor(user_id):
    placement_students = await placement_visit_db.get_placement_students_under_a_tutor(user_id)

    number_of_students_currently_in_placements = 0
    number_of_students_started_placements_in_the_last_3_months = 0
    number_of_students_ending_placements_in_the_next_3_months = 0
    for student in placement_students:
        # Get Number of student currently in placements
        if student.status == "ON_PLACEMENT":
            number_of_students_currently_in_placements += 1
            # Get the number of students started placements in the last 3 months
            if student.startDate.replace(tzinfo=None) >= datetime.today() - timedelta(days=90):
                number_of_students_started_placements_in_the_last_3_months += 1

            # Get the number of students ending placements in the next 3 months
            if student.endDate.replace(tzinfo=None) <= datetime.today() + timedelta(days=90):
                number_of_students_ending_placements_in_the_next_3_months += 1

    return (
        number_of_students_currently_in_placements,
        number_of_students_started_placements_in_the_last_3_months,
        number_of_students_ending_placements_in_the_next_3_months,
    )


# Get Number of scheduled placement visits
async def get_number_of_scheduled_placement_visits(user_id):
    return await placement_visit_itinerary_db.get_count_of_scheduled_placement_visits_for_a_tutor(user_id)


# Tutor home page info:
# - Number of students under the tutor
# - Number of future appointments
# - Number of placement applications not yet approved
# - Number of student currently in placements
# - Number of students started placements in the last 3 months
# - Number of students ending placements in the next 3 months
# - Number of scheduled placement visits
async def get_tutor_home_page_info(user_id: str):
    user_role = await user_db.get_user_role(user_id)
    if user_role != UserRole.TUTOR:
        return user_not_found_response()

    # Get the number of students under the tutor
    number_of_students = await get_number_of_students_under_tutor(user_id)

    # Get the number of future appointments
    number_of_future_appointments = await get_number_of_future_appointments(user_role)

    # Get the number of placement applications not yet approved
    number_of_placement_applications_not_yet_approved = await get_number_of_placement_applications_not_yet_approved(user_id)

    # Get the number of student currently in placements
    # Get the number of students started placements in the last 3 months
    # Get the number of students ending placements in the next 3 months
    (
        number_of_students_currently_in_placements,
        number_of_students_started_placements_in_the_last_3_months,
        number_of_students_ending_placements_in_the_next_3_months,
    ) = await get_placement_students_under_a_tutor(user_id)

    # Get the number of scheduled placement visits
    number_of_scheduled_placement_visits = await get_number_of_scheduled_placement_visits(user_id)

    data = {
        "number_of_students": number_of_students,
        "number_of_future_appointments": number_of_future_appointments,
        "number_of_placement_applications_not_yet_approved": number_of_placement_applications_not_yet_approved,
        "number_of_students_currently_in_placements": number_of_students_currently_in_placements,
        # "number_of_students_started_placements_in_the_last_3_months": number_of_students_started_placements_in_the_last_3_months,
        "number_of_students_ending_placements_in_the_next_3_months": number_of_students_ending_placements_in_the_next_3_months,
        "number_of_scheduled_placement_visits": number_of_scheduled_placement_visits,
    }

    message = "Tutor home page info fetched"
    return default_response(http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_FETCHED, message=message, data=data)


# Get Total Number of students currently in placements
async def get_students_currently_in_placements():
    # Get students currently in placements
    placement_students = await placement_visit_db.get_students_in_placement()

    # Get the number of student currently in placements
    # Get the number of students started placements in the last 3 months
    # Get the number of students ending placements in the next 3 months
    number_of_students_currently_in_placements = 0
    number_of_students_started_placements_in_the_last_3_months = 0
    number_of_students_ending_placements_in_the_next_3_months = 0
    for student in placement_students:
        # Get Number of student currently in placements
        if student.status == "ON_PLACEMENT":
            number_of_students_currently_in_placements += 1
            # Get the number of students started placements in the last 3 months
            if student.startDate.replace(tzinfo=None) >= datetime.today() - timedelta(days=90):
                number_of_students_started_placements_in_the_last_3_months += 1

            # Get the number of students ending placements in the next 3 months
            if student.endDate.replace(tzinfo=None) <= datetime.today() + timedelta(days=90):
                number_of_students_ending_placements_in_the_next_3_months += 1

    return (
        number_of_students_currently_in_placements,
        number_of_students_started_placements_in_the_last_3_months,
        number_of_students_ending_placements_in_the_next_3_months,
    )


# CSD home page info:
# - Total Number of Graduate students
# - Total Number of Undergraduate students
# - Total Number of students currently in placements
# - Number of future appointments
async def get_csd_home_page_info(user_id: str):
    user_role = await user_db.get_user_role(user_id)
    if user_role != UserRole.CSD:
        return user_not_found_response()

    # Get total number of graduate students
    total_number_of_graduate_students = await user_db.get_number_of_students_in_a_student_level("POSTGRADUATE")

    # Get total number of undergraduate students
    total_number_of_undergraduate_students = await user_db.get_number_of_students_in_a_student_level("UNDERGRADUATE")

    # Get the number of student currently in placements
    # Get the number of students started placements in the last 3 months
    # Get the number of students ending placements in the next 3 months
    (
        number_of_students_currently_in_placements,
        number_of_students_started_placements_in_the_last_3_months,
        number_of_students_ending_placements_in_the_next_3_months,
    ) = await get_students_currently_in_placements()

    # Get the number of future appointments
    number_of_future_appointments = await get_number_of_future_appointments(user_role)

    data = {
        "graduate_students": total_number_of_graduate_students,
        "undergraduate_students": total_number_of_undergraduate_students,
        "students_currently_in_placements": number_of_students_currently_in_placements,
        "future_appointments": number_of_future_appointments,
    }

    message = "CSD home page info fetched"
    return default_response(http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_FETCHED, message=message, data=data)


# Info for tutor home page
@router.get("/home", summary="Get info for home page", tags=["home"])
async def get_info_for_tutor_home_page(user_id: str = Depends(pyJWTDecodedUserId())) -> JSONResponseModel:
    if not user_id:
        return user_not_found_response()

    # Get the user role
    user_role = await user_db.get_user_role(user_id)
    if not user_role:
        return user_not_found_response()

    if user_role == UserRole.TUTOR:
        return await get_tutor_home_page_info(user_id)

    if user_role == UserRole.CSD:
        return await get_csd_home_page_info(user_id)

    # If the user is STUDENT
    else:
        message = "Student home page info fetched"
        return default_response(http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_FETCHED, message=message)
