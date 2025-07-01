from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.v1 import openai
from .db.mongodb import db

app = FastAPI(
    title="Moment4U API",
    description="API for generating stories from images using PaLI-Gemma and OpenAI",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Event handlers
@app.on_event("startup")
async def startup_event():
    db.connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    db.close_mongo_connection()

app.include_router(openai.router, prefix="/api/openai", tags=["openai"]) 