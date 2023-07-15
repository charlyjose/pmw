from typing import Optional

from prisma.models import User

from app.prisma import prisma


async def get_user_by_email(email: str) -> Optional[User]:
    user = await prisma.user.find_unique(where={"email": email})
    return user if user else None


async def create_new_user(newUserData: dict) -> Optional[User]:
    return await prisma.user.create(newUserData)


async def check_user_role(user_id: str, role: str) -> bool:
    user = await prisma.user.find_first(where={"id": user_id, "role": role})
    if user:
        return True
    return False


async def get_user_by_id(user_id: str) -> Optional[User]:
    user = await prisma.user.find_unique(where={"id": user_id})
    return user if user else None


async def get_all_users() -> list:
    return await prisma.user.find_many()
