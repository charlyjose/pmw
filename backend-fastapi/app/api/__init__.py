from fastapi import APIRouter

from app.api.appointments import router as appointmentsRouter
from app.api.auth import router as authRouter
from app.api.jobs import router as jobsRouter
from app.api.placement_reports import router as placementReportsRouter
from app.api.users import router as usersRouter
from app.api.placement_application import router as placementApplicationRouter

api = APIRouter()
api.include_router(authRouter)
api.include_router(usersRouter)
api.include_router(appointmentsRouter)
api.include_router(placementReportsRouter)
api.include_router(jobsRouter)
api.include_router(placementApplicationRouter)

__all__ = ["api"]
