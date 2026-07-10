"""
mock_generator.py
Generates realistic, city-seeded mock environmental data for all API endpoints.
Each city gets deterministic-but-varied readings based on its pollution profile.
"""
import random
import math
from datetime import datetime, timedelta
from typing import List

# ─── City pollution profiles ──────────────────────────────────────────────────
# base_aqi drives overall pollution level; season multipliers vary by climate
CITY_PROFILES = {
    "delhi": {
        "base_aqi": 185, "pm25_base": 95, "pm10_base": 145,
        "co_base": 4.2, "no2_base": 72, "so2_base": 28, "o3_base": 38,
        "season_mult": {"Summer": 1.2, "Monsoon": 0.6, "Winter": 1.8},
    },
    "mumbai": {
        "base_aqi": 118, "pm25_base": 55, "pm10_base": 88,
        "co_base": 2.8, "no2_base": 55, "so2_base": 18, "o3_base": 42,
        "season_mult": {"Summer": 1.1, "Monsoon": 0.5, "Winter": 1.3},
    },
    "bangalore": {
        "base_aqi": 92, "pm25_base": 38, "pm10_base": 68,
        "co_base": 1.9, "no2_base": 40, "so2_base": 12, "o3_base": 48,
        "season_mult": {"Summer": 1.05, "Monsoon": 0.7, "Winter": 1.1},
    },
    "chennai": {
        "base_aqi": 102, "pm25_base": 44, "pm10_base": 78,
        "co_base": 2.2, "no2_base": 45, "so2_base": 15, "o3_base": 52,
        "season_mult": {"Summer": 1.15, "Monsoon": 0.55, "Winter": 1.1},
    },
    "kolkata": {
        "base_aqi": 155, "pm25_base": 78, "pm10_base": 122,
        "co_base": 3.6, "no2_base": 65, "so2_base": 24, "o3_base": 35,
        "season_mult": {"Summer": 1.1, "Monsoon": 0.65, "Winter": 1.6},
    },
    "beijing": {
        "base_aqi": 162, "pm25_base": 82, "pm10_base": 130,
        "co_base": 3.9, "no2_base": 68, "so2_base": 35, "o3_base": 40,
        "season_mult": {"Summer": 1.0, "Monsoon": 0.8, "Winter": 1.7},
    },
    "london": {
        "base_aqi": 48, "pm25_base": 18, "pm10_base": 32,
        "co_base": 0.8, "no2_base": 28, "so2_base": 6, "o3_base": 55,
        "season_mult": {"Summer": 1.1, "Monsoon": 0.9, "Winter": 1.2},
    },
    "new_york": {
        "base_aqi": 62, "pm25_base": 22, "pm10_base": 38,
        "co_base": 1.1, "no2_base": 32, "so2_base": 8, "o3_base": 60,
        "season_mult": {"Summer": 1.25, "Monsoon": 0.85, "Winter": 1.1},
    },
}

CITIES = [
    {"id": "delhi",    "name": "Delhi",    "country": "India",   "lat": 28.6139, "lon": 77.2090, "timezone": "Asia/Kolkata"},
    {"id": "mumbai",   "name": "Mumbai",   "country": "India",   "lat": 19.0760, "lon": 72.8777, "timezone": "Asia/Kolkata"},
    {"id": "bangalore","name": "Bangalore","country": "India",   "lat": 12.9716, "lon": 77.5946, "timezone": "Asia/Kolkata"},
    {"id": "chennai",  "name": "Chennai",  "country": "India",   "lat": 13.0827, "lon": 80.2707, "timezone": "Asia/Kolkata"},
    {"id": "kolkata",  "name": "Kolkata",  "country": "India",   "lat": 22.5726, "lon": 88.3639, "timezone": "Asia/Kolkata"},
    {"id": "beijing",  "name": "Beijing",  "country": "China",   "lat": 39.9042, "lon": 116.4074,"timezone": "Asia/Shanghai"},
    {"id": "london",   "name": "London",   "country": "UK",      "lat": 51.5074, "lon": -0.1278, "timezone": "Europe/London"},
    {"id": "new_york", "name": "New York", "country": "USA",     "lat": 40.7128, "lon": -74.0060,"timezone": "America/New_York"},
]

