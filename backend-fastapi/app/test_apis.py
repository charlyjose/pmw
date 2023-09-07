import asyncio
import json
from unittest.mock import MagicMock

import pytest
from fastapi import status as http_status
from fastapi.responses import JSONResponse

from app.api.models import action_status
from app.api.models.auth import SignIn, UserInDB
from app.api.models.user import CleanedUserData
from app.api.routers import auth as auth_router
from app.api.routers import users as user_router
from app.utils import auth as auth_util
from app.utils.db import user as user_db


def async_return(result):
    f = asyncio.Future()
    f.set_result(result)
    return f


# Test signin
@pytest.mark.asyncio
async def test_signin():
    test_id = "123"
    test_email = "test@email.com"
    test_password = "123"
    test_hashedPassword = auth_util.encryptPassword(test_password)

    sign_in_data = SignIn(email=test_email, password=test_password)

    user = UserInDB(
        id=test_id,
        firstName="John",
        lastName="Doe",
        name="John Doe",
        email=test_email,
        hashedPassword=test_hashedPassword,
        role="STUDENT",
        department="SCMS",
        studentStatus="ON_PLACEMENT",
        studentLevel="UNDERGRADUATE",
        status="ACTIVE",
    )

    # Mock the await user_db.get_user_by_email function
    user_db.get_user_by_email = MagicMock(return_value=async_return(user))

    # Mock auth_util.validatePassword function
    auth_util.validatePassword = MagicMock(return_value=True)

    # Mock auth_util.encodeJWT function
    test_token = auth_util.encodeJWT(user.id)
    auth_util.encodeJWT = MagicMock(return_value=test_token)

    resp: JSONResponse = await auth_router.signin(sign_in_data)

    # Decode response body
    resp_body = resp.body.decode("utf-8").replace("'", '"')
    resp_body_json = json.loads(resp_body)

    # Test Status Code
    assert resp.status_code == http_status.HTTP_200_OK

    # Test Response Body
    assert resp_body_json["message"] == "User signed in"
    assert resp_body_json["action_status"] == action_status.NO_ERROR
    assert resp_body_json["data"]["token"] == test_token


# Test to get all user data: Admin only
@pytest.mark.asyncio
async def test_get_all_user_data():
    test_id = "123"
    test_email = "test@email.com"
    test_password = "123"
    test_hashedPassword = auth_util.encryptPassword(test_password)

    test_admin_user = UserInDB(
        id=test_id,
        firstName="John",
        lastName="Doe",
        name="John Doe",
        email=test_email,
        hashedPassword=test_hashedPassword,
        role="STUDENT",
        department="SCMS",
        studentStatus="ON_PLACEMENT",
        studentLevel="UNDERGRADUATE",
        status="ACTIVE",
    )

    cleaned_user_data = CleanedUserData(**test_admin_user.__dict__).dict()

    # Mock validate_user_role function
    auth_router.validate_user_role = MagicMock(return_value=async_return(True))

    # Mock the await user_db.get_all_users function
    user_db.get_all_users = MagicMock(return_value=async_return([test_admin_user]))

    resp: JSONResponse = await user_router.get_all_user_data(test_id)

    # Decode response body
    resp_body = resp.body.decode("utf-8").replace("'", '"')
    resp_body_json = json.loads(resp_body)

    # Test Status Code
    assert resp.status_code == http_status.HTTP_200_OK
    # Test Response Body
    assert resp_body_json["message"] == "Users data"
    assert resp_body_json["action_status"] == action_status.DATA_FETCHED
    assert resp_body_json["data"] == {"users": [cleaned_user_data]}


# Test to get all user data: Admin only
# Testing for unauthorised user
@pytest.mark.asyncio
async def test_get_all_user_data_unauthorised_user():
    test_id = "123"

    # Mock validate_user_role function
    auth_router.validate_user_role = MagicMock(return_value=async_return(False))

    resp: JSONResponse = await user_router.get_all_user_data(test_id)

    # Decode response body
    resp_body = resp.body.decode("utf-8").replace("'", '"')
    resp_body_json = json.loads(resp_body)

    # Test Status Code
    assert resp.status_code == http_status.HTTP_403_FORBIDDEN

    # Test Response Body
    assert resp_body_json["message"] == "No valid previlages to access users data"
    assert resp_body_json["action_status"] == action_status.UNAUTHORIZED
    assert resp_body_json["data"] == None  # noqa: E711
