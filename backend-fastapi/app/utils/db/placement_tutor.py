from typing import List, Optional

from prisma.models import PlacementTutor

from app.prisma import prisma


# Helper function to get the placement tutor by their department
async def get_placement_tutor_by_department(department: str) -> Optional[PlacementTutor]:
    """
    Helper function to get the placement tutor by their department
    :param department: str
    :return: PlacementTutor
    """
    return await prisma.placementtutor.find_many(where={"department": department})


# Helper function to get the placement id by department
async def get_placement_tutor_id_by_department(department: str) -> Optional[PlacementTutor]:
    """
    Helper function to get the placement id by department
    :param department: str
    :return: PlacementTutor
    """
    tutor = await prisma.placementtutor.find_first(where={"department": department})
    return tutor.userId if tutor else None


# Helper function to get all placement tutors by department list
async def get_all_placement_tutors_by_department_list(departments: List[str]) -> Optional[List[PlacementTutor]]:
    """
    Helper function to get all placement tutors by department list
    :param departments: List[str]
    :return: List[PlacementTutor]
    """
    return await prisma.placementtutor.find_many(where={"department": {"in": departments}})


# Helper function to get user id by placement tutor id and department
async def get_user_id_by_placement_tutor_id_and_department(id: str, depatment: str) -> Optional[PlacementTutor]:
    """
    Helper function to get user id by placement tutor id and department
    :param id: str
    :param depatment: str
    :return: PlacementTutor
    """
    tutor = await prisma.placementtutor.find_first(where={"userId": id, "department": depatment})
    return tutor.userId if tutor else None


# Helper function to create a new placement tutor
async def create_new_placement_tutor(newPlacementTutorData: dict) -> Optional[PlacementTutor]:
    """
    Helper function to create a new placement tutor
    :param newPlacementTutorData: dict
    :return: PlacementTutor
    """
    return await prisma.placementtutor.create(newPlacementTutorData)
