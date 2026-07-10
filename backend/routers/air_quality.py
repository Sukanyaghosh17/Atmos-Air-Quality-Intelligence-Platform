from fastapi import APIRouter, HTTPException
from typing import Literal

from models.schemas import (
    CurrentReading, ForecastResponse, TrendsResponse,
    DangerousHoursResponse, SeasonalResponse, AnomalyResponse, CitiesResponse,
)
from data.mock_generator import (
    CITIES, CITY_PROFILES,
    generate_current, generate_forecast, generate_trends,
    generate_dangerous_hours, generate_seasonal, generate_anomalies,
)

router = APIRouter(prefix="/api", tags=["Air Quality"])

VALID_CITIES = set(CITY_PROFILES.keys())


def _validate_city(city_id: str) -> str:
    cid = city_id.lower().replace(" ", "_")
    if cid not in VALID_CITIES:
        raise HTTPException(status_code=404, detail=f"City '{city_id}' not found.")
    return cid


@router.get("/cities", response_model=CitiesResponse)
def list_cities():
    """Return all supported cities."""
    return {"cities": CITIES}


@router.get("/current/{city_id}", response_model=CurrentReading)
def get_current(city_id: str):
    """Return current AQI and pollutant readings for a city."""
    cid = _validate_city(city_id)
    return generate_current(cid)


@router.get("/forecast/{city_id}", response_model=ForecastResponse)
def get_forecast(city_id: str):
    """Return 7-day AQI forecast for a city."""
    cid = _validate_city(city_id)
    return generate_forecast(cid)


@router.get("/trends/{city_id}", response_model=TrendsResponse)
def get_trends(
    city_id: str,
    period: Literal["daily", "weekly", "monthly"] = "daily"
):
    """Return pollution trend time-series (daily/weekly/monthly)."""
    cid = _validate_city(city_id)
    return generate_trends(cid, period)


@router.get("/dangerous-hours/{city_id}", response_model=DangerousHoursResponse)
def get_dangerous_hours(city_id: str):
    """Return dangerous hour windows and 24-hour AQI profile."""
    cid = _validate_city(city_id)
    return generate_dangerous_hours(cid)


@router.get("/seasonal/{city_id}", response_model=SeasonalResponse)
def get_seasonal(city_id: str):
    """Return seasonal (Summer / Monsoon / Winter) comparison data."""
    cid = _validate_city(city_id)
    return generate_seasonal(cid)


@router.get("/anomalies/{city_id}", response_model=AnomalyResponse)
def get_anomalies(city_id: str):
    """Return detected pollution anomalies and spikes."""
    cid = _validate_city(city_id)
    return generate_anomalies(cid)
