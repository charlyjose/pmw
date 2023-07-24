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


class PlacementStudentDetails(BaseModel):
    firstName: str
    lastName: str
    studentNumber: str
    email: str
    programme: str
    department: str
    contactNumber: str
    studentVisa: PlacementStudentVisa


class PlacementProviderDetails(BaseModel):
    organisationName: str
    organisationAddress: str
    organisationPostcode: str
    organisationWebAddress: str
    organisationContactName: str
    organisationContactJobTitle: str
    organisationContactEmail: str
    organisationContactNumber: Optional[str]
    organisationLocationGoogleMapsAddress: str
    organisationLocationGoogleMapsLat: str
    organisationLocationGoogleMapsLng: str


class PlacementRoleDetails(BaseModel):
    roleTitle: str
    roleStartDate: datetime
    roleEndDate: datetime
    workingHours: str
    probationPeriod: PlacementProbationPeriod
    salary: str
    roleSource: str
    roleInformed: PlacementRoleInformed
    roleDescription: str
    probationPeriodDetails: Optional[str]


class PlacementWorkFactors(BaseModel):
    remoteWorking: PlacementRemoteWorking
    remoteWorkingOverview: Optional[str]
    remoteWorkingReason: Optional[str]


class PlacementTransportAndTravelFactors(BaseModel):
    travelMethod: PlacementTravelMethod
    travelMethodDetails: Optional[str]
    travelDifferentLocation: PlacementTravelDifferentLocation
    travelDifferentLocationDetails: Optional[str]


class PlacementLocationAndRegionalFactors(BaseModel):
    locationRisks: PlacementLocationRisks
    locationRisksDetails: Optional[str]
    accommodationArrangements: PlacementAccommodationArrangements
    accommodationArrangementsDetails: Optional[str]


class PlacementHealthAndEnvironmentalFactors(BaseModel):
    precautionaryMeasures: PlacementPrecautionaryMeasures
    precautionaryMeasuresDetails: Optional[str]


class PlacementPersonalFactors(BaseModel):
    healthConditions: PlacementHealthConditions
    healthConditionsDetails: Optional[str]
    disability: PlacementDisability
    disabilityDetails: Optional[str]


class PlacementPoliciesAndInsurance(BaseModel):
    placementOverseas: PlacementOverseas


class PlacementDeclaration(BaseModel):
    declarationName: str
    declarationSignature: str


class PlacementApplication(BaseModel):
    # # 1. Student details
    studentDetails: PlacementStudentDetails
    # # 2. Placement provider details
    placementProviderDetails: PlacementProviderDetails
    # # 3. Placement Role Details
    # placementRoleDetails: PlacementRoleDetails
    # # 4. Work Factors
    # placementWorkFactors: PlacementWorkFactors
    # # 5. Transport and Travel Factors
    # placementTransportAndTravelFactors: PlacementTransportAndTravelFactors
    # # 6. Location and Regional Factors
    # placementLocationAndRegionalFactors: PlacementLocationAndRegionalFactors
    # # 7. Health and Environmental Factors
    # placementHealthAndEnvironmentalFactors: PlacementHealthAndEnvironmentalFactors
    # # 8. Personal Factors
    # placementPersonalFactors: PlacementPersonalFactors
    # # 9. Policies and Insurance
    # placementPoliciesAndInsurance: PlacementPoliciesAndInsurance
    # # 10. Declaration and Signature
    # placementDeclaration: PlacementDeclaration
