from datetime import datetime
from typing import List

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class PlacementReport(BaseModel):
    title: str
    student_id: str
    submission_date: datetime
    file_link: str


@router.get("/student/placement/reports", response_model=List[PlacementReport])
async def placement_application():
    title = "Placement report title"
    student_id = "student_id"
    submission_date = datetime.now()
    file_link = "https://google.com"

    print()
    print(title)
    print(student_id)
    print(submission_date)
    print(file_link)
    print()

    report = PlacementReport(title=title, student_id=student_id, submission_date=submission_date, file_link=file_link)
    reports = [
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
        report,
    ]
    return reports


'''




# A helper function to prepare and add a new appointment to the database
async def add_new_appointment(ownerId: str, appointment: dict) -> Union[dict, None]:
    try:
        appointment = AppointmentInDB(ownerId=ownerId, **appointment.dict()).dict()
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
        cleaned_appointment = await add_new_appointment(user_id, appointmentForm)
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
'''
