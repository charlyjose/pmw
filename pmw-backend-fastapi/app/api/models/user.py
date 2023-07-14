from pydantic import BaseModel


class CleanedUserData(BaseModel):
    name: str
    firstName: str
    lastName: str
    role: str
    department: str
    email: str
