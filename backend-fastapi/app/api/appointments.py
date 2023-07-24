from typing import Union

from fastapi import APIRouter, Depends
from fastapi import status as http_status

import app.pnp_helpers.user as user_pnp_helpers
import app.pnp_helpers.auth as auth_pnp_helpers

from fastapi.encoders import jsonable_encoder

from app.api.models import action_status
from app.api.models.appointment import AppointmentForm, AppointmentInDB, CleanedAppointment, AppointmentStatus
from app.api.models.response import JSONResponseModel
from app.pnp_helpers.client_response import json_response
from app.utils.auth import pyJWTDecodedUserId
from app.utils.db import appointment as appointment_db
from app.utils.db import user as user_db
from app.utils.reponse import ClientResponse
from app.api.auth import ValidateUserRole
from app.api.models.auth import Role as UserRole

router = APIRouter()


# A helper function to prepare and add a new appointment to the database and return the cleaned appointment
async def add_new_appointment(ownerId: str, appointment: dict) -> Union[CleanedAppointment, None]:
    try:
        appointment = AppointmentInDB(ownerId=ownerId, **appointment.dict()).dict()
        appointment = await appointment_db.add_new_appointment_to_db(appointment)
        return CleanedAppointment(**appointment.dict()).dict()
    except Exception:
        return None


# Read appointment from submitted json data
# TODO: In the future, we will perform validation on the appointment form
async def read_appointment(appointmentForm: AppointmentForm) -> AppointmentForm:
    return appointmentForm


# Create new appointment
@router.post("/appointments", summary="Create new appointment", tags=["appointments"])
async def create_new_appointment(
    user_id: str = Depends(pyJWTDecodedUserId()), appointmentForm: AppointmentForm = Depends(read_appointment)
) -> JSONResponseModel:
    if user_id:
        # Add appointment to database
        cleaned_appointment = await add_new_appointment(user_id, appointmentForm)
        if not cleaned_appointment:
            message = "Something went wrong"
            response = json_response(
                http_status=http_status.HTTP_400_BAD_REQUEST, action_status=action_status.UNKNOWN_ERROR, message=message
            )
            return ClientResponse(**response)()

        message = "Appointment created"
        response = json_response(http_status=http_status.HTTP_200_OK, action_status=action_status.NO_ERROR, message=message)
        return ClientResponse(**response)()

    # User not found
    return user_pnp_helpers.user_not_found()


# Get own all future appointments
@router.get("/appointments/me/future", summary="Get own all appointments", tags=["appointments"])
async def get_all_my_future_appointments(user_id: str = Depends(pyJWTDecodedUserId())) -> JSONResponseModel:
    if user_id:
        # Get all future appointments from the database
        appointments = await appointment_db.get_all_future_appointments_by_ownerId_from_db(user_id)
        if not appointments:
            data = {"appointments": []}
            message = "No appointment found"
            response = json_response(
                http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_NOT_FOUND, message=message, data=data
            )
            return ClientResponse(**response)()

        # Format the appointment data (convert date to string) for JSON response
        future_appointments = {"appointments": []}
        for appointment in appointments:
            cleaned_appointments = CleanedAppointment(**appointment.dict()).dict()
            json_compatible_cleaned_appointments = jsonable_encoder(cleaned_appointments)
            future_appointments["appointments"].append(json_compatible_cleaned_appointments)

        message = "Appointments fetched"
        response = json_response(
            http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_FETCHED, message=message, data=future_appointments
        )
        return ClientResponse(**response)()

    # User not found
    return user_pnp_helpers.user_not_found()


