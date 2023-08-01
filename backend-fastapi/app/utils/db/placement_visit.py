from typing import List, Optional

from prisma.models import PlacementStudents

from app.prisma import prisma

# # A helper function to get geo location for all the placement applications under a reviewer
# async def get_geo_location_for_all_placement_applications_under_a_reviewer(reviewer_id: str) -> Optional[List[PlacementApplication]]:
#     '''
#     A helper function to get geo location for all the placement applications under a reviewer
#     :param reviewer_id: str
#     :return: List[PlacementApplication]
#     '''
#     return await prisma.placementapplication.find_many(where={"reviewerId": reviewer_id}, select={"geoLocation": True})


# A helper function to get geo lat and lng location for all the placement applications under a reviewer
async def get_geo_lat_lng_location_for_all_placement_applications_under_a_reviewer(reviewer_id: str):
    '''
    A helper function to get geo lat and lng location for all the placement applications under a reviewer
    :param reviewer_id: str
    :return: List[PlacementApplication]
    '''
    return await prisma.placementapplication.find_many(
        where={"reviewerId": reviewer_id},
        # include={
        #     "ownerId": True,
        #     "organisationLocationGoogleMapsAddress": True,
        #     "organisationLocationGoogleMapsLat": True,
        #     "organisationLocationGoogleMapsLng": True,
        # },
    )


# A helper function to get all the student detils who are ON_PLACEMENT in a region for a placement visit under a tutor
async def get_all_on_placement_in_a_region_under_a_tutor(tutor_id: str, region: str) -> Optional[List[PlacementStudents]]:
    '''
    A helper function to get all the student detils who are ON_PLACEMENT in a region for a placement visit under a tutor
    :param tutor_id: str
    :return: List[PlacementStudents]
    '''
    return await prisma.placementstudents.find_many(where={"tutorId": tutor_id, "status": "ON_PLACEMENT", "region": region})
