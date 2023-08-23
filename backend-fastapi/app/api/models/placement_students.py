from datetime import datetime

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
