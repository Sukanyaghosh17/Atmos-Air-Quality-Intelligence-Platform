/**
 * Offline fallback mock data – mirrors the FastAPI response shapes exactly.
 * Used when the backend is not running.
 */

const CITIES_LIST = {
  cities: [
    { id: "delhi",     name: "Delhi",     country: "India", lat: 28.6139, lon: 77.2090,  timezone: "Asia/Kolkata"   },
    { id: "mumbai",    name: "Mumbai",    country: "India", lat: 19.0760, lon: 72.8777,  timezone: "Asia/Kolkata"   },
    { id: "bangalore", name: "Bangalore", country: "India", lat: 12.9716, lon: 77.5946,  timezone: "Asia/Kolkata"   },
    { id: "chennai",   name: "Chennai",   country: "India", lat: 13.0827, lon: 80.2707,  timezone: "Asia/Kolkata"   },
    { id: "kolkata",   name: "Kolkata",   country: "India", lat: 22.5726, lon: 88.3639,  timezone: "Asia/Kolkata"   },
    { id: "beijing",   name: "Beijing",   country: "China", lat: 39.9042, lon: 116.4074, timezone: "Asia/Shanghai"  },
    { id: "london",    name: "London",    country: "UK",    lat: 51.5074, lon: -0.1278,  timezone: "Europe/London"  },
    { id: "new_york",  name: "New York",  country: "USA",   lat: 40.7128, lon: -74.0060, timezone: "America/New_York"},
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function rnd(min, max) { return +(Math.random() * (max - min) + min).toFixed(2); }
function rndInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function dateStr(offset = 0) {
  const d = new Date(); d.setDate(d.getDate() + offset);
  return d.toISOString().split("T")[0];
}
function dayLabel(offset) {
  const d = new Date(); d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("en", { weekday: "short" });
}
function tsNow(hoursAgo = 0) {
  const d = new Date(); d.setHours(d.getHours() - hoursAgo);
  return d.toISOString().replace("T", "T").split(".")[0];
}

// ── City profiles ─────────────────────────────────────────────────────────────
const PROFILES = {
  delhi:     { aqi: 185, pm25: 92,  pm10: 145, co: 4.2, no2: 72,  so2: 28, o3: 38 },
  mumbai:    { aqi: 118, pm25: 55,  pm10: 88,  co: 2.8, no2: 55,  so2: 18, o3: 42 },
  bangalore: { aqi: 92,  pm25: 38,  pm10: 68,  co: 1.9, no2: 40,  so2: 12, o3: 48 },
  chennai:   { aqi: 102, pm25: 44,  pm10: 78,  co: 2.2, no2: 45,  so2: 15, o3: 52 },
  kolkata:   { aqi: 155, pm25: 78,  pm10: 122, co: 3.6, no2: 65,  so2: 24, o3: 35 },
  beijing:   { aqi: 162, pm25: 82,  pm10: 130, co: 3.9, no2: 68,  so2: 35, o3: 40 },
  london:    { aqi: 48,  pm25: 18,  pm10: 32,  co: 0.8, no2: 28,  so2: 6,  o3: 55 },
  new_york:  { aqi: 62,  pm25: 22,  pm10: 38,  co: 1.1, no2: 32,  so2: 8,  o3: 60 },
};

function getCategory(aqi) {
  if (aqi <= 50)  return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

function buildCityData(city) {
  const p = PROFILES[city] ?? PROFILES.delhi;
  const v = k => +(p[k] * rnd(0.88, 1.12)).toFixed(2);

  // Current
  const current = {
    city, aqi: rndInt(p.aqi - 20, p.aqi + 20),
    category: getCategory(p.aqi),
    temperature: rnd(22, 36), humidity: rnd(45, 85), wind_speed: rnd(4, 18),
    pollutants: { pm25: v("pm25"), pm10: v("pm10"), co: v("co"), no2: v("no2"), so2: v("so2"), o3: v("o3") },
    updated_at: tsNow(0),
  };

  // Forecast 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const aqi = rndInt(p.aqi - 30, p.aqi + 40);
    return {
      date: dateStr(i + 1), day_label: dayLabel(i + 1), aqi,
      category: getCategory(aqi), high: aqi + rndInt(10, 25), low: Math.max(10, aqi - rndInt(10, 25)),
    };
  });
  const forecast = { city, tomorrow_aqi: days[0].aqi, tomorrow_category: days[0].category, days };

  // Trends
  const HOURS = Array.from({ length: 24 }, (_, h) => {
    const f = 1 + 0.45 * Math.exp(-0.5 * ((h - 8.5) / 2.5) ** 2) + 0.32 * Math.exp(-0.5 * ((h - 18.5) / 2) ** 2);
    return {
      label: `${String(h).padStart(2, "0")}:00`,
      aqi:   Math.round(p.aqi * f * rnd(0.9, 1.1)),
      pm25:  +(p.pm25 * f * rnd(0.9, 1.1)).toFixed(1),
      pm10:  +(p.pm10 * f * rnd(0.9, 1.1)).toFixed(1),
      no2:   +(p.no2  * f * rnd(0.9, 1.1)).toFixed(1),
      so2:   +(p.so2  * f * rnd(0.9, 1.1)).toFixed(1),
      co:    +(p.co   * f * rnd(0.9, 1.1)).toFixed(2),
      o3:    +(p.o3   * f * rnd(0.9, 1.1)).toFixed(1),
    };
  });

  const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const WEEKLY = WEEK_DAYS.map(label => {
    const wf = label === "Sat" || label === "Sun" ? 0.85 : 1.0;
    return {
      label, aqi: Math.round(p.aqi * wf * rnd(0.85, 1.15)),
      pm25: +(p.pm25 * wf * rnd(0.85, 1.15)).toFixed(1),
      pm10: +(p.pm10 * wf * rnd(0.85, 1.15)).toFixed(1),
      no2:  +(p.no2  * wf * rnd(0.85, 1.15)).toFixed(1),
      so2:  +(p.so2  * wf * rnd(0.85, 1.15)).toFixed(1),
      co:   +(p.co   * wf * rnd(0.85, 1.15)).toFixed(2),
      o3:   +(p.o3   * wf * rnd(0.85, 1.15)).toFixed(1),
    };
  });

  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const MONTHLY = MONTHS.map((label, i) => {
    const sf = 1 + 0.4 * Math.cos(Math.PI * (i - 11) / 6);
    return {
      label, aqi: Math.round(p.aqi * sf * rnd(0.9, 1.1)),
      pm25: +(p.pm25 * sf * rnd(0.9, 1.1)).toFixed(1),
      pm10: +(p.pm10 * sf * rnd(0.9, 1.1)).toFixed(1),
      no2:  +(p.no2  * sf * rnd(0.9, 1.1)).toFixed(1),
      so2:  +(p.so2  * sf * rnd(0.9, 1.1)).toFixed(1),
      co:   +(p.co   * sf * rnd(0.9, 1.1)).toFixed(2),
      o3:   +(p.o3   * sf * rnd(0.9, 1.1)).toFixed(1),
    };
  });

  const trends = { daily: { city, period: "daily", data: HOURS }, weekly: { city, period: "weekly", data: WEEKLY }, monthly: { city, period: "monthly", data: MONTHLY } };

  // Dangerous hours
  const hourlyAqi = HOURS.map(h => h.aqi);
  const dangerousHours = {
    city, date: dateStr(0),
    windows: [
      { start_hour: 6, end_hour: 10, avg_aqi: Math.round(hourlyAqi.slice(6, 10).reduce((a, b) => a + b, 0) / 4), peak_pollutant: "PM2.5", advice: "Avoid outdoor exercise. Wear N95 mask if going out." },
      { start_hour: 17, end_hour: 21, avg_aqi: Math.round(hourlyAqi.slice(17, 21).reduce((a, b) => a + b, 0) / 4), peak_pollutant: "NO₂",   advice: "Evening rush-hour spike. Keep windows closed indoors." },
    ],
    hourly_aqi: hourlyAqi,
  };

  // Seasonal
  const SEASON_MULTS = { Summer: 1.2, Monsoon: 0.6, Winter: 1.8 };
  const seasonal = {
    city,
    seasons: ["Summer", "Monsoon", "Winter"].map(s => ({
      season: s,
      avg_aqi:  +(p.aqi  * SEASON_MULTS[s] * rnd(0.92, 1.08)).toFixed(1),
      avg_pm25: +(p.pm25 * SEASON_MULTS[s] * rnd(0.92, 1.08)).toFixed(1),
      avg_pm10: +(p.pm10 * SEASON_MULTS[s] * rnd(0.92, 1.08)).toFixed(1),
      avg_no2:  +(p.no2  * SEASON_MULTS[s] * rnd(0.92, 1.08)).toFixed(1),
      avg_so2:  +(p.so2  * SEASON_MULTS[s] * rnd(0.92, 1.08)).toFixed(1),
      avg_o3:   +(p.o3   * SEASON_MULTS[s] * rnd(0.92, 1.08)).toFixed(1),
      worst_month: { Summer: "May", Monsoon: "August", Winter: "December" }[s],
      best_month:  { Summer: "March", Monsoon: "July", Winter: "November" }[s],
    })),
  };

  // Anomalies
  const CAUSES = [
    { pollutant: "PM2.5", cause: "Crop Burning",      description: "Agricultural residue burning detected in surrounding districts.",       severity: "High"     },
    { pollutant: "SO₂",   cause: "Industrial Leak",   description: "Elevated sulfur readings suggest an industrial emission event.",        severity: "Critical" },
    { pollutant: "NO₂",   cause: "Traffic Surge",     description: "Unusually high vehicular density detected on arterial roads.",          severity: "Medium"   },
    { pollutant: "PM10",  cause: "Dust Storm",        description: "Meteorological dust storm activity caused sharp particulate spike.",    severity: "High"     },
    { pollutant: "CO",    cause: "Wildfire Smoke",    description: "Wind-carried smoke from a regional wildfire elevated CO levels.",       severity: "High"     },
  ];
  const anomalies = {
    city,
    anomalies: CAUSES.map((c, i) => {
      const expected = rnd(p[c.pollutant.toLowerCase().replace("₂","2").replace("₃","3")] ?? 30, (p[c.pollutant.toLowerCase().replace("₂","2").replace("₃","3")] ?? 30) * 1.1);
      const devPct   = rnd(20, 140);
      const observed = +(expected * (1 + devPct / 100)).toFixed(2);
      return {
        id: `${city}-anomaly-${i}`,
        timestamp: tsNow(rndInt(2, 60)),
        pollutant: c.pollutant,
        observed, expected: +expected.toFixed(2), deviation_pct: +devPct.toFixed(1),
        severity: c.severity, cause: c.cause, description: c.description,
        aqi_spike: rndInt(p.aqi + 30, p.aqi + 120),
      };
    }),
  };

  return { current, forecast, trends, dangerousHours, seasonal, anomalies, cities: CITIES_LIST };
}

// Build data for all cities
export const MOCK_DATA = Object.fromEntries(
  Object.keys(PROFILES).map(city => [city, buildCityData(city)])
);
