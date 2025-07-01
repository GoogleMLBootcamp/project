from fastapi import APIRouter, HTTPException
from typing import List

# Create router for stories
story_router = APIRouter()

@story_router.post("/")
async def create_story(images: List[str]):
    # Implementation here
    pass

@story_router.get("/{story_id}")
async def get_story(story_id: str):
    # Implementation here
    pass
