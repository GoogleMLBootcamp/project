from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import List

hi_router = APIRouter()

@hi_router.get(
    "/",
    summary="Hi",
    tags=["hi"],
    response_model=dict
)
async def hi():
    return {"message": "Hi"}