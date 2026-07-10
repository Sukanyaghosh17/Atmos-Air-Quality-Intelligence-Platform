import { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Area, AreaChart, ReferenceLine,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const PERIOD_LABELS = { daily: "Today (Hourly)", weekly: "This Week (Daily)", monthly: "This Year (Monthly)" };

const LINES = [
  { key: "aqi",  color: "#588157", label: "AQI",   width: 2.5 },
  { key: "pm25", color: "#ef4444", label: "PM2.5", width: 1.5 },
  { key: "pm10", color: "#f97316", label: "PM10",  width: 1.5 },
  { key: "no2",  color: "#a855f7", label: "NO₂",   width: 1.5 },
];

const CustomTooltip = ({ active, payload, label, dark }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={`px-3 py-2.5 rounded-xl border text-xs ${
      dark
        ? "bg-pine-400/95 border-fern-300/30 text-white backdrop-blur-sm"
        : "bg-white/95 border-sage-300/30 text-pine-DEFAULT backdrop-blur-sm"
    }`}>
      <p className="font-semibold mb-1.5 text-sage-300">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
          <span className="opacity-70">{p.name}:</span>
          <span className="font-semibold">{typeof p.value === "number" ? p.value.toFixed(1) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function TrendChart({ data, period, onPeriodChange, loading }) {
  const { dark } = useTheme();
  const [activeLines, setActiveLines] = useState({ aqi: true, pm25: true, pm10: false, no2: false });

  const toggleLine = key => setActiveLines(prev => ({ ...prev, [key]: !prev[key] }));

  const chartData = data?.data ?? [];
  const safeAqi = 100; // reference line

  if (loading || !data) {
    return (
      <div className={`rounded-2xl p-5 ${dark ? "glass-dark" : "glass-light"}`}>
        <div className="skeleton h-6 w-48 mb-4" />
        <div className="skeleton h-56 w-full" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      className={`rounded-2xl p-5 card-hover ${dark ? "glass-dark" : "glass-light"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-fern-DEFAULT" />
          <span className={`text-sm font-semibold ${dark ? "text-white" : "text-pine-DEFAULT"}`}>
            Pollution Trends — {PERIOD_LABELS[period]}
          </span>
        </div>

        {/* Period toggle */}
        <div className={`flex rounded-xl overflow-hidden border ${dark ? "border-white/12" : "border-sage-300/30"}`}>
          {["daily", "weekly", "monthly"].map(p => (
            <button
              key={p}
              id={`trend-${p}-btn`}
              onClick={() => onPeriodChange(p)}
              className={`px-3 py-1.5 text-xs font-medium transition-all capitalize
                ${period === p
                  ? "bg-fern-DEFAULT text-white"
                  : dark ? "text-white/60 hover:text-white hover:bg-white/8" : "text-pine-300/70 hover:text-pine-DEFAULT hover:bg-sage-100/50"
                }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Line toggles */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {LINES.map(l => (
          <button
            key={l.key}
            onClick={() => toggleLine(l.key)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all
              ${activeLines[l.key]
                ? "border-transparent"
                : dark ? "border-white/20 opacity-40" : "border-sage-300/30 opacity-40"
              }`}
            style={activeLines[l.key] ? { color: l.color, backgroundColor: `${l.color}18`, borderColor: `${l.color}40` } : {}}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
            {l.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            {LINES.map(l => (
              <linearGradient key={l.key} id={`grad-${l.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={l.color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={l.color} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={dark ? "rgba(255,255,255,0.06)" : "rgba(52,78,65,0.08)"} />
          <XAxis
            dataKey="label" tick={{ fontSize: 10, fill: dark ? "rgba(255,255,255,0.4)" : "rgba(52,78,65,0.5)" }}
            tickLine={false} axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: dark ? "rgba(255,255,255,0.4)" : "rgba(52,78,65,0.5)" }}
            tickLine={false} axisLine={false}
          />
          <Tooltip content={<CustomTooltip dark={dark} />} />
          <ReferenceLine y={safeAqi} stroke="#eab308" strokeDasharray="4 4" strokeWidth={1}
            label={{ value: "Safe AQI", position: "insideTopLeft", fontSize: 9, fill: "#eab308" }} />
          {LINES.map(l => activeLines[l.key] && (
            <Area
              key={l.key} type="monotone" dataKey={l.key} name={l.label}
              stroke={l.color} strokeWidth={l.width} fill={`url(#grad-${l.key})`}
              dot={false} activeDot={{ r: 4, fill: l.color }}
              isAnimationActive={true} animationDuration={800}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