AQI_CATEGORIES = [
    (50,  "Good",                "#22c55e"),
    (100, "Moderate",            "#eab308"),
    (150, "Unhealthy for Sensitive Groups", "#f97316"),
    (200, "Unhealthy",           "#ef4444"),
    (300, "Very Unhealthy",      "#a855f7"),
    (500, "Hazardous",           "#7f1d1d"),
]

DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]


def get_category(aqi: int) -> str:
    for threshold, label, _ in AQI_CATEGORIES:
        if aqi <= threshold:
            return label
    return "Hazardous"


def _rng(city_id: str, salt: str = "") -> random.Random:
    """Deterministic RNG seeded by city + salt for repeatable mock data."""
    seed = hash(city_id + salt) & 0x7FFFFFFF
    return random.Random(seed)


def _jitter(rng: random.Random, val: float, pct: float = 0.12) -> float:
    """Add ±pct% noise to a value."""
    return round(val * (1 + rng.uniform(-pct, pct)), 2)


# ─── Current Reading ──────────────────────────────────────────────────────────

def generate_current(city_id: str) -> dict:
    p = CITY_PROFILES.get(city_id, CITY_PROFILES["delhi"])
    rng = _rng(city_id, "current")
    aqi = max(10, int(_jitter(rng, p["base_aqi"], 0.15)))
    return {
        "city": city_id,
        "aqi": aqi,
        "category": get_category(aqi),
        "temperature": round(_jitter(rng, 28.0, 0.3), 1),
        "humidity": round(_jitter(rng, 62.0, 0.25), 1),
        "wind_speed": round(_jitter(rng, 8.5, 0.4), 1),
        "pollutants": {
            "pm25": max(2.0, _jitter(rng, p["pm25_base"], 0.2)),
            "pm10": max(5.0, _jitter(rng, p["pm10_base"], 0.2)),
            "co":   max(0.1, _jitter(rng, p["co_base"],   0.3)),
            "no2":  max(2.0, _jitter(rng, p["no2_base"],  0.2)),
            "so2":  max(1.0, _jitter(rng, p["so2_base"],  0.25)),
            "o3":   max(2.0, _jitter(rng, p["o3_base"],   0.2)),
        },
        "updated_at": datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
    }


# ─── Forecast ─────────────────────────────────────────────────────────────────

def generate_forecast(city_id: str) -> dict:
    p = CITY_PROFILES.get(city_id, CITY_PROFILES["delhi"])
    rng = _rng(city_id, "forecast")
    today = datetime.now()
    days = []
    for i in range(1, 8):
        d = today + timedelta(days=i)
        base = p["base_aqi"]
        # weekly pattern – weekends slightly lower
        weekend_factor = 0.85 if d.weekday() >= 5 else 1.0
        noise = rng.uniform(0.82, 1.18)
        aqi = max(10, int(base * weekend_factor * noise))
        spread = int(aqi * 0.18)
        days.append({
            "date": d.strftime("%Y-%m-%d"),
            "day_label": d.strftime("%a"),
            "aqi": aqi,
            "category": get_category(aqi),
            "high": aqi + spread,
            "low":  max(10, aqi - spread),
        })
    tomorrow = days[0]
    return {
        "city": city_id,
        "tomorrow_aqi": tomorrow["aqi"],
        "tomorrow_category": tomorrow["category"],
        "days": days,
    }


# ─── Trends ───────────────────────────────────────────────────────────────────

