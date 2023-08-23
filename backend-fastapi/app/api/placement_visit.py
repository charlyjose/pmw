from typing import List, Optional

from fastapi import APIRouter, Depends
from fastapi import status as http_status
from fastapi.encoders import jsonable_encoder

from app.api.auth import ValidateUserRole
from app.api.models import action_status
from app.api.models.auth import Role as UserRole
from app.api.models.placement_visit import (
    PlacementVisitForUser,
    PlacementVisitGeoLocationForUser,
    PlacementVisitItinerary,
    PlacementVisitRegion,
    PlacementVisitItineraryInDB,
    PlacementVisitItineraryForTutor,
    PlacementVisitWithVisitStatus,
    RoutePlanForVisitInDB,
    PlacementVisitItineraryForStudent,
)
from app.api.models.response import JSONResponseModel
from app.api.models.route_plan import PlacementVisitLocations, Unit, Coordinate, StartLocation, VisitPlan
from app.pnp_helpers.auth import no_access_to_content_response
from app.pnp_helpers.json_response_wrapper import default_response
from app.pnp_helpers.user import user_not_found_response
from app.utils.auth import pyJWTDecodedUserId
from app.utils.db import placement_visit as placement_visit_db
from app.utils.db import user as user_db
from app.utils.route_planner import get_route_plan


from app.utils.db import placement_visit_itinerary as placement_visit_itinerary_db

router = APIRouter()


# Get the geo location for all the placement applications under a tutor
@router.get(
    "/tutor/placement/visit/geo-location",
    summary="Get the geo location for all the placement applications under a tutor",
    tags=["placement_visit"],
    response_model=JSONResponseModel,
)
async def get_geo_location_for_all_placement_applications_under_a_tutor(user_id: str = Depends(pyJWTDecodedUserId())):
    if not user_id:
        return user_not_found_response()

    # Check if the user is a tutor
    roles = [UserRole.TUTOR]
    if not await ValidateUserRole(user_id, roles)():
        return no_access_to_content_response()

    # Get the geo location for all the placement applications under a tutor
    geo_location = await placement_visit_db.get_geo_lat_lng_location_for_all_placement_applications_under_a_reviewer(user_id)

    geo_location_list = []
    for location in geo_location:
        geo_location_for_user = PlacementVisitGeoLocationForUser(
            studentId=location.ownerId,
            address=location.organisationLocationGoogleMapsAddress,
            latitude=location.organisationLocationGoogleMapsLat,
            longitude=location.organisationLocationGoogleMapsLng,
        ).dict()
        json_compatiable_geo_location_for_user = jsonable_encoder(geo_location_for_user)
        geo_location_list.append(json_compatiable_geo_location_for_user)

    # Check if the geo location is empty
    if not geo_location:
        message = "No geo locations found"
        return default_response(http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_NOT_FOUND, message=message)

    message = "Geo locations fetched"
    data = {"locations": geo_location_list}
    return default_response(http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_FETCHED, message=message, data=data)


# Get the geo location for all the placement applications under a tutor
@router.get(
    "/tutor/placement/visit/region", summary="Get the geo locations in a region", tags=["placement_visit"], response_model=JSONResponseModel
)
async def get_region_data(tutor_id: str = Depends(pyJWTDecodedUserId()), region: str = None):
    if not tutor_id:
        return user_not_found_response()

    # Check if the user is a tutor
    roles = [UserRole.TUTOR]
    if not await ValidateUserRole(tutor_id, roles)():
        return no_access_to_content_response()

    # Check if the region is valid
    valid_region = PlacementVisitRegion.__members__.get(region.upper())
    if not valid_region:
        message = "Invalid region"
        return default_response(http_status=http_status.HTTP_400_BAD_REQUEST, action_status=action_status.INVALID_INPUT, message=message)

    # Get the geo location for all the placement applications under a tutor
    on_placement_students = await placement_visit_db.get_all_on_placement_in_a_region_under_a_tutor_with_pending_visit(
        tutor_id, valid_region.value
    )

    # Get student details for all the students in the geo location
    studentIds = [placement.userId for placement in on_placement_students]
    student_details = await user_db.get_users_by_user_ids(studentIds)

    placement_list = []
    for placement in on_placement_students:
        student = next((student for student in student_details if student.id == placement.userId), None)
        placement_for_user = PlacementVisitForUser(
            studentId=student.id, firstName=student.firstName, lastName=student.lastName, **placement.dict()
        ).dict()
        json_compatiable_placement_for_user = jsonable_encoder(placement_for_user)
        placement_list.append(json_compatiable_placement_for_user)

    # Check if the geo location is empty
    if not on_placement_students:
        message = "No geo locations found"
        data = {"placements": placement_list}
        return default_response(http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_NOT_FOUND, message=message, data=data)

    message = "Geo locations fetched"
    data = {"placements": placement_list}
    return default_response(http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_FETCHED, message=message, data=data)


