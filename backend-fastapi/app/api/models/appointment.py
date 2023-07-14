from datetime import date
from enum import Enum
from typing import List, Optional

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


class AppointmentStatus(str, Enum):
    CONFIRMED = "CONFIRMED"
    CANCELLED = "CANCELLED"
    PENDING = "PENDING"
    STARTED = "STARTED"
    ENDED = "ENDED"


class AppointmentForm(BaseModel):
    agenda: AppointmentAgenda
    mode: AppointmentMode
    team: AppointmentTeam
    invitees: Optional[List[str]] = []
    description: str
    date: date
    time: str
    duration: str


class Appointment(BaseModel):
    id: str
    appointment_form: AppointmentForm
    confirmed: bool
    notified_invitees: bool
    confirmation_status: AppointmentStatus
