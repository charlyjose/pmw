from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import AnyHttpUrl, BaseModel


class JobMode(str, Enum):
    REMOTE = "REMOTE"
    HYBRID = "HYBRID"
    OFFICE = "OFFICE"


class JobIndustry(str, Enum):
    SOFTWARE_DEVELOPMENT = "SOFTWARE_DEVELOPMENT"
    FINANCE = "FINANCE"
    CONSULTING = "CONSULTING"
    HEALTHCARE = "HEALTHCARE"
    EDUCATION = "EDUCATION"
    GOVERNMENT = "GOVERNMENT"
    RETAIL = "RETAIL"
    OTHER = "OTHER"


class JobFunction(str, Enum):
    INFORMATION_TECHNOLOGY = "INFORMATION_TECHNOLOGY"
    ENGINEERING = "ENGINEERING"
    FINANCE = "FINANCE"
    CONSULTING = "CONSULTING"
    SALES = "SALES"
    MARKETING = "MARKETING"
    BUSINESS_DEVELOPMENT = "BUSINESS_DEVELOPMENT"
    ANALYST = "ANALYST"
    MANUFACTURING = "MANUFACTURING"
    OTHER = "OTHER"


# Job model from submitted json data
class JobForm(BaseModel):
    role: str
    company: str
    description: str
    salary: Optional[int] = 0
    mode: JobMode
    location: List[str]
    deadline: datetime
    industry: JobIndustry = JobIndustry.OTHER
    function: JobFunction = JobFunction.OTHER
    link: AnyHttpUrl


# Job model to be used in the database
class JobInDB(JobForm):
    ownerId: str


class CleanedJobForUser(JobForm):
    """
    A pydantic model to represent a cleaned job:
    - Removes the ownerId field for security reasons
    """

    id: str
    createdAt: datetime
    updatedAt: datetime


class CleanedJobWithCreaterName(CleanedJobForUser):
    """
    A pydantic model to represent a cleaned job:
    - Removes the ownerId field for security reasons
    - Add owner full name
    """

    createdBy: str
