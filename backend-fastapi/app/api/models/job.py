from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import AnyHttpUrl, BaseModel


class JobMode(str, Enum):
    REMOTE = "REMOTE"
    HYBRID = "HYBRID"
    OFFICE = "OFFICE"


# Job model from submitted json data
class JobForm(BaseModel):
    role: str
    company: str
    description: str
    salary: Optional[int] = 0
    mode: JobMode
    location: List[str]
    deadline: datetime
    link: AnyHttpUrl


# Job model to be used in the database
class JobInDB(JobForm):
    ownerId: str


class CleanedJobForUser(JobForm):
    """
    A pydantic model to represent a cleaned job:
    - Removes the ownerId field for security reasons
    """

    createdAt: datetime
    updatedAt: datetime


class CleanedJobWithCreaterName(CleanedJobForUser):
    """
    A pydantic model to represent a cleaned job:
    - Removes the ownerId field for security reasons
    - Add owner full name
    """

    createdBy: str
