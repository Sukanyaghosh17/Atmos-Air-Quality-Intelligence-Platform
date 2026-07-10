from pydantic import BaseModel
from typing import List, Optional


# ─── Current Reading ──────────────────────────────────────────────────────────

class PollutantLevels(BaseModel):
    pm25: float
    pm10: float
    co: float
    no2: float
    so2: float
    o3: float


class CurrentReading(BaseModel):
    city: str
    aqi: int
    category: str          # Good / Moderate / Unhealthy / Hazardous …
    temperature: float
    humidity: float
    wind_speed: float
    pollutants: PollutantLevels
    updated_at: str


# ─── Forecast ─────────────────────────────────────────────────────────────────

class ForecastDay(BaseModel):
    date: str
    day_label: str         # "Mon", "Tue" …
    aqi: int
    category: str
    high: int
    low: int


class ForecastResponse(BaseModel):
    city: str
    tomorrow_aqi: int
    tomorrow_category: str
    days: List[ForecastDay]


# ─── Trends ───────────────────────────────────────────────────────────────────

class TrendPoint(BaseModel):
    label: str
    aqi: float
    pm25: float
    pm10: float
    no2: float
    so2: float
    co: float
    o3: float


class TrendsResponse(BaseModel):
    city: str
    period: str
    data: List[TrendPoint]


# ─── Dangerous Hours ──────────────────────────────────────────────────────────

class DangerWindow(BaseModel):
    start_hour: int
    end_hour: int
    avg_aqi: int
    peak_pollutant: str
    advice: str


class DangerousHoursResponse(BaseModel):
    city: str
    date: str
    windows: List[DangerWindow]
    hourly_aqi: List[int]   # 24 values, one per hour


# ─── Seasonal ─────────────────────────────────────────────────────────────────

class SeasonStats(BaseModel):
    season: str
    avg_aqi: float
    avg_pm25: float
    avg_pm10: float
    avg_no2: float
    avg_so2: float
    avg_o3: float
    worst_month: str
    best_month: str


class SeasonalResponse(BaseModel):
    city: str
    seasons: List[SeasonStats]


# ─── Anomalies ────────────────────────────────────────────────────────────────

class Anomaly(BaseModel):
    id: str
    timestamp: str
    pollutant: str
    observed: float
    expected: float
    deviation_pct: float
    severity: str          # Low / Medium / High / Critical
    cause: str
    description: str
    aqi_spike: int


class AnomalyResponse(BaseModel):
    city: str
    anomalies: List[Anomaly]


# ─── Cities ───────────────────────────────────────────────────────────────────

class City(BaseModel):
    id: str
    name: str
    country: str
    lat: float
    lon: float
    timezone: str


class CitiesResponse(BaseModel):
    cities: List[City]
