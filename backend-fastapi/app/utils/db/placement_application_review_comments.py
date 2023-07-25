from typing import List, Optional

from prisma.models import PlacementApplicationReviewComments

from app.prisma import prisma


# A helper function to create or update a placement application review comment by its application id
async def create_or_update_placement_application_review_comment(
    application_review_comment: dict,
) -> Optional[PlacementApplicationReviewComments]:
    '''
    A helper function to create or update a placement application review comment by its application id
    :param application_review_comment: dict
    :return: PlacementApplicationReviewComments
    '''
    application_id = application_review_comment.get("applicationId")
    data = {"create": application_review_comment, "update": application_review_comment}
    return await prisma.placementapplicationreviewcomments.upsert(where={"applicationId": application_id}, data=data)


# A helper function to get a placement application review comment by its application id
async def get_placement_application_review_comments(application_id: str) -> Optional[PlacementApplicationReviewComments]:
    '''
    A helper function to get a placement application review comment by its application id
    :param application_id: str
    :return: PlacementApplicationReviewComments
    '''
    return await prisma.placementapplicationreviewcomments.find_unique(where={"applicationId": application_id})


# A helper function to get all placement application review comments for a list of application ids
async def get_placement_application_review_comments_by_application_ids(
    application_ids: List[str],
) -> List[PlacementApplicationReviewComments]:
    '''
    A helper function to get all placement application review comments for a list of application ids
    :param application_ids: List[str]
    :return: List[PlacementApplicationReviewComments]
    '''
    return await prisma.placementapplicationreviewcomments.find_many(where={"applicationId": {"in": application_ids}})