def generate_trends(city_id: str, period: str = "daily") -> dict:
    p = CITY_PROFILES.get(city_id, CITY_PROFILES["delhi"])
    rng = _rng(city_id, f"trends-{period}")
    today = datetime.now()

    if period == "daily":
        points = []
        for h in range(0, 24):
            # diurnal pattern: high rush-hours (7-10, 17-20), low at night
            hour_factor = 1.0 + 0.4 * math.exp(-0.5 * ((h - 8.5) / 2.5) ** 2) \
                              + 0.3 * math.exp(-0.5 * ((h - 18.5) / 2.0) ** 2)
            aqi = max(10, int(p["base_aqi"] * hour_factor * rng.uniform(0.9, 1.1)))
            points.append({
                "label": f"{h:02d}:00",
                "aqi":   aqi,
                "pm25":  max(1, _jitter(rng, p["pm25_base"] * hour_factor, 0.1)),
                "pm10":  max(2, _jitter(rng, p["pm10_base"] * hour_factor, 0.1)),
                "no2":   max(1, _jitter(rng, p["no2_base"]  * hour_factor, 0.1)),
                "so2":   max(0.5, _jitter(rng, p["so2_base"] * hour_factor, 0.1)),
                "co":    max(0.1, _jitter(rng, p["co_base"]  * hour_factor, 0.1)),
                "o3":    max(1, _jitter(rng, p["o3_base"]   * hour_factor, 0.1)),
            })

    elif period == "weekly":
        points = []
        for i in range(7):
            d = today - timedelta(days=6 - i)
            wf = 0.85 if d.weekday() >= 5 else 1.0
            aqi = max(10, int(p["base_aqi"] * wf * rng.uniform(0.85, 1.15)))
            points.append({
                "label": d.strftime("%a"),
                "aqi":   aqi,
                "pm25":  max(1, _jitter(rng, p["pm25_base"] * wf, 0.15)),
                "pm10":  max(2, _jitter(rng, p["pm10_base"] * wf, 0.15)),
                "no2":   max(1, _jitter(rng, p["no2_base"]  * wf, 0.15)),
                "so2":   max(0.5, _jitter(rng, p["so2_base"] * wf, 0.15)),
                "co":    max(0.1, _jitter(rng, p["co_base"]  * wf, 0.15)),
                "o3":    max(1, _jitter(rng, p["o3_base"]   * wf, 0.15)),
            })

    else:  # monthly
        points = []
        for i in range(12):
            month = datetime(today.year, i + 1, 1)
            # seasonal curve for India: peak winter (Dec-Feb), low monsoon (Jun-Sep)
            month_idx = i  # 0=Jan
            seasonal = 1.0 + 0.4 * math.cos(math.pi * (month_idx - 11) / 6)
            aqi = max(10, int(p["base_aqi"] * seasonal * rng.uniform(0.9, 1.1)))
            points.append({
                "label": month.strftime("%b"),
                "aqi":   aqi,
                "pm25":  max(1, _jitter(rng, p["pm25_base"] * seasonal, 0.1)),
                "pm10":  max(2, _jitter(rng, p["pm10_base"] * seasonal, 0.1)),
                "no2":   max(1, _jitter(rng, p["no2_base"]  * seasonal, 0.1)),
                "so2":   max(0.5, _jitter(rng, p["so2_base"] * seasonal, 0.1)),
                "co":    max(0.1, _jitter(rng, p["co_base"]  * seasonal, 0.1)),
                "o3":    max(1, _jitter(rng, p["o3_base"]   * seasonal, 0.1)),
            })

    return {"city": city_id, "period": period, "data": points}


# ─── Dangerous Hours ──────────────────────────────────────────────────────────

def generate_dangerous_hours(city_id: str) -> dict:
    p = CITY_PROFILES.get(city_id, CITY_PROFILES["delhi"])
    rng = _rng(city_id, "danger")
    hourly = []
    for h in range(24):
        factor = 1.0 + 0.45 * math.exp(-0.5 * ((h - 8.5) / 2.5) ** 2) \
                     + 0.35 * math.exp(-0.5 * ((h - 18.5) / 2.0) ** 2)
        aqi = max(10, int(p["base_aqi"] * factor * rng.uniform(0.9, 1.1)))
        hourly.append(aqi)

    windows = [
        {
            "start_hour": 6, "end_hour": 10,
            "avg_aqi": int(sum(hourly[6:10]) / 4),
            "peak_pollutant": "PM2.5",
            "advice": "Avoid outdoor exercise. Use N95 mask if going out.",
        },
        {
            "start_hour": 17, "end_hour": 21,
            "avg_aqi": int(sum(hourly[17:21]) / 4),
            "peak_pollutant": "NO₂",
            "advice": "Evening rush-hour spike. Keep windows closed indoors.",
        },
    ]
    return {
        "city": city_id,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "windows": windows,
        "hourly_aqi": hourly,
    }


# ─── Seasonal ─────────────────────────────────────────────────────────────────

