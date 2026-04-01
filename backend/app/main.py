from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, create_engine, Session
import os
from dotenv import load_dotenv

from app.db import create_db_and_tables, engine
from app.routes import products

load_dotenv()

app = FastAPI(title="Rural Entrepreneurship Platform API")

# Configure CORS (Important for your React frontend)
origins = [
    "http://localhost:5173", # Vite default
    "http://localhost:8000", # Accessing Swagger etc locally
    "https://your-netlify-site.netlify.app", # Adjust later
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root Endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to Rural Entrepreneurship Platform API - Use /docs for documentation"}

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Include Routers
app.include_router(products.router, prefix="/api/products", tags=["Products"])
# app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
