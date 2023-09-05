from datetime import datetime
from typing import List

from pydantic import BaseModel

from app.api.models.auth import Department


class Tutor(BaseModel):
    id: str
    department: Department
    firstName: str
    lastName: str
    name: str
    email: str


class TutorForAdmin(Tutor):
    placement_tutor: bool
    updatedAt: datetime


class TutorListForAdmin(BaseModel):
    department: Department
    tutor: List[TutorForAdmin]
