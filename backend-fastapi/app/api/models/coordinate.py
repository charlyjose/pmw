from pydantic import BaseModel


class Coordinate(BaseModel):
    """
    A pydantic model to represent a coordinate.

    Parameters:
        longitude: float
        latitude: float
    """

    longitude: float
    latitude: float
