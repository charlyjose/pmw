from typing import Union

from fastapi import APIRouter, Depends
from fastapi import status as http_status
from fastapi.encoders import jsonable_encoder
from prisma.models import PlacementApplication

from app.api.auth import ValidateUserRole
from app.api.models import action_status
from app.api.models.auth import Role as UserRole
from app.api.models.placement_application import (
    CleanedPlacementApplicationForTutor,
    CleanedPlacementApplicationWithCreaterAndReviewerName,
    PlacementApplicationForm,
    PlacementApplicationInDB,
    PlacementApplicationInDBUpdateStatus,
)
from app.api.models.placement_application import PlacementApplicationStatus as application_status
from app.api.models.placement_application import ReviewCommentsForm, ReviewCommentsInDB
from app.api.models.response import JSONResponseModel
from app.pnp_helpers.auth import no_access_to_content_response
from app.pnp_helpers.client_response import json_response
from app.pnp_helpers.json_response_wrapper import default_response
from app.pnp_helpers.user import user_not_found_response
from app.utils.auth import pyJWTDecodedUserId
from app.utils.db import placement_application as placement_application_db
from app.utils.db import placement_application_review_comments as placement_application_review_comments_db
from app.utils.db import placement_tutor as placement_tutor_db
from app.utils.db import user as user_db
from app.utils.reponse import ClientResponse

router = APIRouter()


# A helper function to prepare and add a new placement application to the database and return the cleaned placement application
async def add_new_application(ownerId: str, reviewer_id: str, application: dict) -> Union[PlacementApplication, None]:
    try:
        new_application = PlacementApplicationInDB(ownerId=ownerId, reviewerId=reviewer_id, **application.dict()).dict()
        return await placement_application_db.create_new_application(new_application)
    except Exception:
        return None


# A helper function to prepare and update an existing placement application as a reset. The status is set to pending
async def update_application_with_status_reset(
    applicationId: str, old_application: dict, new_application: dict
) -> Union[PlacementApplication, None]:
    try:
        first_dict = PlacementApplicationForm(**old_application.dict()).dict()
        second_dict = PlacementApplicationInDBUpdateStatus(status=application_status.PENDING, **new_application.dict()).dict()
        diff_application = {k: second_dict[k] for k, _ in set(second_dict.items()) - set(first_dict.items())}
        return await placement_application_db.update_application(applicationId, diff_application)
    except Exception:
        return None


async def read_placement_application(placement_application: PlacementApplicationForm) -> PlacementApplicationForm:
    return placement_application


@router.post("/student/placement/application", summary="Add or update placement application", tags=["placement_application"])
async def add_or_update_placement_application(
    user_id: str = Depends(pyJWTDecodedUserId()), placement_application: PlacementApplicationForm = Depends(read_placement_application)
) -> JSONResponseModel:
    if user_id:
        # Only students can add placement applications
        roles = [UserRole.STUDENT]
        valid_user_role = await ValidateUserRole(user_id, roles)()
        if valid_user_role:
            application = await placement_application_db.get_by_owner_id(user_id)
            if application:
                # Update existing application
                application_id = application.id
                updated_application = await update_application_with_status_reset(application_id, application, placement_application)
                if updated_application:
                    message = "Application updated"
                    response = json_response(http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_UPDATED, message=message)
                    return ClientResponse(**response)()
                else:
                    message = "Application not updated"
                    response = json_response(
                        http_status=http_status.HTTP_400_BAD_REQUEST, action_status=action_status.DATA_NOT_UPDATED, message=message
                    )
                    return ClientResponse(**response)()
            else:
                owner_id = user_id
                department = await user_db.get_user_department(user_id)
                tutor_id = await placement_tutor_db.get_placement_tutor_id_by_department(department)
                reviewer_id = tutor_id
                new_application = await add_new_application(owner_id, reviewer_id, placement_application)
                if new_application:
                    message = "Application added"
                    response = json_response(http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_CREATED, message=message)
                    return ClientResponse(**response)()
                else:
                    message = "Application not added"
                    response = json_response(
                        http_status=http_status.HTTP_400_BAD_REQUEST, action_status=action_status.DATA_NOT_CREATED, message=message
                    )
                    return ClientResponse(**response)()
        else:
            return no_access_to_content_response(message="No valid previlages to add placement application")
    else:
        return user_not_found_response()


@router.get("/student/placement/application", summary="Get placement application", tags=["placement_application"])
async def get_placement_application(user_id: str = Depends(pyJWTDecodedUserId())) -> JSONResponseModel:
    if user_id:
        # Only students can get placement applications
        roles = [UserRole.STUDENT]
        valid_user_role = await ValidateUserRole(user_id, roles)()
        if valid_user_role:
            application = await placement_application_db.get_by_owner_id(user_id)
            if application:
                # Get the name of the reviewer
                reviewer_name = await user_db.get_user_name_by_user_id(application.reviewerId)
                cleaned_applications = []
                cleaned_application_for_user = CleanedPlacementApplicationWithCreaterAndReviewerName(
                    reviewedBy=reviewer_name, **application.dict()
                ).dict()
                json_compatible_cleaned_application = jsonable_encoder(cleaned_application_for_user)
                cleaned_applications.append(json_compatible_cleaned_application)

                message = "Application found"
                data = {"applications": cleaned_applications}
                response = json_response(
                    http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_FETCHED, message=message, data=data
                )
                return ClientResponse(**response)()
            else:
                message = "Application not found"
                data = {"applications": []}
                response = json_response(
                    http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_NOT_FOUND, message=message, data=data
                )
                return ClientResponse(**response)()
        else:
            return no_access_to_content_response(message="No valid previlages to get placement application")
    else:
        return user_not_found_response()


