from typing import List

from fastapi import APIRouter, Depends
from fastapi import status as http_status
from prisma.models import User

from app.api.auth import ValidateUserRole
from app.api.models import action_status
from app.api.models.auth import Role as UserRole
from app.api.models.response import ResponseModelContent
from app.api.models.user import CleanedUserData
from app.prisma import prisma
from app.utils.auth import pyJWTDecodedUserId
from app.utils.reponse import createJSONResponse

router = APIRouter()


# Validate user existence
class GetUserData:
    def __init__(self, user_id: str):
        self.user_id = user_id

    # Check if user exists in database
    async def __call__(self) -> User:
        user = await prisma.user.find_unique(where={"id": self.user_id})
        if user:
            return user
        return None


# Get all users data: Admin only
@router.get("/users/", summary="Get all users data. Admin previlages required", tags=["users"])
async def get_all_user_data(user_id=Depends(pyJWTDecodedUserId())):
    if user_id:
        # validate user is ADMIN
        role = UserRole.ADMIN
        valid_user_role = await ValidateUserRole(user_id, role)()
        if valid_user_role:
            users = await prisma.user.find_many()
            user_list: List[User] = []
            for user in users:
                user_list.append(CleanedUserData(**user.__dict__))

            message = "Users data"
            return createJSONResponse(
                status_code=http_status.HTTP_200_OK,
                content=ResponseModelContent(error=action_status.NO_ERROR, message=message, data=user_list),
            )

    # No previlages to access this content
    message = "No previlages to access this content"
    return createJSONResponse(
        status_code=http_status.HTTP_403_FORBIDDEN, content=ResponseModelContent(error=action_status.UNAUTHORIZED, message=message)
    )


# Get own data
@router.get("/users/me", summary="Get own user data", tags=["users"])
async def get_own_user_data(user_id=Depends(pyJWTDecodedUserId())):
    if user_id:
        user = await GetUserData(user_id)()
        user = CleanedUserData(**user.__dict__) if user else None

        message = "User data"
        return createJSONResponse(
            status_code=http_status.HTTP_200_OK, content=ResponseModelContent(error=action_status.NO_ERROR, message=message, data=user)
        )

    # User not found
    message = "User not found"
    return createJSONResponse(
        status_code=http_status.HTTP_204_NO_CONTENT, content=ResponseModelContent(error=action_status.DATA_NOT_FOUND, message=message)
    )


# # Get all users data: Admin only
# @router.get("/users/", summary="Get all users data. Admin previlages required", tags=["users"])
# async def get_all_user_data(jwt_payload=Depends(JWTBearer())):
#     user_id = await pyJWTDecodedUserId(jwt_payload)()

#     if user_id:
#         # validate user is ADMIN
#         role = UserRole.ADMIN
#         valid_user_role = await ValidateUserRole(user_id, role)()
#         if valid_user_role:
#             users = await prisma.user.find_many()
#             user_list: List[User] = []
#             for user in users:
#                 user_list.append(CleanedUserData(**user.__dict__))

#             message = "Users data"
#             return createJSONResponse(
#                 status_code=http_status.HTTP_200_OK,
#                 content=ResponseModelContent(error=action_status.NO_ERROR, message=message, data=user_list),
#             )

#     # No previlages to access this content
#     message = "No previlages to access this content"
#     return createJSONResponse(
#         status_code=http_status.HTTP_403_FORBIDDEN, content=ResponseModelContent(error=action_status.UNAUTHORIZED, message=message)
#     )


# # Get own data
# @router.get("/users/me", summary="Get own user data", tags=["users"])
# async def get_own_user_data(jwt_payload=Depends(JWTBearer())):
#     user_id = await pyJWTDecodedUserId(jwt_payload)()

#     if user_id:
#         user = await GetUserData(user_id)()
#         user = CleanedUserData(**user.__dict__)
#         return user
#     return None
