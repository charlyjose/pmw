from fastapi import APIRouter

from app.api.routers.appointments import router as appointmentsRouter
from app.api.routers.auth import router as authRouter
from app.api.routers.communications import router as communicationsRouter
from app.api.routers.home import router as homeRouter
from app.api.routers.job_application import router as jobApplicationRouter
from app.api.routers.jobs import router as jobsRouter
from app.api.routers.notifications import router as notificationsRouter
from app.api.routers.placement_application import router as placementApplicationRouter
from app.api.routers.placement_declaration import router as placementDeclarationRouter
from app.api.routers.placement_reports import router as placementReportsRouter
from app.api.routers.placement_tutor import router as placementTutorRouter
from app.api.routers.placement_visit import router as placementVisitRouter
from app.api.routers.users import router as usersRouter

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
api.include_router(communicationsRouter)
api.include_router(placementTutorRouter)

__all__ = ["api"]
