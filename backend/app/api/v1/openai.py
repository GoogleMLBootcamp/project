from fastapi import APIRouter, HTTPException, Body
from typing import List
from pydantic import BaseModel
from ...services.openai_service import OpenAIService
from ...models.story import Story

# Initialize the OpenAIService
openai_service = OpenAIService()

# Create router for OpenAI endpoints
openai_router = APIRouter()

@openai_router.post(
    "/generate-story",
    summary="Generate a story from image descriptions using OpenAI GPT",
    tags=["openai"],
    response_model=Story,
)
async def generate_story(imageDescriptions: str = Body(...)):
    storyPrompts = openai_service.generate_prompt_for_story(imageDescriptions)
    story = openai_service.generate_story(storyPrompts)
    return {"story": story}

