import http
import typing


class PMWHTTPException(Exception):
    def __init__(
        self,
        status_code: int,
        message: typing.Optional[str] = None,
        content: typing.Optional[dict] = None,
        headers: typing.Optional[dict] = None,
    ) -> None:
        if message is None:
            message = http.HTTPStatus(status_code).phrase
        self.status_code = status_code
        self.message = message
        self.content = content
        self.headers = headers
