from typing import List, Optional

from prisma.models import PlacementVisitItinerary

from app.prisma import prisma


# A helper function to create a placement visit itinerary
async def create_placement_visit_itinerary(placement_visit_itinerary: dict) -> Optional[PlacementVisitItinerary]:
    '''
    A helper function to create a placement visit itinerary
    :param placement_visit_itinerary: dict
    :return: PlacementVisitItinerary
    '''
    return await prisma.placementvisititinerary.create(placement_visit_itinerary)


# A helper function to check if a placement visit itinerary exists for tutor
async def get_placement_visit_itinerary_exists_for_a_tutor_id(tutor_id: str) -> Optional[List[PlacementVisitItinerary]]:
    '''
    A helper function to check if a placement visit itinerary exists for a tutor
    :param tutor_id: str
    :return: List[PlacementVisitItinerary]
    '''
    return await prisma.placementvisititinerary.find_many(where={"tutorId": tutor_id})


# A helper function to get all placement visit iternerary for a tutor from the database with pagination
async def get_all_placement_visit_itinerary_for_a_tutor_paginated(
    tutor_id: str, skip: int, take: int = 10
) -> List[PlacementVisitItinerary]:
    '''
    A helper function to get all placement visit iternerary for a tutor from the database with pagination
    :param tutor_id: str
    :param skip: int
    :param take: int
    :return: List[PlacementVisitItinerary]
    '''
    return await prisma.placementvisititinerary.find_many(skip=skip, take=take, where={"tutorId": tutor_id})


# A helper function to change the status of placement visit itinerary
async def change_placement_visit_itinerary_status(id: str, status: bool) -> Optional[PlacementVisitItinerary]:
    '''
    A helper function to change the status of placement visit itinerary
    :param id: str
    :param status: bool
    :return: PlacementVisitItinerary
    '''
    return await prisma.placementvisititinerary.update(where={"id": id}, data={"completed": status})


# A helper function to get placement visit itinerary by id
async def get_placement_visit_itinerary_by_id(id: str) -> Optional[PlacementVisitItinerary]:
    '''
    A helper function to get placement visit itinerary by id
    :param id: str
    :return: PlacementVisitItinerary
    '''
    return await prisma.placementvisititinerary.find_unique(where={"id": id})

