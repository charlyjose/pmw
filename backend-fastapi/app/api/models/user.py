from pydantic import BaseModel
from enum import Enum


class UserStatus(str, Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"


class StudentStatus(str, Enum):
    ON_PLACEMENT = "ON_PLACEMENT"
    NOT_ON_PLACEMENT = "NOT_ON_PLACEMENT"
    GRADUATED = "GRADUATED"
    NOT_APPLICABLE = "NOT_APPLICABLE"


class CleanedUserData(BaseModel):
    name: str
    firstName: str
    lastName: str
    role: str
    department: str
    email: str
