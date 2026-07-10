import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, CalendarDays } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { getAQIColor, getAQILabel } from "../../utils/aqi";

function TrendIcon({ current, prev }) {
  if (!prev) return <Minus size={12} className="text-sage-300" />;
  if (current > prev) return <TrendingUp size={12} className="text-red-400" />;
  return <TrendingDown size={12} className="text-green-400" />;
}

export default function ForecastCard({ data, loading }) {
  const { dark } = useTheme();

  if (loading || !data) {
    return (
      <div className={`rounded-2xl p-5 ${dark ? "glass-dark" : "glass-light"}`}>
        <div className="skeleton h-6 w-40 mb-4" />
        <div className="flex gap-2">
          {Array.from({ length: 7 }).map((_, i) => <div key={i} className="skeleton h-24 flex-1 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const { tomorrow_aqi, tomorrow_category, days } = data;
  const tomorrowColor = getAQIColor(tomorrow_aqi);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
      className={`rounded-2xl p-5 card-hover ${dark ? "glass-dark" : "glass-light"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-sage-300" />
          <span className={`text-sm font-semibold ${dark ? "text-white" : "text-pine-DEFAULT"}`}>7-Day Forecast</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${dark ? "text-white/50" : "text-pine-300/60"}`}>Tomorrow:</span>
          <span className="text-sm font-bold" style={{ color: tomorrowColor }}>AQI {tomorrow_aqi}</span>
          <span className="text-xs px-2 py-0.5 rounded-full border"
            style={{ color: tomorrowColor, borderColor: `${tomorrowColor}40`, backgroundColor: `${tomorrowColor}15` }}>
            {tomorrow_category}
          </span>
        </div>
      </div>

      {/* Day cards */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {days.map((day, i) => {
          const color = getAQIColor(day.aqi);
          const prevAqi = i > 0 ? days[i - 1].aqi : null;
          return (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 + 0.2 }}
              className={`
                flex-1 min-w-[68px] flex flex-col items-center gap-1.5 p-3 rounded-xl
                border transition-all duration-200 hover:scale-105 cursor-default
                ${i === 0
                  ? dark ? "bg-fern-DEFAULT/20 border-fern-300/40" : "bg-fern-DEFAULT/10 border-fern-300/30"
                  : dark ? "bg-white/5 border-white/8" : "bg-white/60 border-sage-300/20"
                }
              `}
            >
              <span className={`text-[10px] font-semibold ${dark ? "text-white/60" : "text-pine-300/70"}`}>
                {i === 0 ? "TMR" : day.day_label}
              </span>

              {/* AQI circle */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2"
                style={{ borderColor: color, color, backgroundColor: `${color}18` }}
              >
                {day.aqi}
              </div>

              <div className="flex items-center gap-0.5">
                <TrendIcon current={day.aqi} prev={prevAqi} />
              </div>

              <div className={`text-center text-[9px] ${dark ? "text-white/40" : "text-pine-300/50"}`}>
                <div>{day.high}</div>
                <div>/{day.low}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
