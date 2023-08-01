from datetime import datetime
from enum import Enum

from pydantic import BaseModel
from fastapi import UploadFile


class JobCVFileType(str, Enum):
    PDF = "PDF"
    DOCX = "DOCX"
    DOC = "DOC"
    TXT = "TXT"
    OTHER = "OTHER"


class JobApplicationWithoutFile(BaseModel):
    jobId: str
    name: str
    email: str
    fileType: JobCVFileType


class JobApplicationWithFile(JobApplicationWithoutFile):
    cv: UploadFile


class JobApplicationForm(JobApplicationWithFile):
    pass


class JobApplicationWithFileNameInDB(JobApplicationWithoutFile):
    cvName: str


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
