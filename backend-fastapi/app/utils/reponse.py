from typing import Any

from fastapi.responses import JSONResponse

from app.api.models.response import JSONResponseModel, ResponseModelContent


# A helper function to create a JSON response
def createJSONResponse(status_code: int, error: str, message: str, data: Any = None, **kwargs) -> JSONResponseModel:
    '''
    A helper function to create a JSON response
    :param status_code: HTTP status code
    :param content: ResponseModelContent
    :param kwargs: Any other arguments
    :return: JSONResponseModel
    '''

    content = ResponseModelContent(error=error, message=message, data=data)
    response_model = JSONResponseModel(status_code=status_code, content=content, **kwargs)
    return JSONResponse(**response_model.dict())
