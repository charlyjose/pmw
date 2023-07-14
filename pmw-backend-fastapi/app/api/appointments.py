from typing import List, Any

from fastapi import APIRouter, Depends, Form
from fastapi import status as http_status
from prisma.models import User
from typing_extensions import Annotated

import app.pnp_helpers.user as user_pnp_helpers
from app.api.auth import ValidateUserRole
from app.api.models import action_status
from app.api.models.appointment import AppointmentForm, Appointment
from app.api.models.auth import Role as UserRole
from app.api.models.response import ResponseModelContent
from app.api.models.user import CleanedUserData
from app.prisma import prisma
from app.utils.auth import pyJWTDecodedUserId
from app.utils.reponse import createJSONResponse
from app.api.models.response import JSONResponseModel

router = APIRouter()


# Read appointment from submitted json data
# TODO: In the future, we will perform validation on the appointment form
async def read_appointment(appointmentForm: AppointmentForm):
    return appointmentForm


# Create a new appointment
@router.post("/appointments/", summary="Create new appointment", tags=["appointments"])
async def create_new_appointment(
    user_id: str = Depends(pyJWTDecodedUserId()), appointmentForm: AppointmentForm = Depends(read_appointment)
) -> JSONResponseModel:
    if user_id:
        # TODO: Add appointment to database

        # TODO: Send email to the ownwer and invitees (if any)

        appointment = appointmentForm.dict()
        # Format the appointment data (convert date to string) for JSON response
        appointment["date"] = appointment["date"].strftime("%Y-%m-%d")

        message = "Appointment created"
        return createJSONResponse(
            status_code=http_status.HTTP_200_OK,
            content=ResponseModelContent(error=action_status.NO_ERROR, message=message, data=appointment),
        )

    # User not found
    return user_pnp_helpers.no_user_found()


# Create own appointments
@router.get("/appointments/me", summary="Get own appointments", tags=["appointments"])
async def get_all_my_appointments(user_id: str = Depends(pyJWTDecodedUserId())) -> JSONResponseModel:
    if user_id:
        appointment_form = AppointmentForm(
            agenda="CV Review",
            mode="Offline",
            team="CSD",
            invitees=["test@user.com"],
            description="Review My CV",
            date="2021-10-09",
            time="10:30",
            duration="30",
        )

        appointments: List[Appointment] = [
            Appointment(
                id="1", appointment_form=appointment_form, confirmed=False, notified_invitees=True, confirmation_status="PENDING"
            ).dict(),
            Appointment(
                id="2", appointment_form=appointment_form, confirmed=True, notified_invitees=True, confirmation_status="CONFIRMED"
            ).dict(),
        ]

        print(appointments)

        all_appointments = {"appointments": []}
        for appointment in appointments:
            # Format the appointment data (convert date to string) for JSON response
            appointment["appointment_form"]["date"] = appointment["appointment_form"]["date"].strftime("%Y-%m-%d")
            all_appointments["appointments"].append(appointment)

        message = "Appointment fetched"
        return createJSONResponse(
            status_code=http_status.HTTP_200_OK,
            content=ResponseModelContent(error=action_status.DATA_FETCHED, message=message, data=all_appointments),
        )

    # User not found
    return user_pnp_helpers.no_user_found()
