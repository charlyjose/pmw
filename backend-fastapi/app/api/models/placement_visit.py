from datetime import datetime
from enum import Enum

from pydantic import BaseModel


class StudentPlacementStatus(str, Enum):
    ON_PLACEMENT = "ON_PLACEMENT"
    NOT_ON_PLACEMENT = "NOT_ON_PLACEMENT"
    COMPLETED_PLACEMENT = "COMPLETED_PLACEMENT"


class PlacementVisitStatus(str, Enum):
    PENDING = "PENDING"
    SCHEDULED = "SCHEDULED"
    CONFIRMED = "CONFIRMED"
    COMPLETED = "COMPLETED"
    CANCLED = "CANCLED"


class PlacementVisitRegion(str, Enum):
    LONDON = "LONDON"
    SE = "SE"
    SW = "SW"
    WALES = "WALES"
    EM = "EM"
    WM = "WM"
    NE = "NE"
    NW = "NW"
    YH = "YH"
    NI = "NI"
    SCOTLAND = "SCOTLAND"
    INTERNATIONAL = "INTERNATIONAL"


class StudentDetails(BaseModel):
    studentId: str
    firstName: str
    lastName: str


class PlacementDetails(BaseModel):
    status: StudentPlacementStatus
    startDate: datetime
    endDate: datetime
    roleTitle: str
    orgName: str


class LocationDetails(BaseModel):
    address: str
    latitude: float
    longitude: float


class PlacementVisitForUser(StudentDetails, PlacementDetails, LocationDetails):
    id: str


# class PlacementVisitRegionDataForUser(StudentDetails):
#     location: LocationDetails = None
#     startDate: datetime = None


class PlacementVisitGeoLocationForUser(BaseModel):
    studentId: str = None
    address: str = None
    latitude: float = None
    longitude: float = None
