from fastapi import APIRouter, Depends
from fastapi import status as http_status
from prisma.models import User

from app.api.auth import ValidateUserRole
from app.api.models import action_status
from app.api.models.auth import Role as UserRole
from app.api.models.user import CleanedUserData
from app.pnp_helpers.auth import no_access_to_content_response
from app.pnp_helpers.client_response import json_response
from app.pnp_helpers.user import user_not_found_response
from app.utils.auth import pyJWTDecodedUserId
from app.utils.db import user as user_db
from app.utils.reponse import ClientResponse

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
async def get_all_user_data(user_id: str = Depends(pyJWTDecodedUserId())):
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

            print(user_list)

            message = "Users data"
            response = json_response(
                http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_FETCHED, message=message, data=user_list
            )

            print(response)

            return ClientResponse(**response)()

    return no_access_to_content_response(message="No valid previlages to access users data")


# Get own data
@router.get("/users/me", summary="Get own user data", tags=["users"])
async def get_own_user_data(user_id: str = Depends(pyJWTDecodedUserId())):
    if user_id:
        user = await user_db.get_user_by_id(user_id)
        if user:
            user = CleanedUserData(**user.__dict__) if user else None
            message = "User data"
            response = json_response(http_status=http_status.HTTP_200_OK, action_status=action_status.NO_ERROR, message=message, data=user)
            return ClientResponse(**response)()

    # User not found
    return user_not_found_response()


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
async def chech_user_email_exists(email: str):
    user_email_exists = await CheckUserEmail(email)()

    if user_email_exists:
        message = "User email exists"
        data = {"exists": True}
        response = json_response(http_status=http_status.HTTP_200_OK, action_status=action_status.NO_ERROR, message=message, data=data)
        return ClientResponse(**response)()
    else:
        message = "User email does not exist"
        data = {"exists": False}
        response = json_response(http_status=http_status.HTTP_200_OK, action_status=action_status.NO_ERROR, message=message, data=data)
        return ClientResponse(**response)()
