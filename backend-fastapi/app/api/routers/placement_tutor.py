from fastapi import APIRouter, Depends
from fastapi import status as http_status
from fastapi.encoders import jsonable_encoder

from app.api.models import action_status
from app.api.models.auth import Department
from app.api.models.auth import Role as UserRole
from app.api.models.placement_tutor import TutorForAdmin, TutorListForAdmin
from app.api.models.response import JSONResponseModel
from app.api.models.tutor import PlacementTutor
from app.api.routers.auth import ValidateUserRole
from app.pnp_helpers.auth import no_access_to_content_response
from app.pnp_helpers.json_response_wrapper import default_response
from app.pnp_helpers.user import user_not_found_response
from app.utils.auth import pyJWTDecodedUserId
from app.utils.db import placement_tutor as placement_tutor_db
from app.utils.db import user as user_db

router = APIRouter()


# Router to get all tutors and placement tutors categorised by department
@router.get("/tutors", summary="Get all placement tutors categorised by department", tags=["tutors"])
async def get_all_placement_tutors(user_id: str = Depends(pyJWTDecodedUserId())) -> JSONResponseModel:
    # Only Admins can access this route
    if not user_id and not await ValidateUserRole(user_id, UserRole.ADMIN):
        return no_access_to_content_response()

    # Get all departments
    departments = [department.value for department in Department]
    # Get all tutors from users by department list
    tutors = await user_db.get_all_tutors_by_department_list(departments)
    # Get all placement tutors sorted by department
    placement_tutors = await placement_tutor_db.get_all_placement_tutors_by_department_list(departments)

    tutors_for_admin = []
    for department in departments:
        # Get all tutors by department from tutors but skip if the tutor department is either "CSD" or "ADMIN"
        if department == UserRole.CSD or department == UserRole.ADMIN:
            continue
        tutors_for_department = [tutor for tutor in tutors if tutor.department == department]
        tutors_for_admin.append(
            TutorListForAdmin(
                department=department,
                tutor=[
                    TutorForAdmin(
                        id=tutor.id,
                        department=tutor.department,
                        firstName=tutor.firstName,
                        lastName=tutor.lastName,
                        name=tutor.name,
                        email=tutor.email,
                        placement_tutor=True if tutor.id in [placement_tutor.userId for placement_tutor in placement_tutors] else False,
                        updatedAt=tutor.updatedAt,
                    )
                    for tutor in tutors_for_department
                ],
            )
        )

    data = {"departments": []}
    json_compatible_tutors = jsonable_encoder(tutors_for_admin)
    data["departments"] = json_compatible_tutors

    message = "Tutors details fetched"
    return default_response(http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_FETCHED, message=message, data=data)


# Promote a tutor to placement tutor
@router.post("/tutor/promote", summary="Promote a tutor to placement tutor", tags=["tutors"])
async def promote_tutor_to_placement_tutor(
    id: str, department: Department, user_id: str = Depends(pyJWTDecodedUserId())
) -> JSONResponseModel:
    if not user_id and not await ValidateUserRole(user_id, UserRole.ADMIN):
        return no_access_to_content_response()

    # Check if the user id exists and fall in the department and is a tutor
    tutor = await user_db.check_if_user_id_and_department_is_a_valid_tutor(id, department)
    if not tutor:
        return user_not_found_response()

    # Check if the user is already a placement tutor
    placement_tutor_exists = await placement_tutor_db.get_user_id_by_placement_tutor_id_and_department(id, department)

    if placement_tutor_exists:
        return default_response(
            http_status=http_status.HTTP_400_BAD_REQUEST, action_status=action_status.ERROR, message="User is already a placement tutor"
        )

    # Check for tutors in the same department in the placement tutor table
    placement_tutor = await placement_tutor_db.get_placement_tutor_by_department(department)
    if placement_tutor:
        return default_response(
            http_status=http_status.HTTP_400_BAD_REQUEST,
            action_status=action_status.ERROR,
            message="Placement tutor already exists for this department",
        )

    # Create a new placement tutor
    placement_tutor = PlacementTutor(userId=id, department=department)
    new_placement_tutor = await placement_tutor_db.create_new_placement_tutor(placement_tutor.dict())

    if not new_placement_tutor:
        return default_response(
            http_status=http_status.HTTP_400_BAD_REQUEST,
            action_status=action_status.ERROR,
            message="Unable to promote tutor to placement tutor",
        )

    message = "Tutor promoted to placement tutor"
    return default_response(http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_CREATED, message=message)
