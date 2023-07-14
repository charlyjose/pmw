from fastapi.responses import JSONResponse

from app.api.models.response import JSONResponseModel, ResponseModelContent


# A helper function to create a JSON response
def createJSONResponse(status_code: int, content: ResponseModelContent, **kwargs) -> JSONResponseModel:
    '''
    A helper function to create a JSON response
    :param status_code: HTTP status code
    :param content: ResponseModelContent
    :param kwargs: Any other arguments
    :return: JSONResponseModel
    '''
    response_model = JSONResponseModel(status_code=status_code, content=content, **kwargs)
    return JSONResponse(**response_model.dict())
