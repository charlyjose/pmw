from datetime import datetime
from enum import Enum

from pydantic import BaseModel


class AppointmentAgenda(str, Enum):
    MOCK_INTERVIEW = "MOCK_INTERVIEW"
    CV_REVIEW = "CV_REVIEW"
    CAREER_GUIDANCE = "CAREER_GUIDANCE"
    OTHER = "OTHER"


class AppointmentMode(str, Enum):
    ONLINE = "ONLINE"
    OFFLINE = "OFFLINE"


class AppointmentTeam(str, Enum):
    CSD = "CSD"
    TUTOR = "TUTOR"
    STUDENT = "STUDENT"


class AppointmentStatus(str, Enum):
    CONFIRMED = "CONFIRMED"
    CANCELLED = "CANCELLED"
    PENDING = "PENDING"
    STARTED = "STARTED"
    COMPLETED = "COMPLETED"


class AppointmentForm(BaseModel):
    agenda: AppointmentAgenda
    mode: AppointmentMode
    team: AppointmentTeam
    description: str
    date: datetime
    time: str


class Appointment(AppointmentForm):
    confirmed: bool = False
    status: AppointmentStatus = AppointmentStatus.PENDING


class AppointmentInDB(Appointment):
    ownerId: str


class CleanedAppointment(Appointment):
    """
    A pydantic model to represent a cleaned appointment:
    - Removes the ownerId field for security reasons
    """

    id: str
    createdAt: datetime
    updatedAt: datetime
