from fastapi import status as http_status

from app.api.models import action_status
from app.api.models.response import ResponseModelContent
from app.utils.reponse import createJSONResponse


def no_user_found(
    message: str = "User not found", status_code: int = http_status.HTTP_204_NO_CONTENT, error: str = action_status.DATA_NOT_FOUND
):
    """
    User not found
    """

    # User not found
    message = "User not found"
    return createJSONResponse(
        status_code=http_status.HTTP_204_NO_CONTENT, content=ResponseModelContent(error=action_status.DATA_NOT_FOUND, message=message)
    )
