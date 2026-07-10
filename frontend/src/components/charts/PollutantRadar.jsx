import { motion } from "framer-motion";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from "recharts";
import { Activity } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { normalisePollutant, POLLUTANT_LABELS } from "../../utils/aqi";

const CustomTooltip = ({ active, payload, dark }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className={`px-3 py-2 rounded-xl border text-xs backdrop-blur-sm ${
      dark ? "bg-pine-400/95 border-fern-300/30 text-white" : "bg-white/95 border-sage-300/30 text-pine-DEFAULT"
    }`}>
      <p className="font-semibold">{d?.subject}</p>
      <p className="opacity-70">Normalised: <span className="font-bold text-fern-DEFAULT">{d?.value}%</span></p>
      <p className="opacity-70">Actual: <span className="font-bold">{d?.actual}</span></p>
    </div>
  );
};

export default function PollutantRadar({ pollutants, loading }) {
  const { dark } = useTheme();

  if (loading || !pollutants) {
    return (
      <div className={`rounded-2xl p-5 ${dark ? "glass-dark" : "glass-light"}`}>
        <div className="skeleton h-6 w-44 mb-4" />
        <div className="skeleton h-52 w-full rounded-full" />
      </div>
    );
  }

  const data = Object.entries(pollutants).map(([key, value]) => ({
    subject: POLLUTANT_LABELS[key] ?? key,
    value: normalisePollutant(key, value),
    actual: typeof value === "number" ? (key === "co" ? value.toFixed(2) : value.toFixed(1)) : "--",
    fullMark: 100,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      className={`rounded-2xl p-5 card-hover ${dark ? "glass-dark" : "glass-light"}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Activity size={16} className="text-fern-DEFAULT" />
        <span className={`text-sm font-semibold ${dark ? "text-white" : "text-pine-DEFAULT"}`}>
          Pollutant Profile
        </span>
        <span className={`ml-auto text-[10px] ${dark ? "text-white/40" : "text-pine-300/50"}`}>
          Normalised 0–100%
        </span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={data} margin={{ top: 8, right: 16, left: 16, bottom: 8 }}>
          <PolarGrid stroke={dark ? "rgba(255,255,255,0.08)" : "rgba(52,78,65,0.12)"} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 11, fill: dark ? "rgba(255,255,255,0.55)" : "rgba(52,78,65,0.65)", fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={30} domain={[0, 100]} tick={false} axisLine={false}
          />
          <Tooltip content={<CustomTooltip dark={dark} />} />
          <Radar
            name="Current" dataKey="value" stroke="#588157" fill="#588157"
            fillOpacity={0.25} strokeWidth={2}
            dot={{ fill: "#588157", r: 4, strokeWidth: 0 }}
            animationDuration={900}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Pollutant chips */}
      <div className="flex flex-wrap gap-1.5 mt-2">
        {data.map(d => {
          const pct = d.value;
          const color = pct < 30 ? "#22c55e" : pct < 60 ? "#eab308" : pct < 80 ? "#f97316" : "#ef4444";
          return (
            <div key={d.subject}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border ${dark ? "bg-white/5" : "bg-white/60"}`}
              style={{ borderColor: `${color}40` }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
              <span className={`text-[10px] font-medium ${dark ? "text-white/70" : "text-pine-DEFAULT"}`}>{d.subject}</span>
              <span className="text-[10px] font-bold" style={{ color }}>{d.value}%</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
