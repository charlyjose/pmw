from typing import Any


def json_response(http_status: int, action_status: str, message: str, data: Any = None) -> dict:
    '''
    A helper function to create a JSON response
    :param http_status: HTTP status code
    :param action_status: Action status
    :param message: str
    :param data: Any
    :return: dict
    '''

    # TODO: Any JSON serialising must be performed by the caller

    return {"http_status": http_status, "action_status": action_status, "message": message, "data": data}