SEASONS = ["Summer", "Monsoon", "Winter"]
WORST_MONTHS  = {"Summer": "May", "Monsoon": "August", "Winter": "December"}
BEST_MONTHS   = {"Summer": "March", "Monsoon": "July", "Winter": "November"}

def generate_seasonal(city_id: str) -> dict:
    p = CITY_PROFILES.get(city_id, CITY_PROFILES["delhi"])
    rng = _rng(city_id, "seasonal")
    seasons = []
    for s in SEASONS:
        m = p["season_mult"][s]
        seasons.append({
            "season": s,
            "avg_aqi":  round(_jitter(rng, p["base_aqi"]   * m, 0.08), 1),
            "avg_pm25": round(_jitter(rng, p["pm25_base"]  * m, 0.08), 1),
            "avg_pm10": round(_jitter(rng, p["pm10_base"]  * m, 0.08), 1),
            "avg_no2":  round(_jitter(rng, p["no2_base"]   * m, 0.08), 1),
            "avg_so2":  round(_jitter(rng, p["so2_base"]   * m, 0.08), 1),
            "avg_o3":   round(_jitter(rng, p["o3_base"]    * m, 0.08), 1),
            "worst_month": WORST_MONTHS[s],
            "best_month":  BEST_MONTHS[s],
        })
    return {"city": city_id, "seasons": seasons}


# ─── Anomalies ────────────────────────────────────────────────────────────────

ANOMALY_CAUSES = [
    ("Crop burning",    "PM2.5",  "Agricultural residue burning detected in surrounding districts."),
    ("Industrial leak", "SO₂",   "Elevated sulfur readings suggest industrial emission event."),
    ("Traffic surge",   "NO₂",   "Unusually high vehicular density detected on arterial roads."),
    ("Dust storm",      "PM10",  "Meteorological dust storm activity caused sharp particulate spike."),
    ("Festival fireworks","PM2.5","Fireworks usage during festival period caused overnight PM2.5 surge."),
    ("Power plant",     "SO₂",   "Thermal power plant load surge correlated with SO₂ anomaly."),
    ("Wildfire smoke",  "CO",    "Wind-carried smoke from regional wildfire elevated CO levels."),
]

SEVERITY_THRESHOLDS = [
    (25,  "Low"),
    (50,  "Medium"),
    (100, "High"),
    (999, "Critical"),
]

def get_severity(dev_pct: float) -> str:
    for t, s in SEVERITY_THRESHOLDS:
        if dev_pct < t:
            return s
    return "Critical"

def generate_anomalies(city_id: str) -> dict:
    p = CITY_PROFILES.get(city_id, CITY_PROFILES["delhi"])
    rng = _rng(city_id, "anomalies")
    anomalies = []
    now = datetime.now()
    for i in range(5):
        hours_ago = rng.randint(2, 72)
        ts = now - timedelta(hours=hours_ago)
        cause, pollutant, desc = ANOMALY_CAUSES[rng.randint(0, len(ANOMALY_CAUSES) - 1)]
        base_field = {
            "PM2.5": p["pm25_base"], "SO₂": p["so2_base"],
            "NO₂":  p["no2_base"],  "PM10": p["pm10_base"],
            "CO":   p["co_base"],   "O₃":  p["o3_base"],
        }.get(pollutant, p["pm25_base"])
        expected = round(_jitter(rng, base_field, 0.05), 2)
        dev_pct  = round(rng.uniform(20, 150), 1)
        observed = round(expected * (1 + dev_pct / 100), 2)
        aqi_spike = max(10, int(p["base_aqi"] * (1 + dev_pct / 200)))
        anomalies.append({
            "id": f"{city_id}-anomaly-{i}",
            "timestamp": ts.strftime("%Y-%m-%dT%H:%M:%S"),
            "pollutant": pollutant,
            "observed": observed,
            "expected": expected,
            "deviation_pct": dev_pct,
            "severity": get_severity(dev_pct),
            "cause": cause,
            "description": desc,
            "aqi_spike": aqi_spike,
        })
    # sort most recent first
    anomalies.sort(key=lambda a: a["timestamp"], reverse=True)
    return {"city": city_id, "anomalies": anomalies}
