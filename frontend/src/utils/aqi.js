/**
 * AQI utility functions: colour coding, label mapping, health advice.
 */

export const AQI_BANDS = [
  { max: 50,  label: "Good",                          color: "#22c55e", bg: "rgba(34,197,94,0.15)",   text: "Air quality is satisfactory. Enjoy outdoor activities." },
  { max: 100, label: "Moderate",                      color: "#eab308", bg: "rgba(234,179,8,0.15)",   text: "Acceptable air quality. Sensitive individuals should limit prolonged outdoor exertion." },
  { max: 150, label: "Unhealthy for Sensitive Groups", color: "#f97316", bg: "rgba(249,115,22,0.15)", text: "Members of sensitive groups may experience health effects." },
  { max: 200, label: "Unhealthy",                     color: "#ef4444", bg: "rgba(239,68,68,0.15)",   text: "Everyone may begin to experience health effects. Sensitive groups: serious effects." },
  { max: 300, label: "Very Unhealthy",                color: "#a855f7", bg: "rgba(168,85,247,0.15)",  text: "Health alert: everyone may experience serious health effects." },
  { max: 500, label: "Hazardous",                     color: "#dc2626", bg: "rgba(220,38,38,0.15)",   text: "Emergency conditions. Everyone is more likely to be affected. Stay indoors." },
];

export function getAQIBand(aqi) {
  return AQI_BANDS.find(b => aqi <= b.max) ?? AQI_BANDS[AQI_BANDS.length - 1];
}

export function getAQIColor(aqi) {
  return getAQIBand(aqi).color;
}

export function getAQILabel(aqi) {
  return getAQIBand(aqi).label;
}

export function getAQIAdvice(aqi) {
  return getAQIBand(aqi).text;
}

export function getAQIBg(aqi) {
  return getAQIBand(aqi).bg;
}

/** Normalise a pollutant value to 0–100 for radar charts */
export const POLLUTANT_MAXES = {
  pm25: 300,
  pm10: 600,
  co:   15,
  no2:  200,
  so2:  100,
  o3:   200,
};

export function normalisePollutant(key, value) {
  const max = POLLUTANT_MAXES[key] ?? 500;
  return Math.min(100, Math.round((value / max) * 100));
}

export const POLLUTANT_LABELS = {
  pm25: "PM2.5",
  pm10: "PM10",
  co:   "CO",
  no2:  "NO₂",
  so2:  "SO₂",
  o3:   "O₃",
};

export const POLLUTANT_UNITS = {
  pm25: "μg/m³",
  pm10: "μg/m³",
  co:   "mg/m³",
  no2:  "μg/m³",
  so2:  "μg/m³",
  o3:   "μg/m³",
};

export const POLLUTANT_SAFE_LIMITS = {
  pm25: 25,
  pm10: 50,
  co:   4,
  no2:  40,
  so2:  20,
  o3:   100,
};

export function formatAQI(val) {
  return Number.isFinite(val) ? Math.round(val).toString() : "--";
}

export function formatValue(val, decimals = 1) {
  return Number.isFinite(val) ? val.toFixed(decimals) : "--";
}

/** Severity colour for anomaly badges */
export const SEVERITY_COLORS = {
  Low:      { text: "#a3b18a", bg: "rgba(163,177,138,0.15)", border: "rgba(163,177,138,0.35)" },
  Medium:   { text: "#eab308", bg: "rgba(234,179,8,0.15)",   border: "rgba(234,179,8,0.35)"   },
  High:     { text: "#f97316", bg: "rgba(249,115,22,0.15)",  border: "rgba(249,115,22,0.35)"  },
  Critical: { text: "#ef4444", bg: "rgba(239,68,68,0.15)",   border: "rgba(239,68,68,0.35)"   },
};

export function getSeverityStyle(severity) {
  return SEVERITY_COLORS[severity] ?? SEVERITY_COLORS["Low"];
}
