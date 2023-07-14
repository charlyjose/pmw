from typing import Optional

import prisma.errors as PrismaErrors
from fastapi import APIRouter
from fastapi import status as http_status
from prisma.models import User

from app.api.models import action_status
from app.api.models.auth import SignIn, SignUpForm, SignUpUser
from app.api.models.response import JSONResponseModel, ResponseModelContent
from app.api.models.user import CleanedUserData
from app.prisma import prisma
from app.utils.auth import encodeJWT, encryptPassword, validatePassword
from app.utils.reponse import createJSONResponse

router = APIRouter()


# Validate user role
class ValidateUserRole:
    def __init__(self, user_id: str, role: str):
        self.user_id = user_id
        self.role = role

    async def __call__(self) -> bool:
        user = await prisma.user.find_first(where={"id": self.user_id, "role": self.role})
        if user:
            return True
        return False


async def create_new_user(newUserData: SignUpUser) -> JSONResponseModel:
    try:
        user = await prisma.user.create(newUserData.dict())
        user = CleanedUserData(**user.__dict__)
        message = "User created"
        return createJSONResponse(
            status_code=http_status.HTTP_201_CREATED,
            content=ResponseModelContent(error=action_status.NO_ERROR, message=message, data=user.dict()),
        )

    except PrismaErrors.UniqueViolationError:
        message = "Email already exists"
        return createJSONResponse(
            status_code=http_status.HTTP_400_BAD_REQUEST, content=ResponseModelContent(error=action_status.DUPLICATE_KEY, message=message)
        )
    except Exception:
        message = "Something went wrong"
        return createJSONResponse(
            status_code=http_status.HTTP_400_BAD_REQUEST, content=ResponseModelContent(error=action_status.UNKNOWN_ERROR, message=message)
        )


@router.post("/auth/signup", summary="Create new user", tags=["auth"], response_model=JSONResponseModel)
async def signup(signupForm: SignUpForm) -> JSONResponseModel:
    hashedPassword = encryptPassword(signupForm.password)
    signupUser = {**signupForm.dict(), "hashedPassword": hashedPassword}
    newUserData = SignUpUser(**signupUser)
    return await create_new_user(newUserData)


async def get_user_by_email(email: str) -> Optional[User]:
    user = await prisma.user.find_unique(where={"email": email})
    return user if user else None


async def check_user_is_active(email: str) -> bool:
    pass


@router.post("/auth/token", summary="Create access token for user", tags=["auth"], response_model=JSONResponseModel)
async def signin(signIn: SignIn) -> JSONResponseModel:
    # Check user exists
    user = await get_user_by_email(signIn.email)
    if not user:
        message = "Incorrect email or password"
        return createJSONResponse(
            status_code=http_status.HTTP_401_UNAUTHORIZED, content=ResponseModelContent(error=action_status.UNAUTHORIZED, message=message)
        )

    # TODO: Check if user is active
    # await check_user_is_active(signIn.email)

    # Validate password
    validated = validatePassword(signIn.password, user.hashedPassword)
    if validated:
        # Create JWT token
        token = encodeJWT(sub=user.id)

        message = "User signed in"
        return createJSONResponse(
            status_code=http_status.HTTP_200_OK,
            content=ResponseModelContent(error=action_status.NO_ERROR, message=message, data={"token": token}),
        )

    # Incorrect password
    message = "Incorrect email or password"
    return createJSONResponse(
        status_code=http_status.HTTP_401_UNAUTHORIZED, content=ResponseModelContent(error=action_status.UNAUTHORIZED, message=message)
    )
