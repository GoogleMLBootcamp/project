from uuid import uuid4
from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, HTTPException, UploadFile, File

from ...services.cloudinary_service import CloudinaryService
from ...models.image import Image

cloudinary_service = CloudinaryService()

image_router = APIRouter()

# ────────────────────────────────────────────────
# POST /v2/images/upload  ─  여러 장 업로드
# ────────────────────────────────────────────────
@image_router.post(
    "/upload",
    summary="Upload multiple images to Cloudinary",
    tags=["images-v2"],
    response_model=dict
)
async def upload_images(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")

    story_id = str(uuid4())
    saved_urls: list[str] = []

    try:
        for idx, file in enumerate(files, 1):
            if not file.filename:
                raise HTTPException(status_code=400, detail=f"Image {idx} has no filename")

            # 업로드
            image_url = await cloudinary_service.upload_image(file, story_id, idx)
            saved_urls.append(image_url)

        return {
            "story_id":    story_id,
            "image_urls":  saved_urls,
            "image_count": len(files),
            "created_at":  datetime.now(timezone.utc).isoformat(),   # ★ 추가
        }

    except Exception as e:
        # 업로드 도중 실패하면 롤백
        await cloudinary_service.delete_story_images(story_id)
        raise HTTPException(status_code=500, detail=str(e)) from e

# ────────────────────────────────────────────────
# DELETE /v2/images/{story_id}
# ────────────────────────────────────────────────
@image_router.delete(
    "/{story_id}",
    summary="Delete all images of a story from Cloudinary",
    tags=["images-v2"]
)
async def delete_story_images(story_id: str):
    try:
        await cloudinary_service.delete_story_images(story_id)
        return {"message": f"Successfully deleted all images for story {story_id}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

# ────────────────────────────────────────────────
# DELETE /v2/images  ─  모든 이미지 삭제
# ────────────────────────────────────────────────
@image_router.delete(
    "/",
    summary="Delete all images from Cloudinary",
    tags=["images-v2"]
)
async def delete_all_images():
    try:
        await cloudinary_service.delete_all_images()
        return {"message": "Successfully deleted all images"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

# ────────────────────────────────────────────────
# GET /v2/images/story-ids
# ────────────────────────────────────────────────
@image_router.get(
    "/story-ids",
    summary="List all story IDs",
    tags=["images-v2"],
    response_model=List[str]
)
async def get_story_ids():
    return await cloudinary_service.get_all_story_ids()

# ────────────────────────────────────────────────
# GET /v2/images/{story_id}
# ────────────────────────────────────────────────
@image_router.get(
    "/{story_id}",
    summary="Get all images for a story",
    tags=["images-v2"],
    response_model=List[Image]
)
async def get_story_images(story_id: str):
    return await cloudinary_service.get_story_images(story_id)

# ────────────────────────────────────────────────
# GET /v2/images
# ────────────────────────────────────────────────
@image_router.get(
    "/",
    summary="Get every image across all stories",
    tags=["images-v2"],
    response_model=List[Image]
)
async def get_images():
    return await cloudinary_service.get_all_images()
