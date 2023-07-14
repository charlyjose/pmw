from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr, validator


class Role(str, Enum):
    ADMIN = "ADMIN"
    STUDENT = "STUDENT"
    TUTOR = "TUTOR"
    CSD = "CSD"


class Department(str, Enum):
    ADMIN = "ADMIN"
    SCMS = "SCMS"
    ME = "ME"
    AE = "AE"
    CSD = "CSD"


class SignUpForm(BaseModel):
    firstName: str
    lastName: str
    name: Optional[str] = ""
    role: Role
    department: Department
    email: EmailStr
    password: str

    # Validater to format name field to title case
    @validator("firstName", "lastName", always=True)
    def format_name(cls, v):
        return v.title()

    # Validater to set the name field from firstName and lastName
    @validator("name", always=True)
    def set_name(cls, v, *, values, **kwargs):
        return values["firstName"] + " " + values["lastName"]


class SignUpUser(BaseModel):
    name: str
    firstName: str
    lastName: str
    role: Role
    department: Department
    email: str
    hashedPassword: str


class SignIn(BaseModel):
    email: EmailStr
    password: str
