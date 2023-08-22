import json
import os
from typing import Optional

from shapely.geometry import Point, shape

from app.api.models.coordinate import Coordinate

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))


def get_region_in_geoJSON(coordinate, geoJson_data) -> Optional[str]:
    """
    Check if a given coordinate falls under a feature in a GeoJSON file.

    Parameters:
        coordinate: tuple (latitude, longitude) representing the coordinate to check.
        geoJson_data: GeoJSON data containing features.

    Returns:
        bool: Region (str) if the coordinate falls under any feature, None otherwise.
    """

    point = Point(coordinate)

    # If the coordinate is within any of the features, return the name of the feature
    for feature in geoJson_data['features']:
        polygon = shape(feature['geometry'])
        if polygon.contains(point):
            return feature['properties']['EER13NM']
    return None


def get_region(coordinate: Coordinate) -> Optional[str]:
    """
    Get a UK region from a geo coordinate.

    Parameters:
        coordinate: Coordinate object containing latitude and longitude.

    Returns:
        bool: Region (str) if the coordinate falls under any feature, None otherwise.

    """

    coordinate_tuple = (coordinate.longitude, coordinate.latitude)

    geojson_file_path = f"{ROOT_DIR}/maps/gb_geoJSON_eer.json"
    with open(geojson_file_path, 'r') as f:
        geoJson_data = json.load(f)

    return get_region_in_geoJSON(coordinate_tuple, geoJson_data)