# Get all future appointments for team CSD
@router.get("/appointments/team/future", summary="Get all future appointments for team CSD", tags=["appointments"])
async def get_all_future_appointments_for_team_csd(team: str, user_id: str = Depends(pyJWTDecodedUserId())) -> JSONResponseModel:
    # Check if the team exists
    valid_team = team.upper() in UserRole.__members__.keys()
    if valid_team:
        roles = [UserRole.CSD, UserRole.TUTOR, UserRole.ADMIN]
        if user_id:
            valid_user_role = await ValidateUserRole(user_id, roles)()
            if valid_user_role:
                # Get all future appointments from the database
                appointments = await appointment_db.get_all_future_appointments_by_team_from_db(team.upper())
                if not appointments:
                    data = {"appointments": []}
                    message = "No appointment found"
                    response = json_response(
                        http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_NOT_FOUND, message=message, data=data
                    )
                    return ClientResponse(**response)()

                # Format the appointment data (convert date to string) for JSON response
                future_appointments = {"appointments": []}
                for appointment in appointments:
                    cleaned_appointments = CleanedAppointment(**appointment.dict()).dict()
                    json_compatible_cleaned_appointments = jsonable_encoder(cleaned_appointments)
                    future_appointments["appointments"].append(json_compatible_cleaned_appointments)

                message = "Appointments fetched"
                response = json_response(
                    http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_FETCHED, message=message, data=future_appointments
                )
                return ClientResponse(**response)()
            else:
                return auth_pnp_helpers.no_access_to_content(message="No valid previlages to access this content")
        else:
            return user_pnp_helpers.user_not_found()
    else:
        message = "Invalid team"
        response = json_response(http_status=http_status.HTTP_400_BAD_REQUEST, action_status=action_status.INVALID_INPUT, message=message)
        return ClientResponse(**response)()


# Get time slots for a specific date
@router.get("/appointments/slots", summary="Get time slots for a specific date", tags=["appointments"])
async def get_time_slots_for_a_specific_date(date: str) -> JSONResponseModel:
    slots = [
        {"id": 1, "start": "09:00 AM", "end": "09:30 AM"},
        {"id": 2, "start": "09:30 AM", "end": "10:00 AM"},
        {"id": 3, "start": "10:00 AM", "end": "10:30 AM"},
        {"id": 4, "start": "10:30 AM", "end": "11:00 AM"},
        {"id": 5, "start": "11:00 AM", "end": "11:30 AM"},
        {"id": 6, "start": "11:30 AM", "end": "12:00 PM"},
        {"id": 7, "start": "01:00 PM", "end": "01:30 PM"},
        {"id": 8, "start": "01:30 PM", "end": "02:00 PM"},
        {"id": 9, "start": "02:00 PM", "end": "02:30 PM"},
        {"id": 10, "start": "02:30 PM", "end": "03:00 PM"},
        {"id": 11, "start": "03:00 PM", "end": "03:30 PM"},
        {"id": 12, "start": "03:30 PM", "end": "04:00 PM"},
        {"id": 13, "start": "04:00 PM", "end": "04:30 PM"},
        {"id": 14, "start": "04:30 PM", "end": "05:00 PM"},
    ]

    data = {"slots": slots}

    message = "Time slots fetched"
    response = json_response(http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_FETCHED, message=message, data=data)
    return ClientResponse(**response)()


# Save response for a specific appointment
@router.post("/appointments/response", summary="Save response for a specific appointment", tags=["appointments"])
async def save_response_for_a_specific_appointment(id: str, status: str, user_id: str = Depends(pyJWTDecodedUserId())) -> JSONResponseModel:
    # Check if the user_id is valid
    if user_id:
        # Check if the appointment exists
        appointment = await appointment_db.get_appointment_by_id_from_db(id)
        if not appointment:
            message = "No appointment found"
            response = json_response(http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_NOT_FOUND, message=message)
            return ClientResponse(**response)()

        # Check if the reposonding user is from a team that can respond to the appointment
        intended_team = appointment.team
        # Get the user role
        user_role = await user_db.get_user_role(user_id)
        if user_role:
            # Check if the user is from the intended team
            valid_team = intended_team == user_role
            if valid_team:
                # Check if the status is valid
                valid_status = status.upper() in AppointmentStatus.__members__.keys()
                if valid_status:
                    # Get the confirmation boolean status
                    confirmed = status.upper() == AppointmentStatus.CONFIRMED.name

                    # Save the response to the database
                    response = await appointment_db.update_appointment_status_by_id_from_db(id, status, confirmed=confirmed)
                    if not response:
                        message = "Something went wrong"
                        response = json_response(
                            http_status=http_status.HTTP_400_BAD_REQUEST, action_status=action_status.UNKNOWN_ERROR, message=message
                        )
                        return ClientResponse(**response)()
                else:
                    message = "Invalid status"
                    response = json_response(
                        http_status=http_status.HTTP_400_BAD_REQUEST, action_status=action_status.INVALID_INPUT, message=message
                    )
                    return ClientResponse(**response)()
        else:
            return auth_pnp_helpers.no_access_to_content(message="No valid previlages to respond to this appointment")
    else:
        return user_pnp_helpers.user_not_found()

    message = "Response saved"
    response = json_response(http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_CREATED, message=message)
    return ClientResponse(**response)()
