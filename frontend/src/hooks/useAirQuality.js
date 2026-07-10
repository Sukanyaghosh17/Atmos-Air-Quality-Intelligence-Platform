/**
 * useAirQuality – custom hook fetching all dashboard data from the FastAPI backend.
 * Falls back to mock data if the backend is unreachable.
 */
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { MOCK_DATA } from "../data/mockData";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

async function safeFetch(url, fallback) {
  try {
    const { data } = await axios.get(url, { timeout: 4000 });
    return { data, error: null };
  } catch {
    return { data: fallback, error: "Using offline data" };
  }
}

export function useAirQuality(cityId = "delhi") {
  const [state, setState] = useState({
    current:        null,
    forecast:       null,
    trends:         null,
    dangerousHours: null,
    seasonal:       null,
    anomalies:      null,
    cities:         null,
    loading:        true,
    error:          null,
    trendPeriod:    "daily",
  });

  const fetchAll = useCallback(async (city, period = "daily") => {
    setState(s => ({ ...s, loading: true, error: null }));
    const mock = MOCK_DATA[city] ?? MOCK_DATA["delhi"];

    const [current, forecast, trends, dangerousHours, seasonal, anomalies, cities] =
      await Promise.all([
        safeFetch(`${BASE}/api/current/${city}`,          mock.current),
        safeFetch(`${BASE}/api/forecast/${city}`,         mock.forecast),
        safeFetch(`${BASE}/api/trends/${city}?period=${period}`, mock.trends[period]),
        safeFetch(`${BASE}/api/dangerous-hours/${city}`,  mock.dangerousHours),
        safeFetch(`${BASE}/api/seasonal/${city}`,         mock.seasonal),
        safeFetch(`${BASE}/api/anomalies/${city}`,        mock.anomalies),
        safeFetch(`${BASE}/api/cities`,                   mock.cities),
      ]);

    setState(s => ({
      ...s,
      current:        current.data,
      forecast:       forecast.data,
      trends:         trends.data,
      dangerousHours: dangerousHours.data,
      seasonal:       seasonal.data,
      anomalies:      anomalies.data,
      cities:         cities.data,
      loading:        false,
      error:          current.error,
      trendPeriod:    period,
    }));
  }, []);

  const changePeriod = useCallback((period) => {
    fetchAll(cityId, period);
  }, [cityId, fetchAll]);

  useEffect(() => {
    fetchAll(cityId, state.trendPeriod);
  }, [cityId]); // eslint-disable-line react-hooks/exhaustive-deps

  return { ...state, refetch: fetchAll, changePeriod };
}
