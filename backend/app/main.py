from dotenv import load_dotenv



load_dotenv()



from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware



from app.api.v1.api import api_router





app = FastAPI(
    title="NexoraMart API",
    version="0.1.0",
    description="Backend API for the NexoraMart e-commerce platform.",
)





app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)





app.include_router(api_router, prefix="/api/v1")





@app.get("/")
def root():
    return {
        "message": "Welcome to the NexoraMart API",
        "docs": "/docs",
        "health": "/health",
    }





@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "NexoraMart API",
        "environment": "development",
    }