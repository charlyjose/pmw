from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel

from app.api.models.auth import StudentLevel
from app.api.models.placement_visit import PlacementDetails, PlacementLocationDetails, PlacementVisitRegion, PlacementVisitStatus


class PlacementStudentForm(PlacementDetails, PlacementLocationDetails):
    pass


class PlacementStudentWithRegion(PlacementStudentForm):
    region: PlacementVisitRegion


class PlacementStudentInDB(PlacementStudentWithRegion):
    tutorId: str
    userId: str


class CleanedPlacementStudent(PlacementStudentWithRegion):
    visitStatus: PlacementVisitStatus
    createdAt: datetime
    updatedAt: datetime
