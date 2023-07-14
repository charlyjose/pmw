from datetime import datetime

from prisma.models import Appointment

from app.api.models.appointment import AppointmentStatus
from app.prisma import prisma


# A helper function to add a new appointment to the database
async def add_new_appointment_to_db(appointment: dict) -> Appointment:
    '''
    A helper function to add a new appointment to the database
    :param appointment: dict
    :return: None
    '''
    return await prisma.appointment.create(appointment)


# A helper function to get all appointments from the database
async def get_all_appointments_from_db() -> list:
    '''
    A helper function to get all appointments from the database
    :return: list
    '''
    return await prisma.appointment.find_many()


# A helper function to get all appointments from the database by ownerId
async def get_all_appointments_by_ownerId_from_db(ownerId: str) -> list:
    '''
    A helper function to get all appointments from the database by ownerId
    :param ownerId: str
    :return: list
    '''
    return await prisma.appointment.find_many(where={"ownerId": ownerId})


# A helper function to get all appointments from the database by ownerId and greater date
async def get_all_appointments_by_ownerId_and_greater_date_from_db(ownerId: str, date_time: str) -> list:
    '''
    A helper function to get all appointments from the database by ownerId and greater date
    :param ownerId: str
    :param date: str
    :return: list
    '''
    return await prisma.appointment.find_many(where={"ownerId": ownerId, "date": {"gte": date_time}})


# A helper function to get all appointments from the database by ownerId and past date
async def get_all_appointments_by_ownerId_and_past_date_from_db(ownerId: str, date_time: str) -> list:
    '''
    A helper function to get all appointments from the database by ownerId and past date
    :param ownerId: str
    :param date: str
    :return: list
    '''
    return await prisma.appointment.find_many(where={"ownerId": ownerId, "date": {"lt": date_time}})


# A helper function to get all future appointments from the database by ownerId
async def get_all_future_appointments_by_ownerId_from_db(ownerId: str) -> list:
    '''
    A helper function to get all future appointments from the database by ownerId
    :param ownerId: str
    :return: list
    '''
    return await prisma.appointment.find_many(where={"ownerId": ownerId, "date": {"gte": datetime.today()}})


# A helper function to get all past appointments from the database by ownerId
async def get_all_past_appointments_by_ownerId_from_db(ownerId: str) -> list:
    '''
    A helper function to get all past appointments from the database by ownerId
    :param ownerId: str
    :return: list
    '''
    return await prisma.appointment.find_many(where={"ownerId": ownerId, "date": {"lt": datetime.today()}})


# A helper function to get all CONFIRMED appointment from the database by ownerId
async def get_all_appointments_by_ownerId_and_status_from_db(ownerId: str, status: AppointmentStatus) -> list:
    '''
    A helper function to get all appointment from the database by ownerId and status
    :param ownerId: str
    :return: list
    '''
    return await prisma.appointment.find_many(where={"ownerId": ownerId, "status": status})
