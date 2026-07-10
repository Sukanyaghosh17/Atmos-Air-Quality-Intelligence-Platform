import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { POLLUTANT_LABELS, POLLUTANT_UNITS, POLLUTANT_SAFE_LIMITS, POLLUTANT_MAXES } from "../../utils/aqi";

const POLLUTANT_ICONS = {
  pm25: "🌫️", pm10: "💨", co: "🔥", no2: "🚗", so2: "🏭", o3: "☀️",
};

const POLLUTANT_COLORS = {
  pm25: "#ef4444", pm10: "#f97316", co: "#eab308",
  no2:  "#a855f7", so2:  "#06b6d4", o3:  "#22c55e",
};

function MiniBar({ value, max, color, safe }) {
  const pct = Math.min((value / max) * 100, 100);
  const safePct = Math.min((safe / max) * 100, 100);
  return (
    <div className="relative h-1.5 w-full rounded-full bg-white/10 overflow-visible">
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }} animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      {/* Safe limit marker */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-white/40 rounded-full"
        style={{ left: `${safePct}%` }}
        title={`Safe: ${safe}`}
      />
    </div>
  );
}

export default function PollutantCard({ pollutants, loading }) {
  const { dark } = useTheme();

  if (loading || !pollutants) {
    return (
      <div className={`rounded-2xl p-5 ${dark ? "glass-dark" : "glass-light"} grid grid-cols-2 sm:grid-cols-3 gap-3`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {Object.entries(pollutants).map(([key, value], i) => {
        const color = POLLUTANT_COLORS[key];
        const safe  = POLLUTANT_SAFE_LIMITS[key];
        const max   = POLLUTANT_MAXES[key];
        const over  = value > safe;
        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            className={`rounded-xl p-4 card-hover ${dark ? "glass-dark" : "glass-light"}`}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-base">{POLLUTANT_ICONS[key]}</span>
              {over && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                  HIGH
                </span>
              )}
            </div>
            <div className="mb-1">
              <span
                className="text-xl font-bold font-mono"
                style={{ color }}
              >
                {typeof value === "number" ? (key === "co" ? value.toFixed(2) : value.toFixed(1)) : "--"}
              </span>
              <span className={`text-[10px] ml-1 ${dark ? "text-white/40" : "text-pine-300/60"}`}>
                {POLLUTANT_UNITS[key]}
              </span>
            </div>
            <div className={`text-[11px] font-medium mb-2 ${dark ? "text-white/70" : "text-pine-DEFAULT"}`}>
              {POLLUTANT_LABELS[key]}
            </div>
            <MiniBar value={value} max={max} color={color} safe={safe} />
            <div className={`text-[9px] mt-1 ${dark ? "text-white/30" : "text-pine-300/50"}`}>
              Safe ≤ {safe} {POLLUTANT_UNITS[key]}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
