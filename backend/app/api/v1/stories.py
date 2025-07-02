from fastapi import APIRouter, HTTPException
from typing import List
from app.models.story import Story
# Create router for stories
story_router = APIRouter()

#story 저장
#불러오는 api

@story_router.get(
    "/",
    summary="Get all stories",
    tags=["stories"],
    response_model=List[Story]
)
async def get_stories():
    pass

@story_router.get(
    "/{story_id}",
    summary="Get a story by id",
    tags=["stories"],
    response_model=Story
)
async def get_story(story_id: str):
    pass

#save story
@story_router.post(
    "/",
    summary="Save a story",
    tags=["stories"],
    response_model=Story
)
async def save_story(story: Story):
    pass