from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from bson import ObjectId
from .image import Image

class Story(BaseModel):
    story: str