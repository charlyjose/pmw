from typing import Any, Dict, Optional

from pydantic import BaseModel


class ResponseModelContent(BaseModel):
    error: str = None
    message: str
    data: Optional[Dict[str, Any]] = None


class JSONResponseModel(BaseModel):
    status_code: int
    content: ResponseModelContent
    headers: Optional[Dict[str, Any]] = None
