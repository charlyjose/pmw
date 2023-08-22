from fastapi import APIRouter, Depends
from fastapi import status as http_status
from fastapi.encoders import jsonable_encoder

from app.api.auth import ValidateUserRole
from app.api.models import action_status
from app.api.models.auth import Role as UserRole
from app.api.models.auth import StudentStatus as student_status
from app.api.models.coordinate import Coordinate
from app.api.models.placement_students import CleanedPlacementStudent, PlacementStudentForm, PlacementStudentInDB
from app.api.models.placement_visit import PlacementVisitRegion as regions
from app.pnp_helpers.auth import no_access_to_content_response
from app.pnp_helpers.json_response_wrapper import default_response
from app.pnp_helpers.user import user_not_found_response
from app.utils.auth import pyJWTDecodedUserId
from app.utils.db import placement_tutor as placement_tutor_db
from app.utils.db import placement_visit as placement_visit_db
from app.utils.db import user as user_db
from app.utils.region_mapper import get_region

router = APIRouter()


async def read_placement_application(placement_start_form: PlacementStudentForm) -> PlacementStudentForm:
    return placement_start_form


@router.post("/student/placement/declaration", summary="Placement start declaration", tags=["placement_application"])
async def add_placement_declaration(
    user_id: str = Depends(pyJWTDecodedUserId()), placement_start_form: PlacementStudentForm = Depends(read_placement_application)
):
    if user_id:
        roles = [UserRole.STUDENT]
        valid_user_role = await ValidateUserRole(user_id, roles)()
        if not valid_user_role:
            return no_access_to_content_response()

        # Get user department
        department = await user_db.get_user_department(user_id)
        tutor_id = await placement_tutor_db.get_placement_tutor_id_by_department(department)
        if not tutor_id:
            return default_response(http_status.HTTP_404_NOT_FOUND, action_status.ERROR, "Placement tutor not found")

        coordinate = Coordinate(longitude=placement_start_form.longitude, latitude=placement_start_form.latitude)
        region = get_region(coordinate)

        if not region:
            region = regions.INTERNATIONAL

        region = regions(region.upper())

        placement_start_form = PlacementStudentInDB(**placement_start_form.dict(), userId=user_id, tutorId=tutor_id, region=region)
        old_form = await placement_visit_db.get_placement_data_for_a_student(user_id)
        if old_form:
            form_id = old_form.id
            await placement_visit_db.update_application(form_id, placement_start_form.dict())
        else:
            await placement_visit_db.create_new_application(placement_start_form.dict())

        # Update student status in User table
        status = student_status.ON_PLACEMENT
        await user_db.update_user_status(user_id, status)
        return default_response(http_status.HTTP_200_OK, action_status.DATA_UPDATED, "Placement declaration updated")

    else:
        return user_not_found_response()


# Chaeck if the user has already submitted the placement declaration
@router.get("/student/placement/declaration", summary="Placement start declaration", tags=["placement_application"])
async def get_placement_declaration(user_id: str = Depends(pyJWTDecodedUserId())):
    if user_id:
        roles = [UserRole.STUDENT]
        valid_user_role = await ValidateUserRole(user_id, roles)()
        if not valid_user_role:
            return no_access_to_content_response()

        # Get user department
        department = await user_db.get_user_department(user_id)
        tutor_id = await placement_tutor_db.get_placement_tutor_id_by_department(department)
        if not tutor_id:
            return default_response(http_status.HTTP_404_NOT_FOUND, action_status.ERROR, "Placement tutor not found")

        placement_start_form = await placement_visit_db.get_placement_data_for_a_student(user_id)
        cleaned_applications = []
        if placement_start_form:
            cleaned_placement_start_form = CleanedPlacementStudent(**placement_start_form.dict())
            json_compatible_cleaned_application = jsonable_encoder(cleaned_placement_start_form)
            cleaned_applications.append(json_compatible_cleaned_application)

            data = {"placement_declaration": cleaned_applications}
            return default_response(
                http_status=http_status.HTTP_200_OK,
                action_status=action_status.DATA_FETCHED,
                message="Placement declaration fetched",
                data=data,
            )
        else:
            data = {"placement_declaration": []}
            return default_response(
                http_status=http_status.HTTP_200_OK,
                action_status=action_status.DATA_NOT_FOUND,
                message="Placement declaration not found",
                data=data,
            )

    else:
        return user_not_found_response()