# # Create a route plan for placement visit
# # Takes: List[studentId], visitDate, location coordinates
# @router.post("/tutor/placement/visit/route-plan", summary="Create a route plan for placement visit", tags=["placement_visit"])
# async def create_route_plan_for_placement_visit(
#     placement_visit_locations: List[PlacementVisitLocations], unit: str = Unit.KM, tutor_id: str = Depends(pyJWTDecodedUserId())
# ):
#     if not tutor_id:
#         return user_not_found_response()

#     # Get route plan
#     route_plan = get_route_plan(placement_visit_locations, unit=unit, recommendations=True)
#     json_compatiable_route_plan = jsonable_encoder(route_plan)
#     message = "Route plan created"
#     data = {"route_plan": json_compatiable_route_plan}
#     return default_response(http_status=http_status.HTTP_200_OK, action_status=action_status.NO_ERROR, message=message, data=data)


# Create a route plan for placement visit
@router.post("/tutor/placement/visit/route-plan", summary="Create a route plan for placement visit", tags=["placement_visit"])
async def create_route_plan_for_placement_visit(
    placement_ids: List[str],
    start_location: StartLocation,
    unit: str = Unit.KM,
    recommendations: Optional[bool] = True,
    tutor_id: str = Depends(pyJWTDecodedUserId()),
):
    if not tutor_id:
        return user_not_found_response()

    # Fetch Placement Student Details from DB
    placement_students = await placement_visit_db.get_placement_applications_for_given_application_ids(placement_ids)

    placement_visit_locations = [start_location]
    for placement in placement_students:
        placement_visit_location = PlacementVisitLocations(
            placement_id=placement.id,
            address=placement.address,
            coordinate=Coordinate(latitude=placement.latitude, longitude=placement.longitude),
        )
        placement_visit_locations.append(placement_visit_location)

    # Get route plan
    route_plan = get_route_plan(placement_visit_locations, unit=unit, recommendations=recommendations)

    json_compatiable_route_plan = jsonable_encoder(route_plan)
    message = "Route plan created"
    data = {"route_plan": json_compatiable_route_plan}
    return default_response(http_status=http_status.HTTP_200_OK, action_status=action_status.NO_ERROR, message=message, data=data)


# Confirm placement visit
# Takes: Visit plan, visitDate, visit date
@router.post("/tutor/placement/visit/route-plan/confirm", summary="Confirm placement visit", tags=["placement_visit"])
async def confirm_placement_visit(visit_plan: VisitPlan, tutor_id: str = Depends(pyJWTDecodedUserId())):
    if not tutor_id:
        return user_not_found_response()

    placement_ids = [city.placement_id for city in visit_plan.route_plan.cities[1:-1]]

    startAddress = [
        visit_plan.route_plan.cities[0].address,
        visit_plan.route_plan.cities[0].coordinate.longitude,
        visit_plan.route_plan.cities[0].coordinate.latitude,
    ]

    # Get placement visit itenerary for a tutor
    placement_visit_itinerary = await placement_visit_itinerary_db.get_placement_visit_itinerary_exists_for_a_tutor_id(tutor_id=tutor_id)
    placement_ids_in_itenerary_list = [placement.placementId for placement in placement_visit_itinerary]

    # Check if placement ids as a whole list are already in placement_ids_in_itenerary_list
    already_in_itinerary = placement_ids in placement_ids_in_itenerary_list

    if already_in_itinerary:
        message = "Placement visit already exists"
        return default_response(
            http_status=http_status.HTTP_400_BAD_REQUEST, action_status=action_status.DATA_ALREADY_EXISTS, message=message
        )

    # Get the region from DB for all the placements in the visit plan and skip first and last location
    placement_details = await placement_visit_db.get_placement_applications_for_given_application_ids(placement_ids)
    regions = [placement.region for placement in placement_details]

    # Check if all the placements are in the same region
    if not all(region == regions[0] for region in regions):
        message = "Placements are not in the same region"
        return default_response(http_status=http_status.HTTP_400_BAD_REQUEST, action_status=action_status.INVALID_INPUT, message=message)

    # Prepare the placement visit itinerary
    placement_visit_itinerary = PlacementVisitItineraryInDB(
        placementId=placement_ids,
        region=regions[0],
        visitDate=visit_plan.visit_date,
        tutorId=tutor_id,
        startAddress=startAddress,
        totalDistance=visit_plan.route_plan.total_distance,
        unit=visit_plan.route_plan.unit,
    )

    # Create a placement visit itinerary
    visit_itinerary = await placement_visit_itinerary_db.create_placement_visit_itinerary(placement_visit_itinerary.dict())
    if not visit_itinerary:
        message = "Failed to create placement visit itinerary"
        return default_response(http_status=http_status.HTTP_400_BAD_REQUEST, action_status=action_status.UNKNOWN_ERROR, message=message)

    # Change the visit status of each placement student to SCHEDULED
    placement_student_visit_status_update = await placement_visit_db.change_visit_status_for_placement_applications(
        placement_ids=placement_ids, visit_status="SCHEDULED"
    )
    if not placement_student_visit_status_update:
        message = "Failed to update placement visit status"
        return default_response(http_status=http_status.HTTP_400_BAD_REQUEST, action_status=action_status.UNKNOWN_ERROR, message=message)

    message = "Placement visit confirmed. Itinerary created"
    return default_response(http_status=http_status.HTTP_200_OK, action_status=action_status.NO_ERROR, message=message)


