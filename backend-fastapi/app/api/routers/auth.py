from typing import List

import prisma.errors as PrismaErrors
from fastapi import APIRouter
from fastapi import status as http_status

from app.api.models import action_status
from app.api.models.auth import SignIn, SignUpForm, SignUpUserInDB
from app.api.models.response import JSONResponseModel
from app.api.models.user import CleanedUserData
from app.pnp_helpers.json_response_wrapper import default_response
from app.utils import auth as auth_util
from app.utils.db import user as user_db

router = APIRouter()


# Validate user role
class ValidateUserRole:
    def __init__(self, user_id: str, roles: List[str]):
        self.user_id = user_id
        self.roles = roles

    async def __call__(self) -> bool:
        user = await user_db.check_user_role(self.user_id, self.roles)
        if user:
            return True
        return False


async def validate_user_role(user_id: str, roles: List[str]):
    user = await user_db.check_user_role(user_id, roles)
    if user:
        return True
    return False


@router.post("/auth/signup", summary="Create new user", tags=["auth"], response_model=JSONResponseModel)
async def signup(signupForm: SignUpForm) -> JSONResponseModel:
    hashedPassword = auth_util.encryptPassword(signupForm.password)
    signupUser = {**signupForm.dict(), "hashedPassword": hashedPassword}
    newUserData = SignUpUserInDB(**signupUser)

    try:
        user = await user_db.create_new_user(newUserData.dict())
        user = CleanedUserData(**user.__dict__).dict()
        return default_response(
            http_status=http_status.HTTP_201_CREATED, action_status=action_status.NO_ERROR, message="User created", data=user
        )

    except PrismaErrors.UniqueViolationError:
        message = "Email already exists"
        return default_response(http_status=http_status.HTTP_400_BAD_REQUEST, action_status=action_status.DUPLICATE_KEY, message=message)

    except Exception:
        message = "Something went wrong"
        return default_response(http_status=http_status.HTTP_400_BAD_REQUEST, action_status=action_status.UNKNOWN_ERROR, message=message)


@router.post("/auth/token", summary="Create access token for user", tags=["auth"], response_model=JSONResponseModel)
async def signin(signIn: SignIn) -> JSONResponseModel:
    # Check user exists
    user = await user_db.get_user_by_email(signIn.email)
    if not user:
        message = "Incorrect email or password"
        return default_response(http_status=http_status.HTTP_401_UNAUTHORIZED, action_status=action_status.UNAUTHORIZED, message=message)

    # Validate password
    validated = auth_util.validatePassword(signIn.password, user.hashedPassword)
    if validated:
        # Create JWT token
        token = auth_util.encodeJWT(sub=user.id)
        message = "User signed in"
        return default_response(
            http_status=http_status.HTTP_200_OK, action_status=action_status.NO_ERROR, message=message, data={"token": token}
        )

    # Incorrect password
    message = "Incorrect email or password"
    return default_response(http_status=http_status.HTTP_401_UNAUTHORIZED, action_status=action_status.UNAUTHORIZED, message=message)
