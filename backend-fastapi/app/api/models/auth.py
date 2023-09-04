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


class UserStatus(str, Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"


class StudentStatus(str, Enum):
    ON_PLACEMENT = "ON_PLACEMENT"
    NOT_ON_PLACEMENT = "NOT_ON_PLACEMENT"
    GRADUATED = "GRADUATED"
    NOT_APPLICABLE = "NOT_APPLICABLE"


class StudentLevel(str, Enum):
    NOT_APPLICABLE = "NOT_APPLICABLE"
    UNDERGRADUATE = "UNDERGRADUATE"
    POSTGRADUATE = "POSTGRADUATE"
    PHD = "PHD"


class SignUpFormForStudent(BaseModel):
    studentStatus: Optional[StudentStatus] = StudentStatus.NOT_APPLICABLE
    studentLevel: Optional[StudentLevel] = StudentLevel.NOT_APPLICABLE


class SignUpFormWithRole(BaseModel):
    role: Role


class SignUpFormWithDepartment(BaseModel):
    department: Department


class SignUpFormGeneral(BaseModel):
    firstName: str
    lastName: str
    name: Optional[str] = ""
    email: EmailStr

    # Validater to format name field to title case
    @validator("firstName", "lastName", always=True)
    def format_name(cls, v):
        return v.title()

    # Validater to set the name field from firstName and lastName
    @validator("name", always=True)
    def set_name(cls, v, *, values, **kwargs):
        return values["firstName"] + " " + values["lastName"]


class SignUpFormWithoutPassword(SignUpFormForStudent, SignUpFormWithRole, SignUpFormWithDepartment, SignUpFormGeneral):
    pass


class SignUpFormWithPassword(BaseModel):
    password: str


class SignUpForm(SignUpFormWithoutPassword, SignUpFormWithPassword):
    pass


class SignUpUserInDB(SignUpFormWithoutPassword):
    hashedPassword: str


class SignIn(BaseModel):
    email: EmailStr
    password: str


class UserInDB(SignUpUserInDB):
    id: str
    status: UserStatus