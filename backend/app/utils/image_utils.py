import os
import uuid
from datetime import datetime
from typing import List
from fastapi import UploadFile, HTTPException
from ..core.config import IMAGE_DIR, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE

async def validate_image(file: UploadFile) -> None:
    """Validate image file type and size"""
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: {ALLOWED_IMAGE_TYPES}"
        )
    
    # Check file size
    file.file.seek(0, 2)  # Seek to end
    size = file.file.tell()
    file.file.seek(0)  # Reset position
    
    if size > MAX_IMAGE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Max size: {MAX_IMAGE_SIZE/1024/1024}MB"
        )

async def save_upload_images(files: List[UploadFile]) -> List[str]:
    """Save uploaded images and return their paths"""
    if len(files) != 4:
        raise ValueError("Exactly 4 images required")
    
    saved_paths = []
    for file in files:
        await validate_image(file)
        
        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = str(uuid.uuid4())[:8]
        extension = os.path.splitext(file.filename)[1]
        filename = f"{timestamp}_{unique_id}{extension}"
        
        # Save file
        file_path = os.path.join(IMAGE_DIR, filename)
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        saved_paths.append(file_path)
    
    return saved_paths 