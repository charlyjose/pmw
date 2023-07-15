from typing import Any

from fastapi.responses import JSONResponse

from app.api.models.response import JSONResponseModel, ResponseModelContent


class ClientResponse:
    '''
    A helper class to create a JSON response
    :param status_code: HTTP status code
    :param error: Action status
    :param content: ResponseModelContent
    :param kwargs: Any other arguments
    :return: JSONResponseModel

    Usage:
    json_response = Response(
        status_code=http_status.HTTP_200_OK,
        error=action_status.NO_ERROR,
        message="Appointment created",
        data=cleaned_appointment,
    )
    return json_response()

    Note: The caller must forehandedly perform any JSON serialising
    '''

    def __init__(self, http_status: int, action_status: str, message: str, data: Any = None):
        self.http_status = http_status
        self.action_status = action_status
        self.message = message
        self.data = data

    def __call__(self) -> Any:
        content = ResponseModelContent(**self.__dict__)
        response_model = JSONResponseModel(status_code=self.http_status, content=content)
        return JSONResponse(**response_model.dict())
