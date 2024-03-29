from fastapi import Depends, FastAPI, Request
from fastapi import status as http_status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from app.api.models import action_status
from app.api.routers import api
from app.dependencies import use_logging
from app.middleware import LoggingMiddleware
from app.pnp_helpers.json_response_wrapper import default_response
from app.prisma import prisma
from app.utils.exceptions import PMWHTTPException

app = FastAPI()


# Global Validation Exception Handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    message = "Invalid input(s): {0}".format(exc.errors())
    return default_response(
        http_status=http_status.HTTP_422_UNPROCESSABLE_ENTITY, action_status=action_status.VALIDATION_ERROR, message=message
    )


# Global HTTP Exception Handler
@app.exception_handler(PMWHTTPException)
async def pmw_http_exception_handler(request: Request, exc: PMWHTTPException):
    message = exc.message
    return default_response(http_status=http_status.HTTP_403_FORBIDDEN, action_status=action_status.FORBIDDEN, message=message)


# CORS Middleware Configuration
origins = ["*"]

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
