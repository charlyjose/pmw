from typing import List

import geopy.distance

from app.api.models.route_plan import (
    City,
    PlacementVisitLocations,
    RoutePlan,
    RoutePlanCity,
    RoutePlanSuggestion,
    Unit,
    RoutePlanWithSuggestion,
)


def distance(city1: City, city2: City, unit=Unit.KM):
    coordinate1 = (city1.coordinate.latitude, city1.coordinate.longitude)
    coordinate2 = (city2.coordinate.latitude, city2.coordinate.longitude)

    if unit == Unit.MILE:
        return geopy.distance.geodesic(coordinate1, coordinate2).miles
    else:
        return geopy.distance.geodesic(coordinate1, coordinate2).km


# Nearest Neighbor Algorithm to find an nearest location
def nearest_location_algorithm(city_list: List[PlacementVisitLocations], unit) -> RoutePlan:
    unvisited_cities = city_list.copy()
    current_city = unvisited_cities.pop(0)
    id = 0
    route_plan_city = [RoutePlanCity(id=id, distance=0, **current_city.dict())]

    while unvisited_cities:
        id += 1
        distances = [distance(current_city, city, unit) for city in unvisited_cities]

        # Get the nearest city
        nearest_city_index = distances.index(min(distances))
        nearest_city = unvisited_cities[nearest_city_index]
        route_plan_city.append(RoutePlanCity(id=id, distance=distances[nearest_city_index], **nearest_city.dict()))

        current_city = nearest_city
        unvisited_cities.remove(nearest_city)

    # Return to starting city
    start_city = route_plan_city[0]
    last_city = route_plan_city[-1]
    route_plan_city.append(
        RoutePlanCity(
            id=id + 1,
            placement_id=start_city.placement_id,
            address=start_city.address,
            coordinate=start_city.coordinate,
            distance=distance(last_city, start_city, unit=unit),
        )
    )

    # Calculate the total distance from route plan
    total_distance = sum(route_plan_city[i].distance for i in range(len(route_plan_city)))
    return RoutePlan(cities=route_plan_city, total_distance=total_distance, unit=unit)


def prepare_route_plan(cities: List[PlacementVisitLocations], unit: Unit) -> RoutePlan:
    return nearest_location_algorithm(cities, unit=unit)


def prepare_suggestion(route_plan, unit: Unit) -> RoutePlanSuggestion:
    average_time_spent_at_each_location = 1.5

    # Calculate the average distance between cities
    average_distance = route_plan.total_distance / len(route_plan.cities)

    # UK Average speed of in UK is 56.5 mph (90.9 km/h)
    avg_mph = 56.5
    avg_kmh = 90.9

    if unit == Unit.MILE:
        route_plan_total_time = (route_plan.total_distance / avg_mph) + average_time_spent_at_each_location * len(route_plan.cities)
    else:
        route_plan_total_time = (route_plan.total_distance / avg_kmh) + average_time_spent_at_each_location * len(route_plan.cities)

    # Recommended number of cities to visit per day (8 hours) to avoid fatigue is by reducing the number of cities to visit per day
    recommended_plan = []
    distance = 0
    total_time = 0
    for city in route_plan.cities:
        distance += city.distance
        # Calculate the total time to travel that city
        if unit == Unit.MILE:
            total_road_time = distance / avg_mph
        else:
            total_road_time = distance / avg_kmh

        total_time += total_road_time + average_time_spent_at_each_location

        if total_time <= 8:
            # If the location is not the last location
            if city.id != len(route_plan.cities) - 1:
                recommended_plan.append(city)
        else:
            break

    # Add the last city
    recommended_plan.append(route_plan.cities[-1])
    # Change the id of the last city
    recommended_plan[-1].id = len(recommended_plan) - 1
    # Recalculate the total distance
    total_distance = sum(recommended_plan[i].distance for i in range(len(recommended_plan)))

    suggested_route_plan = RoutePlan(cities=recommended_plan, total_distance=total_distance, unit=unit)

    suggestions = f"""**Useful insights for your planning:**

    Average distance between cities in your route plan is {average_distance:.2f} {unit.title()}s. 
    Average speed in UK is {avg_mph} mph ({avg_kmh} km/h). 
    Average time spent at each location is {average_time_spent_at_each_location} hours. 
    Total distance in route plan is {route_plan.total_distance:.2f} {unit.title()}s. 
    Total time to travel your route plan is {route_plan_total_time:.2f} hours. 

    **Recommendations:**
    Recommended number of cities to visit per day (under 8 work hours) to avoid fatigue is {len(recommended_plan) - 1}. 
    Total distance in recommended route plan is {total_distance:.2f} {unit.title()}s. 
    Total time to travel the recommended route plan is {total_time:.2f} hours. 

    """

    route_plan_with_suggestion = RoutePlanSuggestion(
        suggested_route_plan=suggested_route_plan,
        suggested_number_of_cities_to_visit_per_day=len(recommended_plan) - 1,
        recommendations=suggestions,
    )

    return route_plan_with_suggestion


def get_route_plan(cities: List[PlacementVisitLocations], unit: Unit, recommendations: bool) -> RoutePlanWithSuggestion:
    """
    Get the optimal route plan for a given list of cities.

    Parameters:
        cities: A list of cities to visit.
        unit: Unit of distance.

    Returns:
        optimal_route: A list of cities in the optimal order.
        total_distance: Total distance of the optimal route.
    """

    route_plan = prepare_route_plan(cities, unit=unit)
    if recommendations:
        route_plan_with_suggestion = prepare_suggestion(route_plan, unit=unit)
        return RoutePlanWithSuggestion(route_plan=route_plan, route_plan_suggestion=route_plan_with_suggestion)
    else:
        return RoutePlanWithSuggestion(route_plan=route_plan)