# Get all the placement visit itineraries for a student
@router.get("/student/placement/visit/itinerary", summary="Get all the placement visit itineraries for a student", tags=["placement_visit"])
async def get_all_placement_visit_itineraries_for_a_student(user_id: str = Depends(pyJWTDecodedUserId())):
    if not user_id:
        return user_not_found_response()

    # Check if the user is a tutor
    roles = [UserRole.STUDENT]
    if not await ValidateUserRole(user_id, roles)():
        return no_access_to_content_response()

    # Get placement student details for a student
    placement_details = await placement_visit_db.get_placement_data_for_a_student(user_id)
    if not placement_details:
        message = "Placement details not found"
        return default_response(http_status=http_status.HTTP_404_NOT_FOUND, action_status=action_status.DATA_NOT_FOUND, message=message)

    placement_id = placement_details.id

    tutor_id = placement_details.tutorId

    # Get tutor details for a tutor
    tutor_details = await user_db.get_user_by_id(tutor_id)
    if not tutor_details:
        message = "Tutor details not found"
        return default_response(http_status=http_status.HTTP_404_NOT_FOUND, action_status=action_status.DATA_NOT_FOUND, message=message)

    tutor_name = tutor_details.name

    # Get placement visit itenerary for a tutor
    placement_visit_itinerary = await placement_visit_itinerary_db.get_placement_visit_itinerary_exists_for_a_tutor_id(tutor_id=tutor_id)

    student_placement_itinerary = next(
        (placement for placement in placement_visit_itinerary if placement_id in placement.placementId), None
    )

    if not student_placement_itinerary:
        message = "Placement visit itinerary not found"
        data = {"placement_visit_itinerary": []}
        return default_response(
            http_status=http_status.HTTP_404_NOT_FOUND, action_status=action_status.DATA_NOT_FOUND, message=message, data=data
        )

    placement_visit_itinerary_for_student = PlacementVisitItineraryForStudent(
        id=student_placement_itinerary.id,
        region=student_placement_itinerary.region,
        visitDate=student_placement_itinerary.visitDate,
        startAddress=student_placement_itinerary.startAddress,
        totalDistance=student_placement_itinerary.totalDistance,
        unit=student_placement_itinerary.unit,
        completed=student_placement_itinerary.completed,
        placements=[placement_details],
        tutorName=tutor_name,
    ).dict()

    json_compatiable_placement_visit_itinerary_for_student = jsonable_encoder(placement_visit_itinerary_for_student)
    message = "Placement visit itinerary fetched"
    data = {"placement_visit_itinerary": [json_compatiable_placement_visit_itinerary_for_student]}
    return default_response(http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_FETCHED, message=message, data=data)


