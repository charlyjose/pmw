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
