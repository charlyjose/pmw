from datetime import datetime
from enum import Enum
from typing import Optional

from fastapi import UploadFile
from pydantic import BaseModel


class JobFiles(str, Enum):
    CV = "CV"
    CL = "CL"


class JobFileType(str, Enum):
    PDF = "PDF"
    DOCX = "DOCX"
    DOC = "DOC"
    TXT = "TXT"
    OTHER = "OTHER"


class JobApplicationWithoutFile(BaseModel):
    jobId: str
    name: str
    email: str
    cvFileType: JobFileType
    clFileType: Optional[JobFileType]


class JobApplicationWithFile(JobApplicationWithoutFile):
    cv: UploadFile
    cl: Optional[UploadFile]


class JobApplicationForm(JobApplicationWithFile):
    pass


class JobApplicationWithFileNameInDB(JobApplicationWithoutFile):
    cvName: str
    clName: Optional[str]


class JobApplicationInDB(JobApplicationWithFileNameInDB):
    ownerId: str


class CleanedJobApplicationForUser(JobApplicationInDB):
    """
    A pydantic model to represent a cleaned job application:
    - Removes the ownerId field for security reasons
    """

    id: str
    role: str
    company: str
    createdAt: datetime
    updatedAt: datetime
