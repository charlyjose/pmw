from fastapi import APIRouter, Depends
from fastapi import status as http_status
from prisma.models import User

import app.pnp_helpers.user as user_pnp_helpers
from app.api.auth import ValidateUserRole
from app.api.models import action_status
from app.api.models.auth import Role as UserRole
from app.api.models.user import CleanedUserData
from app.pnp_helpers.client_response import json_response
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
async def get_all_user_data(user_id=Depends(pyJWTDecodedUserId())):
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

    # No previlages to access this content
    message = "No previlages to access this content"
    response = json_response(http_status=http_status.HTTP_403_FORBIDDEN, action_status=action_status.UNAUTHORIZED, message=message)
    return ClientResponse(**response)()


# Get own data
@router.get("/users/me", summary="Get own user data", tags=["users"])
async def get_own_user_data(user_id=Depends(pyJWTDecodedUserId())):
    if user_id:
        user = await GetUserData(user_id)()
        user = CleanedUserData(**user.__dict__) if user else None

        message = "User data"
        response = json_response(http_status=http_status.HTTP_200_OK, action_status=action_status.NO_ERROR, message=message, data=user)

        print(response)

        return ClientResponse(**response)()

    # User not found
    return user_pnp_helpers.user_not_found()
