import { motion } from "framer-motion";
import { Clock, AlertTriangle, Shield } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { getAQIColor } from "../../utils/aqi";

function HourCell({ hour, aqi }) {
  const color = getAQIColor(aqi);
  const opacity = Math.min(0.2 + (aqi / 400), 0.9);
  return (
    <div className="flex flex-col items-center gap-0.5 group cursor-default">
      <div
        className="w-6 h-10 rounded-sm transition-all duration-200 group-hover:scale-110 relative"
        style={{ backgroundColor: color, opacity }}
        title={`${String(hour).padStart(2,"0")}:00 – AQI ${aqi}`}
      >
        <div className="absolute inset-0 flex items-end justify-center pb-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[7px] font-bold text-white">{aqi}</span>
        </div>
      </div>
      {hour % 6 === 0 && (
        <span className="text-[8px] text-white/30">{String(hour).padStart(2,"0")}</span>
      )}
    </div>
  );
}

export default function DangerousHoursCard({ data, loading }) {
  const { dark } = useTheme();

  if (loading || !data) {
    return (
      <div className={`rounded-2xl p-5 ${dark ? "glass-dark" : "glass-light"}`}>
        <div className="skeleton h-6 w-48 mb-4" />
        <div className="skeleton h-16 w-full" />
      </div>
    );
  }

  const { windows, hourly_aqi } = data;
  const maxAqi = Math.max(...hourly_aqi);
  const peakHour = hourly_aqi.indexOf(maxAqi);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      className={`rounded-2xl p-5 card-hover ${dark ? "glass-dark" : "glass-light"}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-red-500/20 flex items-center justify-center">
          <Clock size={14} className="text-red-400" />
        </div>
        <span className={`text-sm font-semibold ${dark ? "text-white" : "text-pine-DEFAULT"}`}>Dangerous Hours</span>
        <span className={`ml-auto text-xs ${dark ? "text-white/40" : "text-pine-300/50"}`}>
          Peak at {String(peakHour).padStart(2, "0")}:00
        </span>
      </div>

      {/* Heat-strip */}
      <div className="flex items-end gap-0.5 mb-4 overflow-x-auto pb-1">
        {hourly_aqi.map((aqi, h) => <HourCell key={h} hour={h} aqi={aqi} />)}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mb-4 text-[10px]">
        {["Good","Moderate","Unhealthy","Hazardous"].map((label, i) => {
          const colors = ["#22c55e","#eab308","#ef4444","#dc2626"];
          return (
            <div key={label} className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: colors[i] }} />
              <span className={dark ? "text-white/50" : "text-pine-300/60"}>{label}</span>
            </div>
          );
        })}
      </div>

      {/* Warning windows */}
      <div className="space-y-2">
        {windows.map((w, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className={`
              flex items-start gap-3 p-3 rounded-xl
              ${dark ? "bg-red-500/10 border border-red-500/20" : "bg-red-50 border border-red-200"}
            `}
          >
            <AlertTriangle size={14} className="text-red-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-semibold ${dark ? "text-red-300" : "text-red-700"}`}>
                  {String(w.start_hour).padStart(2,"0")}:00 – {String(w.end_hour).padStart(2,"0")}:00
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium
                  ${dark ? "bg-red-500/20 text-red-300" : "bg-red-100 text-red-700"}`}>
                  Avg AQI {w.avg_aqi}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium
                  ${dark ? "bg-orange-500/20 text-orange-300" : "bg-orange-100 text-orange-700"}`}>
                  {w.peak_pollutant}
                </span>
              </div>
              <p className={`text-[11px] mt-1 ${dark ? "text-white/60" : "text-red-800/70"}`}>{w.advice}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Safe hours note */}
      <div className={`flex items-center gap-2 mt-3 p-2.5 rounded-lg ${dark ? "bg-green-500/10 border border-green-500/20" : "bg-green-50 border border-green-200"}`}>
        <Shield size={12} className="text-green-400 shrink-0" />
        <span className={`text-[11px] ${dark ? "text-green-300" : "text-green-700"}`}>
          Best time: 11:00 – 15:00 (lower traffic, dispersed pollutants)
        </span>
      </div>
    </motion.div>
  );
}
