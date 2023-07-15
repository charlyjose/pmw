from typing import Union

from fastapi import APIRouter, Depends
from fastapi import status as http_status

import app.pnp_helpers.user as user_pnp_helpers
from app.api.models import action_status
from app.api.models.appointment import AppointmentForm, AppointmentInDBBase, CleanedAppointment
from app.api.models.response import JSONResponseModel
from app.pnp_helpers.client_response import json_response
from app.utils.auth import pyJWTDecodedUserId
from app.utils.db import appointment as appointment_db
from app.utils.reponse import ClientResponse

router = APIRouter()


# A helper function to prepare and add a new appointment to the database
async def add_new_appointment(ownerId: str, appointment: dict) -> Union[dict, None]:
    try:
        appointment = AppointmentInDBBase(ownerId=ownerId, **appointment.dict()).dict()
        appointment = await appointment_db.add_new_appointment_to_db(appointment)
        return CleanedAppointment(**appointment.dict()).dict()
    except Exception:
        return None


# Read appointment from submitted json data
# TODO: In the future, we will perform validation on the appointment form
async def read_appointment(appointmentForm: AppointmentForm):
    return appointmentForm


# Create new appointment
@router.post("/appointments", summary="Create new appointment", tags=["appointments"])
async def create_new_appointment(
    user_id: str = Depends(pyJWTDecodedUserId()), appointmentForm: AppointmentForm = Depends(read_appointment)
) -> JSONResponseModel:
    if user_id:
        # Add appointment to database
        cleaned_appointment = await appointment_db.add_new_appointment(user_id, appointmentForm)
        if not cleaned_appointment:
            message = "Something went wrong"
            response = json_response(
                http_status=http_status.HTTP_400_BAD_REQUEST, action_status=action_status.UNKNOWN_ERROR, message=message
            )
            return ClientResponse(**response)()

        # TODO: Send email to the ownwer and invitees (if any)

        # Format the appointment data (convert date to string) for JSON response
        cleaned_appointment["date"] = cleaned_appointment["date"].strftime("%Y-%m-%d")

        message = "Appointment created"
        response = json_response(
            http_status=http_status.HTTP_200_OK, action_status=action_status.NO_ERROR, message=message, data=cleaned_appointment
        )
        return ClientResponse(**response)()

    # User not found
    return user_pnp_helpers.user_not_found()


# Get own all future appointments
@router.get("/appointments/me/future", summary="Get own all appointments", tags=["appointments"])
async def get_all_my_future_appointments(user_id: str = Depends(pyJWTDecodedUserId())) -> JSONResponseModel:
    if user_id:
        # Get all future appointments from the database
        appointments = await appointment_db.get_all_future_appointments_by_ownerId_from_db(user_id)

        # Format the appointment data (convert date to string) for JSON response
        future_appointments = {"appointments": []}
        for appointment in appointments:
            cleaned_appointments = CleanedAppointment(**appointment.dict()).dict()
            cleaned_appointments["date"] = cleaned_appointments["date"].strftime("%Y-%m-%d")
            future_appointments["appointments"].append(cleaned_appointments)

        message = "Appointment fetched"
        response = json_response(
            http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_FETCHED, message=message, data=future_appointments
        )
        return ClientResponse(**response)()

    # User not found
    return user_pnp_helpers.user_not_found()
