from enum import Enum
from typing import List, Optional

from pydantic import BaseModel

from app.api.models.coordinate import Coordinate


class Unit(str, Enum):
    """
    A class to represent the unit of distance.
    """

    MILE = "MILE"
    KM = "KM"


class City(BaseModel):
    """
    A pydantic model to represent a city.

    Parameters:
        address: Address of the city.
        coordinate: Coordinate of the city.
    """

    address: str
    coordinate: Coordinate


class PlacementStudentVisit(BaseModel):
    placement_id: Optional[str] = None


class PlacementVisitLocations(City, PlacementStudentVisit):
    pass


class RoutePlanCity(PlacementVisitLocations):
    id: int
    distance: float


class RoutePlan(BaseModel):
    """
    A pydantic model to represent a route plan.

    Parameters:
        cities: List of cities to visit.
        total_distance: Total distance of the route.
        unit: Unit of the distance.
    """

    cities: List[RoutePlanCity]
    total_distance: float
    unit: Unit


class RoutePlanSuggestion(BaseModel):
    suggested_route_plan: RoutePlan
    suggested_number_of_cities_to_visit_per_day: int
    recommendations: str


class RoutePlanWithSuggestion(BaseModel):
    route_plan: RoutePlan
    route_plan_suggestion: Optional[RoutePlanSuggestion] = None


class StartLocation(PlacementVisitLocations):
    pass


class VisitPlan(BaseModel):
    route_plan: RoutePlan
    visit_date: str
