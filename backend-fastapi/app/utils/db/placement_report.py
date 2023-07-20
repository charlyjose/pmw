from typing import List, Optional

from prisma.models import PlacementReport

from app.prisma import prisma


async def create_new_report(report: dict) -> Optional[PlacementReport]:
    return await prisma.placementreport.create(report)


async def get_report_by_month(ownerId: str, month: str) -> Optional[PlacementReport]:
    return await prisma.placementreport.find_first(where={"ownerId": ownerId, "month": month})


# Get all placement reports for a given user
async def get_all_reports_by_user_id(ownerId: str) -> List[PlacementReport]:
    return await prisma.placementreport.find_many(where={"ownerId": ownerId})


# Get a report by its id
async def get_report_by_id(reportId: str) -> Optional[PlacementReport]:
    return await prisma.placementreport.find_unique(where={"id": reportId})
