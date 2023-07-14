from fastapi import APIRouter

from app.api.appointments import router as appointmentsRouter
from app.api.auth import router as authRouter
from app.api.users import router as usersRouter

api = APIRouter()
api.include_router(authRouter)
api.include_router(usersRouter)
api.include_router(appointmentsRouter)

__all__ = ["api"]
