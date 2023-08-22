from typing import List

import geopy.distance

from app.api.models.route_plan import City, RoutePlan, RoutePlanCity, Unit


def distance(city1: City, city2: City, unit=Unit.KM):
    coordinate1 = (city1.coordinate.latitude, city1.coordinate.longitude)
    coordinate2 = (city2.coordinate.latitude, city2.coordinate.longitude)

    if unit == Unit.MILES:
        return geopy.distance.geodesic(coordinate1, coordinate2).miles
    else:
        return geopy.distance.geodesic(coordinate1, coordinate2).km


# Nearest Neighbor Algorithm to find an nearest location
def nearest_location_algorithm(city_list: List[City], unit) -> RoutePlan:
    unvisited_cities = city_list.copy()
    current_city = unvisited_cities.pop(0)
    id = 0
    route_plan_city = [RoutePlanCity(id=id, address=current_city.address, coordinate=current_city.coordinate, distance=0)]

    while unvisited_cities:
        id += 1
        distances = [distance(current_city, city, unit) for city in unvisited_cities]

        # Get the nearest city
        nearest_city_index = distances.index(min(distances))
        nearest_city = unvisited_cities[nearest_city_index]
        route_plan_city.append(
            RoutePlanCity(id=id, address=nearest_city.address, coordinate=nearest_city.coordinate, distance=distances[nearest_city_index])
        )
        current_city = nearest_city
        unvisited_cities.remove(nearest_city)

    # Return to starting city
    start_city = route_plan_city[0]
    last_city = route_plan_city[-1]
    route_plan_city.append(
        RoutePlanCity(
            id=id + 1, address=start_city.address, coordinate=start_city.coordinate, distance=distance(last_city, start_city, unit=unit)
        )
    )

    # Calculate the total distance from route plan
    total_distance = sum(route_plan_city[i].distance for i in range(len(route_plan_city)))
    return RoutePlan(cities=route_plan_city, total_distance=total_distance, unit=unit)


def prepare_route_plan(cities: List[City], unit: Unit) -> RoutePlan:
    return nearest_location_algorithm(cities, unit=unit)


def get_route_plan(cities: List[City], unit: Unit) -> RoutePlan:
    """
    Get the optimal route plan for a given list of cities.

    Parameters:
        cities: A list of cities to visit.
        unit: Unit of distance.

    Returns:
        optimal_route: A list of cities in the optimal order.
        total_distance: Total distance of the optimal route.
    """

    return prepare_route_plan(cities, unit=unit)
