from fastapi import Depends, FastAPI, Request
from fastapi import status as http_status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from app.api import api
from app.api.models import action_status
from app.dependencies import use_logging
from app.middleware import LoggingMiddleware
from app.pnp_helpers.client_response import json_response
from app.prisma import prisma
from app.utils.exceptions import PMWHTTPException
from app.utils.reponse import ClientResponse

app = FastAPI()


# Global Validation Exception Handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    message = "Invalid input(s)\n {0}".format(exc.errors())
    response = json_response(
        http_status=http_status.HTTP_422_UNPROCESSABLE_ENTITY, action_status=action_status.VALIDATION_ERROR, message=message
    )
    return ClientResponse(**response)()


# TODO: Need to have a more specific exception handler for JWTError
# Global HTTP Exception Handler
@app.exception_handler(PMWHTTPException)
async def pmw_http_exception_handler(request: Request, exc: PMWHTTPException):
    message = exc.message
    response = json_response(http_status=http_status.HTTP_403_FORBIDDEN, action_status=action_status.FORBIDDEN, message=message)
    return ClientResponse(**response)()


origins = ["*", "localhost", "http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"]

app.add_middleware(LoggingMiddleware, fastapi=app)
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(api, prefix="/api")


@app.get("/")
async def root(logger=Depends(use_logging)):
    logger.info("Handling your request")
    return {"message": "App is working!"}


@app.on_event("startup")
async def startup() -> None:
    await prisma.connect()
    print("START UP: Connected to database")


@app.on_event("shutdown")
async def shutdown() -> None:
    if prisma.is_connected():
        await prisma.disconnect()
        print("SHUTDOWN: Disconnected from database")
