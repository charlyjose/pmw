from fastapi import status as http_status

from app.api.models import action_status
from app.pnp_helpers.client_response import json_response
from app.utils.reponse import ClientResponse


def no_access_to_content(
    http_status: int = http_status.HTTP_403_FORBIDDEN,
    action_status: str = action_status.UNAUTHORIZED,
    message: str = "No valid access previlages",
    data: dict = None,
):
    """
    Boilerplate JSON response for invalid access previlages
    """

    # User not found
    response = json_response(http_status, action_status, message, data)
    return ClientResponse(**response)()
