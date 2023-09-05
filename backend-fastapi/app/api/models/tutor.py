from pydantic import BaseModel

from app.api.models.auth import Department


class PlacementTutor(BaseModel):
    department: Department
    userId: str
