# backend/app/main.py
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .api.v1.router import router
from .api.v2.router import v2_router
from .db.mongodb import db

# ------------------------------------------------------------------
# 1) FastAPI 생성 전에 경로 상수만 준비
# ------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent  # backend/

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect_to_mongo()
    yield
    db.close_mongo_connection()

# ------------------------------------------------------------------
# 2) FastAPI 인스턴스 생성
# ------------------------------------------------------------------
app = FastAPI(
    title="Moment4U API",
    description="API for generating stories from images using PaLI-Gemma and OpenAI",
    version="1.0.0",
    lifespan=lifespan,
)

# ------------------------------------------------------------------
# 3) CORS 미들웨어
# ------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------------
# 4) 정적 이미지 폴더 마운트  ← **여기가 핵심**
#     /images/stories/... → backend/images/stories/...
# ------------------------------------------------------------------
app.mount(
    "/images",                                 # URL prefix
    StaticFiles(directory=BASE_DIR / "images"),
    name="images",
)

# ------------------------------------------------------------------
# 5) 라우터 등록
# ------------------------------------------------------------------
app.include_router(router)
app.include_router(v2_router)
