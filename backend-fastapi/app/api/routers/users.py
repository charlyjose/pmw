from fastapi import APIRouter, Depends
from fastapi import status as http_status
from prisma.models import User

from app.api.models import action_status
from app.api.models.auth import Role as UserRole
from app.api.models.response import JSONResponseModel
from app.api.models.user import CleanedUserData
from app.api.routers.auth import ValidateUserRole
from app.pnp_helpers.auth import no_access_to_content_response
from app.pnp_helpers.json_response_wrapper import default_response
from app.pnp_helpers.user import user_not_found_response
from app.utils.auth import pyJWTDecodedUserId
from app.utils.db import user as user_db

router = APIRouter()


# Validate user existence
class GetUserData:
    def __init__(self, user_id: str):
        self.user_id = user_id

    # Check if user exists in database
    async def __call__(self) -> User:
        user = await user_db.get_user_by_id(self.user_id)
        if user:
            return user
        return None


# Get all users data: Admin only
@router.get("/users/", summary="Get all users data. Admin previlages required", tags=["users"])
async def get_all_user_data(user_id: str = Depends(pyJWTDecodedUserId())) -> JSONResponseModel:
    if user_id:
        # validate user is ADMIN
        roles = [UserRole.ADMIN]
        valid_user_role = await ValidateUserRole(user_id, roles)()
        if valid_user_role:
            users = await user_db.get_all_users()
            user_list = {"users": []}
            for user in users:
                cleaned_user_data = CleanedUserData(**user.dict()).dict()
                user_list["users"].append(cleaned_user_data)

            message = "Users data"
            return default_response(
                http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_FETCHED, message=message, data=user_list
            )

    return no_access_to_content_response(message="No valid previlages to access users data")


# Get own data
@router.get("/users/me", summary="Get own user data", tags=["users"])
async def get_own_user_data(user_id: str = Depends(pyJWTDecodedUserId())) -> JSONResponseModel:
    if not user_id:
        return user_not_found_response()

    user = await user_db.get_user_by_id(user_id)
    if not user:
        return user_not_found_response(message="User details not found")

    user = CleanedUserData(**user.__dict__) if user else None
    message = "User data"
    return default_response(http_status=http_status.HTTP_200_OK, action_status=action_status.NO_ERROR, message=message, data=user)


# Check if a user with the given email exists
class CheckUserEmail:
    def __init__(self, email: str):
        self.email = email

    # Check if user exists in database
    async def __call__(self) -> bool:
        user = await user_db.get_user_by_email(self.email)
        if user:
            return True
        return False


# Get user data by email
@router.get("/users/email/exists", summary="Check user email exists", tags=["users"])
async def check_user_email_exists(email: str, user_id: str = Depends(pyJWTDecodedUserId())) -> JSONResponseModel:
    if not user_id:
        return user_not_found_response()

    user_email_exists = await CheckUserEmail(email)()

    if not user_email_exists:
        message = "User email does not exist"
        data = {"exists": False}
        return default_response(http_status=http_status.HTTP_200_OK, action_status=action_status.NO_ERROR, message=message, data=data)

    message = "User email exists"
    data = {"exists": True}
    return default_response(http_status=http_status.HTTP_200_OK, action_status=action_status.NO_ERROR, message=message, data=data)
