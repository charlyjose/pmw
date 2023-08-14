import json
import os
from typing import Optional

from shapely.geometry import Point, shape

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))


def check_coordinate_in_feature(coordinate, geojson_file):
    """
    Check if a given coordinate falls under a feature in a GeoJSON file.

    Parameters:
        coordinate: tuple (latitude, longitude) representing the coordinate to check.
        geojson_file: str, path to the GeoJSON file containing features.

    Returns:
        bool: True if the coordinate falls under any feature, False otherwise.
    """
    # Load GeoJSON data
    with open(geojson_file, 'r') as f:
        data = json.load(f)

    # Create a point geometry from the coordinate
    point = Point(coordinate[::-1])  # GeoJSON uses (longitude, latitude) order

    # Iterate through features and check if the coordinate is within any of them
    for feature in data['features']:
        polygon = shape(feature['geometry'])
        if polygon.contains(point):
            return feature['properties']['EER13NM']
    return None


# Example usage:
def get_region(coordinate: tuple) -> Optional[str]:
    geojson_file_path = f"{ROOT_DIR}/maps/gb_geoJSON_eer.json"  # Replace with the actual file path
    region = check_coordinate_in_feature(coordinate, geojson_file_path)
    return region
