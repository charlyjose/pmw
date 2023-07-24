from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel


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
    # 1. Student details
    firstName: str
    lastName: str
    studentNumber: int
    email: str
    programme: str
    department: str
    contactNumber: str
    studentVisa: PlacementStudentVisa

    # 2. Placement provider details
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

    # 3. Placement Role Details
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

    # 4. Work Factors
    remoteWorking: PlacementRemoteWorking
    remoteWorkingOverview: Optional[str] = ""
    remoteWorkingReason: Optional[str] = ""

    # 5. Transport and Travel Factors
    travelMethod: PlacementTravelMethod
    travelMethodDetails: Optional[str] = ""
    travelDifferentLocation: PlacementTravelDifferentLocation
    travelDifferentLocationDetails: Optional[str] = ""

    # 6. Location and Regional Factors
    locationRisks: PlacementLocationRisks
    locationRisksDetails: Optional[str]
    accommodationArrangements: PlacementAccommodationArrangements
    accommodationArrangementsDetails: Optional[str] = ""

    # 7. Health and Environmental Factors
    precautionaryMeasures: PlacementPrecautionaryMeasures
    precautionaryMeasuresDetails: Optional[str] = ""

    # 8. Personal Factors
    healthConditions: PlacementHealthConditions
    healthConditionsDetails: Optional[str] = ""
    disability: PlacementDisability
    disabilityDetails: Optional[str] = ""

    # 9. Policies and Insurance
    placementOverseas: PlacementOverseas

    # 10. Declaration and Signature
    declarationName: str
    declarationSignature: str
    declarationDate: datetime
