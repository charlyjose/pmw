from datetime import datetime
from enum import Enum

from fastapi import UploadFile
from pydantic import BaseModel


class ReportMonth(str, Enum):
    MONTH_1 = "MONTH_1"
    MONTH_2 = "MONTH_2"
    MONTH_3 = "MONTH_3"
    MONTH_4 = "MONTH_4"
    MONTH_5 = "MONTH_5"
    MONTH_6 = "MONTH_6"
    MONTH_7 = "MONTH_7"
    MONTH_8 = "MONTH_8"
    MONTH_9 = "MONTH_9"
    MONTH_10 = "MONTH_10"
    MONTH_11 = "MONTH_11"
    MONTH_12 = "MONTH_12"


class PlacementReportFileType(str, Enum):
    PDF = "PDF"
    DOCX = "DOCX"
    DOC = "DOC"
    TXT = "TXT"
    OTHER = "OTHER"


class ReportWithoutFile(BaseModel):
    title: str
    month: ReportMonth
    file_type: PlacementReportFileType


class ReportWithFile(ReportWithoutFile):
    report: UploadFile


class ReportForm(ReportWithFile):
    pass


class ReportWithFileNameInDB(ReportWithoutFile):
    report_name: str


class ReportInDB(ReportWithFileNameInDB):
    ownerId: str


class CleanedReportForUser(ReportWithFileNameInDB):
    """
    A pydantic model to represent a cleaned report:
    - Removes the ownerId field for security reasons
    """

    id: str
    createdAt: datetime
    updatedAt: datetime
