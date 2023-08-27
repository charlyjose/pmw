from fastapi import APIRouter

from app.api.appointments import router as appointmentsRouter
from app.api.auth import router as authRouter
from app.api.home import router as homeRouter
from app.api.job_application import router as jobApplicationRouter
from app.api.jobs import router as jobsRouter
from app.api.notifications import router as notificationsRouter
from app.api.placement_application import router as placementApplicationRouter
from app.api.placement_declaration import router as placementDeclarationRouter
from app.api.placement_reports import router as placementReportsRouter
from app.api.placement_visit import router as placementVisitRouter
from app.api.users import router as usersRouter

api = APIRouter()
api.include_router(homeRouter)
api.include_router(authRouter)
api.include_router(usersRouter)
api.include_router(appointmentsRouter)
api.include_router(placementReportsRouter)
api.include_router(jobsRouter)
api.include_router(placementApplicationRouter)
api.include_router(placementVisitRouter)
api.include_router(jobApplicationRouter)
api.include_router(placementDeclarationRouter)
api.include_router(notificationsRouter)


__all__ = ["api"]
