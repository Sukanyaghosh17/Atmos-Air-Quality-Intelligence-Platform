import { motion } from "framer-motion";
import { Wind, Thermometer, Droplets } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { getAQIBand, getAQIAdvice } from "../../utils/aqi";

// SVG arc gauge for AQI
function AQIGauge({ aqi, color }) {
  const MAX_AQI = 500;
  const pct = Math.min(aqi / MAX_AQI, 1);
  const angle = pct * 180; // 0-180 degrees across the arc

  // Arc path helper
  const R = 80;
  const cx = 100, cy = 100;
  function polarToXY(deg) {
    const rad = ((deg - 180) * Math.PI) / 180;
    return { x: cx + R * Math.cos(rad), y: cy + R * Math.sin(rad) };
  }
  const start = polarToXY(0);
  const end   = polarToXY(angle);
  const large = angle > 90 ? 1 : 0;

  const trackPath = `M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`;
  const fillPath  = `M ${cx - R} ${cy} A ${R} ${R} 0 ${large} 1 ${end.x} ${end.y}`;

  return (
    <svg viewBox="0 0 200 120" className="w-full max-w-[220px] mx-auto select-none">
      {/* Track */}
      <path d={trackPath} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" strokeLinecap="round" />
      {/* Fill */}
      <motion.path
        d={fillPath} fill="none" stroke={color} strokeWidth="14" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: "easeOut" }}
      />
      {/* Needle dot */}
      <motion.circle cx={end.x} cy={end.y} r="7" fill={color}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 }}
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
      />
      {/* Labels */}
      <text x="24" y="115" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="Inter">Good</text>
      <text x="148" y="115" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="Inter">Hazardous</text>
    </svg>
  );
}

export default function AQICard({ data, loading }) {
  const { dark } = useTheme();

  if (loading || !data) {
    return (
      <div className={`rounded-2xl p-6 ${dark ? "glass-dark" : "glass-light"} card-hover animate-fade-in`}>
        <div className="skeleton h-8 w-32 mb-4" />
        <div className="skeleton h-40 w-full" />
        <div className="skeleton h-6 w-48 mt-4" />
      </div>
    );
  }

  const { aqi, category, temperature, humidity, wind_speed } = data;
  const band = getAQIBand(aqi);
  const advice = getAQIAdvice(aqi);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className={`rounded-2xl p-6 card-hover gradient-border ${dark ? "glass-dark" : "glass-light"}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className={`text-xs font-semibold uppercase tracking-widest ${dark ? "text-sage-300" : "text-hunter-DEFAULT"}`}>
            Air Quality Index
          </span>
          <h2 className={`text-4xl font-black mt-1 ticker`} style={{ color: band.color }}>
            {aqi}
          </h2>
        </div>
        <span
          className="px-3 py-1 rounded-full text-xs font-semibold border"
          style={{ color: band.color, backgroundColor: band.bg, borderColor: `${band.color}40` }}
        >
          {category}
        </span>
      </div>

      {/* Gauge */}
      <AQIGauge aqi={aqi} color={band.color} />

      {/* Health advice */}
      <p className={`text-xs leading-relaxed mt-3 ${dark ? "text-white/60" : "text-pine-300/70"}`}>
        {advice}
      </p>

      {/* Weather strip */}
      <div className={`flex gap-4 mt-4 pt-4 border-t ${dark ? "border-white/10" : "border-sage-300/30"}`}>
        <div className="flex items-center gap-1.5">
          <Thermometer size={14} className="text-sage-300" />
          <span className={`text-xs font-medium ${dark ? "text-white/80" : "text-pine-DEFAULT"}`}>{temperature}°C</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Droplets size={14} className="text-sage-300" />
          <span className={`text-xs font-medium ${dark ? "text-white/80" : "text-pine-DEFAULT"}`}>{humidity}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wind size={14} className="text-sage-300" />
          <span className={`text-xs font-medium ${dark ? "text-white/80" : "text-pine-DEFAULT"}`}>{wind_speed} km/h</span>
        </div>
      </div>
    </motion.div>
  );
}
