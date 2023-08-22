from typing import List

import geopy.distance

from app.api.models.route_plan import City, Unit


def distance(city1, city2, unit=Unit.KM):
    if unit == Unit.MILES:
        return geopy.distance.geodesic(city1[1], city2[1]).miles
    else:
        return geopy.distance.geodesic(city1[1], city2[1]).km


# Nearest Neighbor Algorithm to find an nearest location
def nearest_location_algorithm(city_list: list, unit=Unit.KM):
    unvisited_cities = city_list.copy()
    current_city = unvisited_cities.pop(0)
    route = [current_city]

    while unvisited_cities:
        nearest_city = min(unvisited_cities, key=lambda city: distance(current_city, city, unit))
        route.append(nearest_city)
        current_city = nearest_city
        unvisited_cities.remove(nearest_city)

    return route


def prepare_route_plan(cities: list, unit: Unit):
    return nearest_location_algorithm(cities, unit=unit)


def get_route_plan(cities: List[City], unit: Unit):
    """
    Get the optimal route plan for a given list of cities.

    Parameters:
        cities: A list of cities to visit.
        unit: Unit of distance.

    Returns:
        optimal_route: A list of cities in the optimal order.
        total_distance: Total distance of the optimal route.
    """

    print("Route Planner")
    print(cities)
    print(unit)

    route = prepare_route_plan(cities, unit=unit)
    total_distance = sum(distance(route[i], route[i + 1], unit=unit) for i in range(len(route) - 1))

    # Return to starting city
    route.append(route[0])
    total_distance += distance(route[-2], route[-1], unit=unit)

    return route, total_distance
