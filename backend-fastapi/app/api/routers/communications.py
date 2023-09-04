from fastapi import APIRouter, Depends
from fastapi import status as http_status

from app.api.models import action_status
from app.api.models.auth import Role as UserRole
from app.api.models.response import JSONResponseModel
from app.api.routers.auth import ValidateUserRole
from app.pnp_helpers.auth import no_access_to_content_response
from app.pnp_helpers.json_response_wrapper import default_response
from app.pnp_helpers.user import user_not_found_response
from app.utils.auth import pyJWTDecodedUserId
from app.utils.db import placement_tutor as placement_tutor_db
from app.utils.db import user as user_db

router = APIRouter()


# Get a student's placement tutor email Id based on student department
@router.get(
    "/communications/student/tutorEmailId",
    summary="Get placement tutor email Id for student",
    tags=["communications"],
    response_model=JSONResponseModel,
)
async def get_placement_tutor_email_id(user_id: str = Depends(pyJWTDecodedUserId())) -> JSONResponseModel:
    if not user_id and not await ValidateUserRole(user_id, [UserRole.STUDENT.value])():
        return no_access_to_content_response()

    try:
        # Get student department
        student = await user_db.get_user_by_id(user_id)

        if not student:
            return user_not_found_response()

        # Get placement tutor details from the PlacementTutor table by department
        tutor_id = await placement_tutor_db.get_placement_tutor_id_by_department(student.department)

        # Get placement tutor email Id
        placement_tutor = await user_db.get_user_by_id(tutor_id)

        # Return placement tutor email Id
        message = "Placement tutor email Id retrieved"
        data = {"recipientEmailId": placement_tutor.email}
        return default_response(http_status=http_status.HTTP_200_OK, action_status=action_status.NO_ERROR, message=message, data=data)

    except Exception:
        message = "Something went wrong"
        return default_response(http_status=http_status.HTTP_400_BAD_REQUEST, action_status=action_status.UNKNOWN_ERROR, message=message)
