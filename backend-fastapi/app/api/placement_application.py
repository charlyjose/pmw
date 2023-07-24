import os
from typing import Any, Optional

from fastapi import APIRouter, Depends, UploadFile
from fastapi import status as http_status
from fastapi.encoders import jsonable_encoder

import app.pnp_helpers.user as user_pnp_helpers
import app.pnp_helpers.auth as auth_pnp_helpers

from app.api.models import action_status
from app.api.models.placement_application import PlacementApplicationForm
from app.api.models.response import JSONResponseModel
from app.pnp_helpers.client_response import json_response
from app.utils.auth import pyJWTDecodedUserId
from app.utils.db import placement_application as placement_application_db
from app.utils.reponse import ClientResponse
from starlette.responses import FileResponse
from app.api.auth import ValidateUserRole
from app.api.models.auth import Role as UserRole


router = APIRouter()


async def read_placement_application(placement_application: PlacementApplicationForm) -> PlacementApplicationForm:
    return placement_application


@router.post("/student/placement/application", summary="Add or update placement application", tags=["placement_application"])
async def add_or_update_palcement_application(
    user_id: str = Depends(pyJWTDecodedUserId()), placement_application: PlacementApplicationForm = Depends(read_placement_application)
):
    print(user_id)
    print(placement_application)
    return "OK"

    if user_id:
        # Only students can add placement applications
        # validate user is ADMIN
        roles = [UserRole.STUDENT]
        valid_user_role = await ValidateUserRole(user_id, roles)()
        if valid_user_role:
            # Check if a placement application already exists
            # If it exists, update it
            # If it doesn't exist, create a new one
            application_exists = await placement_application_db.check_placement_application_exists(user_id)
            if application_exists:
                # Update existing application
                updated_application = await placement_application_db.update_placement_application(user_id, placement_application)
                if updated_application:
                    message = "Application updated"
                    response = json_response(http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_UPDATED, message=message)
                    return ClientResponse(**response)()
                else:
                    message = "Application not updated"
                    response = json_response(
                        http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_NOT_UPDATED, message=message
                    )
                    return ClientResponse(**response)()
            else:
                # Create new application
                new_application = await placement_application_db.create_new_placement_application(user_id, placement_application)
                if new_application:
                    message = "Application added"
                    response = json_response(http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_ADDED, message=message)
                    return ClientResponse(**response)()
                else:
                    message = "Application not added"
                    response = json_response(
                        http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_NOT_ADDED, message=message
                    )
                    return ClientResponse(**response)()

    # print(user_id)
    # print(placement_application)
    message = "Application added"
    response = json_response(http_status=http_status.HTTP_200_OK, action_status=action_status.NO_ERROR, message=message)
    return ClientResponse(**response)()


# @router.post("/student/placement/application", summary="Add or update placement application", tags=["placement_application"])
# async def add_or_update_palcement_application(
#     user_id: str = Depends(pyJWTDecodedUserId()), placement_application: PlacementApplication = Depends(read_placement_application)
# ):
#     print(user_id)
#     print(placement_application)
#     return "OK"