# Get all the placement visit itineraries for a tutor page wise
@router.get(
    "/tutor/placement/visit/itinerary", summary="Get all the placement visit itineraries for a tutor page wise", tags=["placement_visit"]
)
async def get_all_placement_visit_itineraries_for_a_tutor_page_wise(tutor_id: str = Depends(pyJWTDecodedUserId()), page: int = 1):
    if not tutor_id:
        return user_not_found_response()

    # Check if the user is a tutor
    roles = [UserRole.TUTOR]
    if not await ValidateUserRole(tutor_id, roles)():
        return no_access_to_content_response()

    # Page nmber should be greater than 0
    if page > 0:
        skip = (page - 1) * 10
        take = 10

        # Get all the placement visit itineraries for a tutor page wise
        placement_visit_itineraries = await placement_visit_itinerary_db.get_all_placement_visit_itinerary_for_a_tutor_paginated(
            tutor_id=tutor_id, skip=skip, take=take
        )

        # Check if the placement visit itineraries is empty
        if not placement_visit_itineraries:
            message = "No placement visit itineraries found"
            data = {"placement_visit_itinerary": [], "hasMore": False}
            return default_response(
                http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_NOT_FOUND, message=message, data=data
            )

        # Combine the placement ids from all the placement visit itineraries
        placement_ids = []
        for placement_visit_itinerary in placement_visit_itineraries:
            placement_ids.extend(placement_visit_itinerary.placementId)

        # Get placement details for all the placement id in the placement visit itineraries
        placement_details_list = await placement_visit_db.get_placement_applications_for_given_application_ids(placement_ids)

        # Get student details for all the students of the placement ids
        student_ids = [placement.userId for placement in placement_details_list]
        student_details = await user_db.get_users_by_user_ids(student_ids)

        # Create the placement visit itineraries for a tutor
        placement_visit_itinerary_list = []
        for placement_visit_itinerary in placement_visit_itineraries:
            # For each placement itinerary create PlacementVisitItineraryForTutor based on the placement Ids

            # Get the placement details from placement_details_list based on the current placementIds in placement_visit_itinerary
            placement_ids = placement_visit_itinerary.placementId

            # Get student details of the students in the placement_ids
            students = [student for student in student_details if student.id in student_ids]

            # Get all placements for the placement ids from the placement_details_list
            placements = [placement for placement in placement_details_list if placement.id in placement_ids]

            # Combine the placement details and student details for each placement to create PlacementVisitForUser
            placement_visit_for_user: List[PlacementVisitWithVisitStatus] = []
            for placement in placements:
                student = next((student for student in students if student.id == placement.userId), None)
                placement_visit_for_user.append(
                    PlacementVisitWithVisitStatus(
                        studentId=student.id, firstName=student.firstName, lastName=student.lastName, **placement.dict()
                    ).dict()
                )

            # Create PlacementVisitItineraryForTutor
            placement_visit_itinerary_for_tutor = PlacementVisitItineraryForTutor(
                id=placement_visit_itinerary.id,
                region=placement_visit_itinerary.region,
                visitDate=placement_visit_itinerary.visitDate,
                placements=placement_visit_for_user,
                startAddress=placement_visit_itinerary.startAddress,
                totalDistance=placement_visit_itinerary.totalDistance,
                unit=placement_visit_itinerary.unit,
                completed=placement_visit_itinerary.completed,
            ).dict()

            # Add the placement visit itinerary to the list
            json_compatiable_placement_visit_itinerary_list_for_user = jsonable_encoder(placement_visit_itinerary_for_tutor)
            placement_visit_itinerary_list.append(json_compatiable_placement_visit_itinerary_list_for_user)

        # Set hasMore to true if there are more jobs to be fetched
        hasMore = len(placement_visit_itineraries) == 10

        message = "Placement visit itineraries fetched"
        data = {"placement_visit_itinerary": placement_visit_itinerary_list, "hasMore": hasMore}
        return default_response(http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_FETCHED, message=message, data=data)
    else:
        message = "Page number should be greater than 0"
        return default_response(http_status=http_status.HTTP_404_NOT_FOUND, action_status=action_status.DATA_NOT_FOUND, message=message)


# Change the status of the placement visit itinerary
@router.put(
    "/tutor/placement/visit/itinerary/status", summary="Change the status of the placement visit itinerary", tags=["placement_visit"]
)
async def change_the_status_of_the_placement_visit_itinerary(id: str, status: bool, tutor_id: str = Depends(pyJWTDecodedUserId())):
    roles = [UserRole.TUTOR]
    valid_user_role = await ValidateUserRole(tutor_id, roles)()
    if not valid_user_role:
        return no_access_to_content_response()

    # Check if the placement visit itinerary exists
    placement_visit_itinerary = await placement_visit_itinerary_db.get_placement_visit_itinerary_by_id(id=id)
    if not placement_visit_itinerary:
        message = "Placement visit itinerary not found"
        return default_response(http_status=http_status.HTTP_404_NOT_FOUND, action_status=action_status.DATA_NOT_FOUND, message=message)

    # Change the status of the placement visit itinerary
    placement_visit_itinerary = await placement_visit_itinerary_db.change_placement_visit_itinerary_status(id=id, status=status)

    # Get placement Ids from the placement visit itinerary
    placement_ids = placement_visit_itinerary.placementId
    print(placement_ids)

    # Change the visit status of each placement student to COMPLETED
    placement_student_visit_status_update = await placement_visit_db.change_visit_status_for_placement_applications(
        placement_ids=placement_ids, visit_status="COMPLETED"
    )
    if not placement_student_visit_status_update:
        message = "Failed to update placement visit status"
        return default_response(http_status=http_status.HTTP_400_BAD_REQUEST, action_status=action_status.UNKNOWN_ERROR, message=message)

    return default_response(
        http_status=http_status.HTTP_200_OK, action_status=action_status.NO_ERROR, message="Placement visit itinerary status changed"
    )
