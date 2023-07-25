from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel

from app.api.models.auth import StudentLevel


class PlacementStudentVisa(str, Enum):
    YES = "YES"
    NO = "NO"


class PlacementProbationPeriod(str, Enum):
    YES = "YES"
    NO = "NO"


class PlacementRoleInformed(str, Enum):
    YES = "YES"
    NO = "NO"


class PlacementRemoteWorking(str, Enum):
    YES = "YES"
    NO = "NO"


class PlacementTravelMethod(str, Enum):
    OWN_VEHICLE = "OWN_VEHICLE"
    PUBLIC_TRANSPORT = "PUBLIC_TRANSPORT"
    WALKING = "WALKING"
    CYCLE = "CYCLE"
    OTHER = "OTHER"


class PlacementTravelDifferentLocation(str, Enum):
    YES = "YES"
    NO = "NO"


class PlacementLocationRisks(str, Enum):
    YES = "YES"
    NO = "NO"


class PlacementAccommodationArrangements(str, Enum):
    RENT_SHARED_HOUSE_FLAT = "RENT_SHARED_HOUSE_FLAT"
    RENT_INDIVIDUAL_HOUSE_FLAT = "RENT_INDIVIDUAL_HOUSE_FLAT"
    LIVE_AT_HOME = "LIVE_AT_HOME"
    OTHER = "OTHER"


class PlacementPrecautionaryMeasures(str, Enum):
    YES = "YES"
    NO = "NO"


class PlacementHealthConditions(str, Enum):
    YES = "YES"
    NO = "NO"


class PlacementDisability(str, Enum):
    YES = "YES"
    NO = "NO"


class PlacementOverseas(str, Enum):
    YES = "YES"
    NO = "NO"


class PlacementApplicationForm(BaseModel):
    firstName: str
    lastName: str
    studentNumber: str
    email: str
    programme: str
    department: str
    contactNumber: str
    studentVisa: PlacementStudentVisa

    organisationName: str
    organisationAddress: str
    organisationPostcode: str
    organisationWebAddress: str
    organisationContactName: str
    organisationContactJobTitle: str
    organisationContactEmail: str
    organisationContactNumber: Optional[str] = ""
    organisationLocationGoogleMapsAddress: str
    organisationLocationGoogleMapsLat: float
    organisationLocationGoogleMapsLng: float

    roleTitle: str
    roleStartDate: datetime
    roleEndDate: datetime
    workingHours: int
    probationPeriod: PlacementProbationPeriod
    salary: int
    roleSource: str
    roleInformed: PlacementRoleInformed
    roleDescription: str
    probationPeriodDetails: Optional[str] = ""

    remoteWorking: PlacementRemoteWorking
    remoteWorkingOverview: Optional[str] = ""
    remoteWorkingReason: Optional[str] = ""

    travelMethod: PlacementTravelMethod
    travelMethodDetails: Optional[str] = ""
    travelDifferentLocation: PlacementTravelDifferentLocation
    travelDifferentLocationDetails: Optional[str] = ""

    locationRisks: PlacementLocationRisks
    locationRisksDetails: Optional[str]
    accommodationArrangements: PlacementAccommodationArrangements
    accommodationArrangementsDetails: Optional[str] = ""

    precautionaryMeasures: PlacementPrecautionaryMeasures
    precautionaryMeasuresDetails: Optional[str] = ""

    healthConditions: PlacementHealthConditions
    healthConditionsDetails: Optional[str] = ""
    disability: PlacementDisability
    disabilityDetails: Optional[str] = ""

    placementOverseas: PlacementOverseas

    declarationName: str
    declarationSignature: str
    declarationDate: datetime


class PlacementApplicationInDB(PlacementApplicationForm):
    ownerId: str
    reviewerId: str


class PlacementApplicationStatus(str, Enum):
    PENDING = "PENDING"
    REVIEW = "REVIEW"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class PlacementApplicationInDBUpdateStatus(PlacementApplicationForm):
    status: PlacementApplicationStatus


class PlacementApplicationInDBUpdateReviewer(PlacementApplicationForm):
    reviewerId: str


class CleanedPlacementApplicationForUser(PlacementApplicationForm):
    """
    A pydantic model to represent a cleaned placement application:
    - Removes the ownerId and reviewerId field for security reasons
    """

    id: str
    status: PlacementApplicationStatus
    createdAt: datetime
    updatedAt: datetime


class CleanedPlacementApplicationForTutor(CleanedPlacementApplicationForUser):
    studentLevel: StudentLevel


# class CleanedPlacementApplicationForUser(PlacementApplicationForm):
#     """
#     A pydantic model to represent a cleaned placement application:
#     - Removes the ownerId and reviewerId field for security reasons
#     """

#     status: PlacementApplicationStatus
#     createdAt: datetime
#     updatedAt: datetime


class CleanedPlacementApplicationWithReviewerName(CleanedPlacementApplicationForUser):
    """
    A pydantic model to represent a cleaned placement application:
    - Removes the ownerId and reviewerId field for security reasons
    - Add reviewer full name
    """

    reviewedBy: str


class CleanedPlacementApplicationWithCreaterAndReviewerName(CleanedPlacementApplicationForUser):
    """
    A pydantic model to represent a cleaned placement application:
    - Removes the ownerId and reviewerId field for security reasons
    - Add owner and reviewer full name
    """

    reviewedBy: str


class ReviewCommentsForm(BaseModel):
    comment_list: List[str]


# class ReviewCommentsInDB(ReviewCommentsForm):
#     reviewerId: str
#     applicationId: str
#     comment: str
#     createdAt: datetime
#     updatedAt: datetime


class ReviewCommentsInDB(BaseModel):
    ownerId: str
    applicationId: str
    comments: List[str]