# Get all placement applications for a tutor by department paginated
@router.get("/tutor/placement/applications", summary="Get placement applications for tutor by departament", tags=["placement_application"])
async def get_placement_applications_for_tutor_by_department(
    user_id: str = Depends(pyJWTDecodedUserId()), page: int = 1
) -> JSONResponseModel:
    if user_id:
        # Page number should be greater than 0
        if page > 0:
            skip = (page - 1) * 10
            take = 10
            # Get paginated applications from the database
            applications = await placement_application_db.get_all_by_reviewer_paginated(user_id, skip, take)
            # Get ownerId list from applications
            ownerIds = [application.ownerId for application in applications]
            users = await user_db.get_users_by_user_ids(ownerIds)

            # Get all application id
            applicationIds = [application.id for application in applications]
            # Get all review comments for the applications
            review_comments = await placement_application_review_comments_db.get_placement_application_review_comments_by_application_ids(
                applicationIds
            )

            application_list = []
            for application in applications:
                # From the list of users, get the user with the ownerId
                studentLevel = next((user for user in users if user.id == application.ownerId), None).studentLevel
                # From the list of review comments, get the review comments with the applicationId
                comments = next((comment.comments for comment in review_comments if comment.applicationId == application.id), [])

                cleaned_application_for_user = CleanedPlacementApplicationForTutor(studentLevel=studentLevel, **application.dict()).dict()
                json_compatible_cleaned_application = jsonable_encoder(cleaned_application_for_user)
                json_compatible_cleaned_application["review_comments"] = comments
                application_list.append(json_compatible_cleaned_application)

            # Set hasMore to true if there are more applications to be fetched
            hasMore = len(applications) == 10

            data = {"applications": application_list, "hasMore": hasMore}
            message = "Applications fetched"
            response = json_response(
                http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_FETCHED, message=message, data=data
            )
            return ClientResponse(**response)()
        else:
            message = "Page number should be greater than 0"
            response = json_response(
                http_status=http_status.HTTP_204_NO_CONTENT, action_status=action_status.DATA_NOT_FOUND, message=message
            )
            return ClientResponse(**response)()
    else:
        return user_not_found_response()


# Change the status of a placement application
@router.put("/tutor/placement/application/status", summary="Change the status of a placement application", tags=["placement_application"])
async def change_placement_application_status(id: str, status: str, user_id: str = Depends(pyJWTDecodedUserId())) -> JSONResponseModel:
    if user_id:
        # Only tutors can change the status of placement applications
        roles = [UserRole.TUTOR]
        valid_user_role = await ValidateUserRole(user_id, roles)()
        if valid_user_role:
            application = await placement_application_db.get_application_by_id(id)
            if application:
                # Update existing application

                # status = application_status.REVIEW if status else application_status.PENDING
                valid_status = status.upper() in application_status.__members__.keys()
                if not valid_status:
                    message = "Invalid status"
                    response = json_response(
                        http_status=http_status.HTTP_400_BAD_REQUEST, action_status=action_status.DATA_NOT_UPDATED, message=message
                    )
                    return ClientResponse(**response)()
                else:
                    update = {"status": status.upper()}
                    updated_application = await placement_application_db.update_application(application.id, update)
                    if updated_application:
                        message = "Application status updated"
                        response = json_response(
                            http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_UPDATED, message=message
                        )
                        return ClientResponse(**response)()
                    else:
                        message = "Application status not updated"
                        response = json_response(
                            http_status=http_status.HTTP_400_BAD_REQUEST, action_status=action_status.DATA_NOT_UPDATED, message=message
                        )
                        return ClientResponse(**response)()
            else:
                message = "Application not found"
                response = json_response(
                    http_status=http_status.HTTP_400_BAD_REQUEST, action_status=action_status.DATA_NOT_FOUND, message=message
                )
                return ClientResponse(**response)()
        else:
            return no_access_to_content_response(message="No valid previlages to change placement application status")


async def read_placement_application_review_comments(review_comments: ReviewCommentsForm) -> PlacementApplicationForm:
    return review_comments


# Add review comments to a placement application
@router.put("/tutor/placement/application/review", summary="Add review comments to a placement application", tags=["placement_application"])
async def add_review_comments_to_placement_application(
    id: str,
    review_comments: ReviewCommentsForm = Depends(read_placement_application_review_comments),
    user_id: str = Depends(pyJWTDecodedUserId()),
) -> JSONResponseModel:
    if user_id:
        # Only tutors can add review comments to placement applications
        roles = [UserRole.TUTOR]
        valid_user_role = await ValidateUserRole(user_id, roles)()
        if valid_user_role:
            application = await placement_application_db.get_application_by_id(id)
            if application:
                update = ReviewCommentsInDB(ownerId=user_id, applicationId=id, comments=review_comments.comment_list).dict()
                updated_application = await placement_application_review_comments_db.create_or_update_placement_application_review_comment(
                    update
                )
                if updated_application:
                    message = "Review comments added"
                    return default_response(http_status=http_status.HTTP_200_OK, action_status=action_status.DATA_UPDATED, message=message)
                else:
                    message = "Review comments not added"
                    return default_response(
                        http_status=http_status.HTTP_400_BAD_REQUEST, action_status=action_status.DATA_NOT_UPDATED, message=message
                    )
            else:
                message = "Application not found"
                return default_response(
                    http_status=http_status.HTTP_400_BAD_REQUEST, action_status=action_status.DATA_NOT_FOUND, message=message
                )
        else:
            return no_access_to_content_response(message="No valid previlages to add review comments to placement application")
