from unittest.mock import MagicMock
from app.api.routers.auth import signin
import pytest
import asyncio
from app.api.models.auth import SignIn, UserInDB
from app.utils.db import user as user_db
from app.utils import auth as auth_util


@pytest.mark.asyncio
async def test_signin():
    sign_in_data = SignIn(email="test@email.com", password="123")

    def async_return(result):
        f = asyncio.Future()
        f.set_result(result)
        return f

    user = UserInDB(
        id="123",
        firstName="John",
        lastName="Doe",
        name="John Doe",
        email="test@email.com",
        hashedPassword="123",
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
    test_token = "123"
    auth_util.encodeJWT = MagicMock(return_value=test_token)

    resp = await signin(sign_in_data)

    resp_body = resp.body.decode("utf-8")
    resp_body = eval(resp_body)

    assert resp.status_code == 200
    assert resp_body["data"]["token"] == test_token
