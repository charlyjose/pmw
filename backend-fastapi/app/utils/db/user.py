from typing import List, Optional

from prisma.models import User

from app.prisma import prisma


async def get_user_by_email(email: str) -> Optional[User]:
    user = await prisma.user.find_unique(where={"email": email})
    return user if user else None


async def create_new_user(newUserData: dict) -> Optional[User]:
    return await prisma.user.create(newUserData)


async def check_user_role(user_id: str, roles: List[str]) -> bool:
    user = await prisma.user.find_first(where={"id": user_id, "role": {"in": roles}})
    if user:
        return True
    return False


# Get user role by user id
async def get_user_role(user_id: str) -> Optional[User]:
    user = await prisma.user.find_unique(where={"id": user_id})
    return user.role if user else None


async def get_user_by_id(user_id: str) -> Optional[User]:
    user = await prisma.user.find_unique(where={"id": user_id})
    return user if user else None


async def get_all_users() -> list:
    return await prisma.user.find_many()


async def get_user_name_by_user_id(user_id: str) -> Optional[User]:
    user = await prisma.user.find_unique(where={"id": user_id})
    return user.name if user else None


# Helper function to get the student department
async def get_user_department(user_id: str) -> Optional[str]:
    """
    Helper function to get the student department
    :param user_id: str
    :return department: str
    """
    user = await prisma.user.find_unique(where={"id": user_id})
    return user.department if user else None


# Helper function to get user user firstName and lastName for a list of user ids
async def get_users_by_user_ids(user_ids: List[str]) -> List[User]:
    """
    Helper function to get user data for a list of user ids
    :param user_ids: List[str]
    :return users: List[User]
    """
    users = await prisma.user.find_many(where={"id": {"in": user_ids}})
    return users if users else None


# Helper function to update user status
async def update_user_status(user_id: str, status: str) -> Optional[User]:
    """
    Helper function to update user status
    :param user_id: str
    :param status: str
    :return user: User
    """
    return await prisma.user.update(where={"id": user_id}, data={"studentStatus": status})


# Helper function to get the count of STUDENT roles under a DEPARTMENT
async def get_number_of_students_under_tutor_department(tutor_department: str) -> int:
    """
    Helper function to get the count of STUDENT roles under a DEPARTMENT
    :param tutor_department: str
    :return number_of_students: int
    """
    return await prisma.user.count(where={"department": tutor_department, "role": "STUDENT"})


# A helper function to get the count of STUDENT roles in a studentLevel
async def get_number_of_students_in_a_student_level(student_level: str) -> int:
    """
    A helper function to get the count of STUDENT roles in a studentLevel
    :param student_level: str
    :return number_of_students: int
    """
    return await prisma.user.count(where={"studentLevel": student_level, "role": "STUDENT"})
