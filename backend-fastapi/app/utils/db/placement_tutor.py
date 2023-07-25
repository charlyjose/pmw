from typing import Optional

from prisma.models import PlacementTutor

from app.prisma import prisma


# Helper function to get the placement tutor by their department
async def get_placement_tutor_by_department(department: str) -> Optional[PlacementTutor]:
    """
    Helper function to get the placement tutor by their department
    :param department: str
    :return: PlacementTutor
    """
    return await prisma.placementtutor.find_unique(where={"department": department})


# Helper function to get the placement id by department
async def get_placement_tutor_id_by_department(department: str) -> Optional[PlacementTutor]:
    """
    Helper function to get the placement id by department
    :param department: str
    :return: PlacementTutor
    """
    tutor = await prisma.placementtutor.find_first(where={"department": department})
    return tutor.userId if tutor else None
