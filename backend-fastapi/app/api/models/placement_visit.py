from datetime import datetime
from enum import Enum
from typing import List

from pydantic import BaseModel

from app.api.models.route_plan import Unit, City


class StudentPlacementStatus(str, Enum):
    ON_PLACEMENT = "ON_PLACEMENT"
    NOT_ON_PLACEMENT = "NOT_ON_PLACEMENT"
    COMPLETED_PLACEMENT = "COMPLETED_PLACEMENT"


class PlacementVisitStatus(str, Enum):
    PENDING = "PENDING"
    SCHEDULED = "SCHEDULED"
    CONFIRMED = "CONFIRMED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class PlacementVisitRegion(str, Enum):
    LONDON = "LONDON"
    EASTERN = "EASTERN"
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
    startDate: datetime
    endDate: datetime
    roleTitle: str
    orgName: str


class PlacementDetailsWithStatus(BaseModel):
    status: StudentPlacementStatus


class PlacementLocationDetails(BaseModel):
    address: str
    latitude: float
    longitude: float


class PlacementVisitForUser(StudentDetails, PlacementDetails, PlacementDetailsWithStatus, PlacementLocationDetails):
    id: str


class PlacementVisitForStudent(PlacementDetails, PlacementDetailsWithStatus, PlacementLocationDetails):
    id: str


class PlacementVisitGeoLocationForUser(PlacementLocationDetails):
    studentId: str = None


class PlacementVisitItinerary(BaseModel):
    placementId: List[str]
    region: PlacementVisitRegion
    visitDate: datetime


class RoutePlanDetails(BaseModel):
    totalDistance: float = None
    unit: str = None


class PlacementVisitItineraryInDB(PlacementVisitItinerary, RoutePlanDetails):
    tutorId: str
    completed: bool = False
    startAddress: List[str] = []


class PlacementVisitWithVisitStatus(PlacementVisitForUser):
    visitStatus: PlacementVisitStatus


class PlacementVisitForStudentWithVisitStatus(PlacementVisitForStudent):
    visitStatus: PlacementVisitStatus


class RoutePlanForVisitInDB(City):
    pass


class PlacementVisitItineraryForTutor(BaseModel):
    id: str
    region: PlacementVisitRegion
    visitDate: datetime
    placements: List[PlacementVisitWithVisitStatus]
    totalDistance: float
    unit: Unit
    startAddress: List[str]
    completed: bool


class PlacementVisitItineraryForStudent(BaseModel):
    id: str
    region: PlacementVisitRegion
    visitDate: datetime
    placements: List[PlacementVisitForStudentWithVisitStatus]
    unit: Unit
    startAddress: List[str]
    completed: bool
    tutorName: str
