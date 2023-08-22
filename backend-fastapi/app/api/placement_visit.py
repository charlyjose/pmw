from typing import List

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
        print("User is not a tutor")
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
        print(geo_location_for_user)
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
        print("User is not a tutor")
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
    placement_ids: List[str], start_location: StartLocation, unit: str = Unit.KM, tutor_id: str = Depends(pyJWTDecodedUserId())
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
    route_plan = get_route_plan(placement_visit_locations, unit=unit, recommendations=True)
    json_compatiable_route_plan = jsonable_encoder(route_plan)
    message = "Route plan created"
    data = {"route_plan": json_compatiable_route_plan}
    return default_response(http_status=http_status.HTTP_200_OK, action_status=action_status.NO_ERROR, message=message, data=data)


# Confirm placement visit
# Takes: Route plan, visitDate, visit date
@router.post("/tutor/placement/visit/route-plan/confirm", summary="Confirm placement visit", tags=["placement_visit"])
async def confirm_placement_visit(visit_plan: VisitPlan, tutor_id: str = Depends(pyJWTDecodedUserId())):
    if not tutor_id:
        return user_not_found_response()

    

    message = "Placement visit confirmed"
    return default_response(http_status=http_status.HTTP_200_OK, action_status=action_status.NO_ERROR, message=message)
