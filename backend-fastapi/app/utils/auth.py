import os
from datetime import datetime, timedelta, timezone
from typing import Union

from dotenv import load_dotenv
from fastapi import Request
from fastapi import status as http_status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel

from app.utils.exceptions import PMWHTTPException

load_dotenv()
ACCESS_TOKEN_EXPIRE_SECONDS = float(os.getenv("ACCESS_TOKEN_EXPIRE_SECONDS"))
TOKEN_TYPE = os.getenv("TOKEN_TYPE")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ISSUER = os.getenv("JWT_ISSUER")

# ACCESS_TOKEN_EXPIRE_SECONDS = float(os.environ.get("ACCESS_TOKEN_EXPIRE_SECONDS"))
# TOKEN_TYPE = os.environ.get("TOKEN_TYPE")
# JWT_ALGORITHM = os.environ.get("JWT_ALGORITHM")
# JWT_SECRET = os.environ.get("JWT_SECRET")
# JWT_ISSUER = os.environ.get("JWT_ISSUER")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class JWTPayload(BaseModel):
    sub: str = None
    exp: datetime = None
    iat: datetime = None
    nbf: datetime = None
    iss: str = None

    def to_dict(self):
        return self.__dict__


class Token(BaseModel):
    access_token: str = None
    token_type: str = None
    expires_in: int = None
    expires_at: int = None


class JWTEncoder(BaseModel):
    payload: JWTPayload = None
    secret: str = None
    algorithm: str = None

    def encode(self):
        return jwt.encode(self.payload.to_dict(), self.secret, self.algorithm)


class JWTDecoder(BaseModel):
    token: str = None
    secret: str = None
    algorithm: str = None

    def decode(self):
        return jwt.decode(self.token, self.secret, algorithms=[self.algorithm])


def encodeJWT(sub: str) -> Token:
    expires = datetime.now(tz=timezone.utc) + timedelta(seconds=ACCESS_TOKEN_EXPIRE_SECONDS)
    payload = JWTPayload(sub=sub, exp=expires, iat=datetime.now(tz=timezone.utc), nbf=datetime.now(tz=timezone.utc), iss=JWT_ISSUER)
    token = Token(
        access_token=JWTEncoder(payload=payload, secret=JWT_SECRET, algorithm=JWT_ALGORITHM).encode(),
        token_type=TOKEN_TYPE,
        expires_in=ACCESS_TOKEN_EXPIRE_SECONDS,
        # Calculate the expiration time of the token in epoch time : MATH: current time + expiration time in seconds
        expires_at=int((datetime.now(tz=timezone.utc) + timedelta(seconds=ACCESS_TOKEN_EXPIRE_SECONDS)).timestamp()),
    )
    return token


def decodeJWT(token: str) -> JWTPayload:
    try:
        decoded = JWTDecoder(token=token, secret=JWT_SECRET, algorithm=JWT_ALGORITHM).decode()
        payload = JWTPayload(**decoded)
        return payload
    except JWTError:
        raise JWTError


class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request) -> Union[bool, JWTPayload]:
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise PMWHTTPException(status_code=http_status.HTTP_403_FORBIDDEN, message="Invalid authentication scheme")
            verified_jwt = self.verify_jwt(credentials.credentials)
            if not verified_jwt:
                raise PMWHTTPException(status_code=http_status.HTTP_403_FORBIDDEN, message="Invalid token or expired token")
            return verified_jwt
        else:
            raise PMWHTTPException(status_code=http_status.HTTP_403_FORBIDDEN, message="Invalid authorization code")

    def verify_jwt(self, jwtToken: str) -> Union[bool, JWTPayload]:
        payload: Union[bool, JWTPayload] = False

        try:
            payload = decodeJWT(jwtToken)
        except Exception:
            payload = None
        return payload


class pyJWTDecodedUserId(JWTBearer):
    def __init__(self, auto_error: bool = True):
        super(pyJWTDecodedUserId, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request) -> str:
        try:
            pyJWTdecoded: Union[bool, JWTPayload] = await super(pyJWTDecodedUserId, self).__call__(request)
            user_id = pyJWTdecoded.sub
            return user_id
        except Exception:
            raise PMWHTTPException(status_code=http_status.HTTP_403_FORBIDDEN, message="User not authenticated")


def encryptPassword(password: str) -> str:
    return pwd_context.hash(password)


def validatePassword(password: str, encrypted: str) -> str:
    return pwd_context.verify(password, encrypted)
