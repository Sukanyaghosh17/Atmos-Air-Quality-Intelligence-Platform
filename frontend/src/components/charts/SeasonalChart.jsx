import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Cell,
} from "recharts";
import { Leaf } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const SEASON_COLORS = {
  Summer:  { fill: "#f97316", bg: "rgba(249,115,22,0.15)",  border: "rgba(249,115,22,0.4)"  },
  Monsoon: { fill: "#06b6d4", bg: "rgba(6,182,212,0.15)",   border: "rgba(6,182,212,0.4)"   },
  Winter:  { fill: "#a855f7", bg: "rgba(168,85,247,0.15)",  border: "rgba(168,85,247,0.4)"  },
};

const SEASON_ICONS = { Summer: "☀️", Monsoon: "🌧️", Winter: "❄️" };

const CustomTooltip = ({ active, payload, label, dark }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={`px-3 py-2.5 rounded-xl border text-xs backdrop-blur-sm ${
      dark ? "bg-pine-400/95 border-fern-300/30 text-white" : "bg-white/95 border-sage-300/30 text-pine-DEFAULT"
    }`}>
      <p className="font-semibold mb-1.5">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.fill }} />
          <span className="opacity-70">{p.name}:</span>
          <span className="font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function SeasonalChart({ data, loading }) {
  const { dark } = useTheme();

  if (loading || !data) {
    return (
      <div className={`rounded-2xl p-5 ${dark ? "glass-dark" : "glass-light"}`}>
        <div className="skeleton h-6 w-48 mb-4" />
        <div className="skeleton h-56 w-full" />
      </div>
    );
  }

  const seasons = data.seasons ?? [];

  // Build chart data – one object per metric
  const metrics = ["avg_aqi", "avg_pm25", "avg_pm10", "avg_no2"];
  const metricLabels = { avg_aqi: "AQI", avg_pm25: "PM2.5", avg_pm10: "PM10", avg_no2: "NO₂" };

  const chartData = metrics.map(m => {
    const obj = { metric: metricLabels[m] };
    seasons.forEach(s => { obj[s.season] = parseFloat(s[m]); });
    return obj;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
      className={`rounded-2xl p-5 card-hover ${dark ? "glass-dark" : "glass-light"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Leaf size={16} className="text-fern-DEFAULT" />
          <span className={`text-sm font-semibold ${dark ? "text-white" : "text-pine-DEFAULT"}`}>
            Seasonal Comparison
          </span>
        </div>
        <div className="flex gap-2">
          {seasons.map(s => (
            <div key={s.season} className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-medium"
              style={{ color: SEASON_COLORS[s.season].fill, backgroundColor: SEASON_COLORS[s.season].bg, borderColor: SEASON_COLORS[s.season].border }}>
              <span>{SEASON_ICONS[s.season]}</span>
              <span>{s.season}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grouped bar chart */}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barGap={3}>
          <CartesianGrid strokeDasharray="3 3" stroke={dark ? "rgba(255,255,255,0.06)" : "rgba(52,78,65,0.08)"} />
          <XAxis dataKey="metric" tick={{ fontSize: 10, fill: dark ? "rgba(255,255,255,0.5)" : "rgba(52,78,65,0.55)" }}
            tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10, fill: dark ? "rgba(255,255,255,0.5)" : "rgba(52,78,65,0.55)" }}
            tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip dark={dark} />} />
          <Legend
            iconType="circle" iconSize={8}
            formatter={(value) => (
              <span style={{ color: SEASON_COLORS[value]?.fill, fontSize: "11px" }}>
                {SEASON_ICONS[value]} {value}
              </span>
            )}
          />
          {seasons.map(s => (
            <Bar key={s.season} dataKey={s.season} name={s.season}
              fill={SEASON_COLORS[s.season]?.fill} radius={[4, 4, 0, 0]}
              maxBarSize={36} animationDuration={900}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>

      {/* Season summary cards */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {seasons.map(s => (
          <div key={s.season}
            className={`p-3 rounded-xl border ${dark ? "bg-white/4" : "bg-white/60"}`}
            style={{ borderColor: SEASON_COLORS[s.season]?.border }}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-base">{SEASON_ICONS[s.season]}</span>
              <span className="text-xs font-semibold" style={{ color: SEASON_COLORS[s.season]?.fill }}>{s.season}</span>
            </div>
            <div className="text-xl font-black" style={{ color: SEASON_COLORS[s.season]?.fill }}>{s.avg_aqi}</div>
            <div className={`text-[10px] ${dark ? "text-white/40" : "text-pine-300/60"}`}>avg AQI</div>
            <div className={`text-[10px] mt-1 ${dark ? "text-white/50" : "text-pine-300/70"}`}>
              Worst: {s.worst_month}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
