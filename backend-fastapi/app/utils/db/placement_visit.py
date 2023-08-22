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
async def get_all_on_placement_in_a_region_under_a_tutor_with_pending_visit(
    tutor_id: str, region: str
) -> Optional[List[PlacementStudents]]:
    '''
    A helper function to get all the student detils who are ON_PLACEMENT in a region for a placement visit under a tutor
    :param tutor_id: str
    :return: List[PlacementStudents]
    '''
    return await prisma.placementstudents.find_many(
        where={"tutorId": tutor_id, "status": "ON_PLACEMENT", "region": region, "visitStatus": "PENDING"}
    )


# A helper function to get the placement data for a student
async def get_placement_data_for_a_student(student_id: str) -> Optional[PlacementStudents]:
    '''
    A helper function to get the placement data for a student
    :param student_id: str
    :return: PlacementStudents
    '''
    return await prisma.placementstudents.find_unique(where={"userId": student_id})


# A helper function to update an existing placement form
async def update_application(applicationId: str, application: dict) -> Optional[PlacementStudents]:
    '''
    A helper function to update an existing placement form
    :param applicationId: str
    :param application: dict
    :return: PlacementStudents
    '''

    return await prisma.placementstudents.update(where={"id": applicationId}, data=application)


# A helper function to create a new placement form
async def create_new_application(application: dict) -> Optional[PlacementStudents]:
    '''
    A helper function to create a new placement form
    :param application: dict
    :return: PlacementStudents
    '''
    return await prisma.placementstudents.create(application)


# A helper function to get all the placement applications for given application ids
async def get_placement_applications_for_given_application_ids(application_ids: List[str]) -> Optional[List[PlacementStudents]]:
    '''
    A helper function to get all the placement applications for given application ids
    :param application_ids: List[str]
    :return: List[PlacementStudents]
    '''
    return await prisma.placementstudents.find_many(where={"id": {"in": application_ids}})
