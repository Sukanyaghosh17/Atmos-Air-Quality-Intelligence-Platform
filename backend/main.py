"""
Atmos – Air Quality Intelligence Platform
FastAPI application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.air_quality import router as aq_router

app = FastAPI(
    title="Atmos – Air Quality Intelligence API",
    description="Mock API serving realistic air quality data for the Atmos platform.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Allow the Vite dev server (port 5173) and any localhost origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(aq_router)


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "service": "Atmos Air Quality API", "version": "1.0.0"}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}
