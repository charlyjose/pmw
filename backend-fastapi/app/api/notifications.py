from fastapi import APIRouter, Depends
from fastapi import status as http_status
from fastapi.encoders import jsonable_encoder

from app.api.models import action_status
from app.api.models.appointment import CleanedAppointment
from app.api.models.auth import Role as UserRole
from app.pnp_helpers.json_response_wrapper import default_response
from app.pnp_helpers.user import user_not_found_response
from app.utils.auth import pyJWTDecodedUserId
from app.utils.db import appointment as appointment_db
from app.utils.db import user as user_db

router = APIRouter()


# Read student notifications
async def read_student_notifications(user_id: str, team: UserRole):
    # Read future student appointments
    appointments = []
    data = {"user": team, "notifications": {"appointments": appointments}}
    appointments = await appointment_db.get_all_future_appointments_by_ownerId_from_db(user_id)

    if not appointments:
        appointments = []
    else:
        for appointment in appointments:
            cleaned_appointments = CleanedAppointment(**appointment.dict()).dict()
            json_compatible_cleaned_appointments = jsonable_encoder(cleaned_appointments)
            data["notifications"]["appointments"].append(json_compatible_cleaned_appointments)

    message = "Notifications fetched"
    return default_response(http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_FETCHED, message=message, data=data)


async def read_tutor_notifications(user_id: str, team: UserRole):
    # Read future tutor appointments
    appointments = []
    data = {"user": team, "notifications": {"appointments": appointments}}
    appointments = await appointment_db.get_all_future_appointments_by_team_from_db(team.upper())

    if not appointments:
        appointments = []
    else:
        for appointment in appointments:
            cleaned_appointments = CleanedAppointment(**appointment.dict()).dict()
            json_compatible_cleaned_appointments = jsonable_encoder(cleaned_appointments)
            data["notifications"]["appointments"].append(json_compatible_cleaned_appointments)

    message = "Notifications fetched"
    return default_response(http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_FETCHED, message=message, data=data)


async def read_csd_notifications(user_id: str, team: UserRole):
    # Read future tutor appointments
    appointments = []
    data = {"user": team, "notifications": {"appointments": appointments}}
    appointments = await appointment_db.get_all_future_appointments_by_team_from_db(team.upper())

    if not appointments:
        appointments = []
    else:
        for appointment in appointments:
            cleaned_appointments = CleanedAppointment(**appointment.dict()).dict()
            json_compatible_cleaned_appointments = jsonable_encoder(cleaned_appointments)
            data["notifications"]["appointments"].append(json_compatible_cleaned_appointments)

    message = "Notifications fetched"
    return default_response(http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_FETCHED, message=message, data=data)


# Notifications for a specific user
@router.get("/notifications", summary="Get notifications for a specific user", tags=["notifications"])
async def get_notifications_for_a_specific_user(user_id: str = Depends(pyJWTDecodedUserId())):
    # Determine if the user_id is valid
    if not user_id:
        return user_not_found_response()

    # Get the user role
    user_role = await user_db.get_user_role(user_id)
    if not user_role:
        return user_not_found_response()

    # Student notifications
    if user_role == UserRole.STUDENT:
        return await read_student_notifications(user_id, user_role)

    # Tutor notifications
    if user_role == UserRole.TUTOR:
        return await read_tutor_notifications(user_id, user_role)

    # CSD notifications
    if user_role == UserRole.CSD:
        return await read_csd_notifications(user_id, user_role)
