# Atmos — Air Quality Intelligence Platform

Atmos is a premium full-stack analytics platform built to monitor, analyze, and forecast air quality levels across major cities. Styled with a clean, earthy green design system, the dashboard features glassmorphism panels, interactive charts, and real-time anomaly detection logs.

## Tech Stack

* **Frontend**: React (Vite), Tailwind CSS, Recharts, Framer Motion, Lucide Icons
* **Backend**: Python FastAPI, Pydantic, Uvicorn

## Core Features

1. **Air Quality Index Hero Gauge**: An interactive semi-circular gauge displaying active AQI scores, category severity, weather conditions, and health advice.
2. **Pollutant Profiles**: Detailed normalization tiles tracking PM2.5, PM10, CO, NO₂, SO₂, and O₃ levels against standardized safety limits.
3. **Interactive 7-Day Forecast**: Predictive strip displaying temperature swings, daily peaks, and directional trend indicators.
4. **Dangerous Hours Timeline**: A diurnal 24-hour heat-map mapping critical pollution spike windows (e.g., morning and evening commute hours).
5. **Pollutant Footprint Radar**: Normalised multi-metric radar chart tracing overall pollution footprints.
6. **Seasonal Analysis**: Grouped comparative columns analyzing Summer, Monsoon, and Winter averages.
7. **Anomaly Detection Log**: Real-time event log tracking unexpected pollution spikes (e.g., crop burning, dust storms, industrial leaks) alongside deviation rates.
8. **Multi-City Environment**: Seamlessly toggle between cities (including Delhi, Mumbai, Bangalore, Chennai, Kolkata, New York, London, Beijing) to update analytical profiles instantly.

---

## Project Structure

```
atmos/
├── frontend/          # React + Vite + Tailwind CSS App
│   ├── src/
│   │   ├── components/    # Reusable gauge, cards, and charts
│   │   ├── contexts/      # Dark/Light mode theme state
│   │   ├── hooks/         # Custom API fetchers
│   │   ├── utils/         # AQI calculators & formatting
│   │   └── data/          # Offline-fallback datasets
│   └── ...
└── backend/           # FastAPI Python Application
    ├── main.py            # API entrypoint & CORS middleware
    ├── routers/           # Air quality endpoint routing
    ├── models/            # Pydantic schemas
    └── data/              # City-seeded dynamic generator
```

---

## Quick Start Setup

### 1. Run the Backend API
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # On Windows:
   .venv\Scripts\activate
   # On macOS/Linux:
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the development server:
   ```bash
   uvicorn main:app --reload
   ```
   *The API will be available at `http://localhost:8000` (auto-documentation at `http://localhost:8000/docs`).*

### 2. Run the Frontend
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Launch the Vite dev server:
   ```bash
   npm run dev
   ```
   *The client dashboard will open at `http://localhost:5173/`.*
