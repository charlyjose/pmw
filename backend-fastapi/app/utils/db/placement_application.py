from typing import List, Optional

from prisma.models import PlacementApplication

from app.prisma import prisma


# A helper function to create a new placement application
async def create_new_application(application: dict) -> Optional[PlacementApplication]:
    '''
    A helper function to create a new placement application
    :param application: dict
    :return: PlacementApplication
    '''
    return await prisma.placementapplication.create(application)


# A helper function to update an existing placement application
async def update_application(applicationId: str, application: dict) -> Optional[PlacementApplication]:
    '''
    A helper function to update an existing placement application
    :param applicationId: str
    :param application: dict
    :return: PlacementApplication
    '''

    return await prisma.placementapplication.update(where={"id": applicationId}, data=application)


# A helper function to get a placement application by its id
async def get_application_by_id(applicationId: str) -> Optional[PlacementApplication]:
    '''
    A helper function to get a placement application by its id
    :param applicationId: str
    :return: PlacementApplication
    '''
    return await prisma.placementapplication.find_unique(where={"id": applicationId})


# A helper function to get a placement application by its owner id
async def get_by_owner_id(ownerId: str) -> Optional[PlacementApplication]:
    '''
    A helper function to get a placement application by its owner id
    :param ownerId: str
    :return: PlacementApplication
    '''
    return await prisma.placementapplication.find_unique(where={"ownerId": ownerId})


# A helper function to check if a placement application exists for a user
async def check_exists_for_a_user(ownerId: str) -> bool:
    '''
    A helper function to check if a placement application exists
    :param ownerId: str
    :return: bool
    '''
    application = await get_by_owner_id(ownerId)
    if application:
        return True
    else:
        return False


# A helper function to check if a placement application exists based on its id
async def check_exists_by_id(applicationId: str) -> bool:
    '''
    A helper function to check if a placement application exists based on its id
    :param applicationId: str
    :return: bool
    '''
    application = await prisma.placementapplication.find_unique(where={"id": applicationId})
    if application:
        return True
    else:
        return False


# A helper function to get all placement applications by a reviewer
async def get_all_by_reviewer(reviewerId: str) -> List[PlacementApplication]:
    '''
    A helper function to get all placement applications by a reviewer
    :param reviewerId: str
    :return: List[PlacementApplication]
    '''
    return await prisma.placementapplication.find_many(where={"reviewerId": reviewerId})


# A helper function to get all placement applications by a reviewer with pagination
async def get_all_by_reviewer_paginated(reviewerId: str, skip: int, take: int = 10) -> List[PlacementApplication]:
    '''
    A helper function to get all placement applications by a reviewer with pagination
    :param reviewerId: str
    :param skip: int
    :param take: int
    :return: List[PlacementApplication]
    '''
    return await prisma.placementapplication.find_many(where={"reviewerId": reviewerId}, skip=skip, take=take)


# A helper function to get all approved placement applications with pagination
async def get_all_approved_paginated(skip: int, take: int = 10) -> List[PlacementApplication]:
    '''
    A helper function to get all approved placement applications with pagination
    :param reviewerId: str
    :param skip: int
    :param take: int
    :return: List[PlacementApplication]
    '''
    return await prisma.placementapplication.find_many(where={"status": "APPROVED"}, skip=skip, take=take)


# A helper function to get count of placement applications by a reviewer not equal to a APPROVED status
async def get_count_of_placement_applications_by_reviewer_not_equal_to_approved(reviewerId: str) -> int:
    '''
    A helper function to get count of placement applications by a reviewer not equal to a APPROVED status
    :param reviewerId: str
    :return: int
    '''
    return await prisma.placementapplication.count(where={"reviewerId": reviewerId, "status": {"not_in": ["APPROVED", "REJECTED"]}})
