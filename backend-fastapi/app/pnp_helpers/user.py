from fastapi import status as http_status

from app.api.models import action_status
from app.pnp_helpers.client_response import json_response
from app.utils.reponse import ClientResponse


def user_not_found_response(
    http_status: int = http_status.HTTP_400_BAD_REQUEST,  # HTTP_204_NO_CONTENT
    action_status: str = action_status.DATA_NOT_FOUND,
    message: str = "User not found",
    data: dict = None,
):
    """
    Boilerplate JSON response for user not found
    """

    # User not found
    response = json_response(http_status, action_status, message, data)
    return ClientResponse(**response)()
