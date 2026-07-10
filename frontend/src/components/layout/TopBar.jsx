import { motion } from "framer-motion";
import { Bell, RefreshCw, WifiOff, Wifi, ChevronRight } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { getAQIColor } from "../../utils/aqi";

const CITY_NAMES = {
  delhi: "Delhi", mumbai: "Mumbai", bangalore: "Bangalore",
  chennai: "Chennai", kolkata: "Kolkata", beijing: "Beijing",
  london: "London", new_york: "New York",
};

export default function TopBar({ cityId, aqi, category, loading, error, lastUpdated, onRefresh }) {
  const { dark } = useTheme();
  const aqiColor = aqi ? getAQIColor(aqi) : "#A3B18A";

  return (
    <header className={`
      sticky top-0 z-10 px-6 py-3 flex items-center justify-between gap-4
      border-b backdrop-blur-sm
      ${dark
        ? "bg-pine-400/80 border-pine-300/30"
        : "bg-white/80 border-sage-300/30"
      }
    `}>
      {/* ── Breadcrumb ───────────────────────────────────────────── */}
      <div className="flex items-center gap-2 min-w-0">
        <span className={`text-sm ${dark ? "text-sage-300" : "text-hunter-DEFAULT"}`}>Atmos</span>
        <ChevronRight size={14} className="text-sage-300 shrink-0" />
        <span className={`text-sm font-semibold truncate ${dark ? "text-white" : "text-pine-DEFAULT"}`}>
          {CITY_NAMES[cityId] ?? cityId}
        </span>
      </div>

      {/* ── Status ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        {/* Live AQI pill */}
        {aqi && (
          <motion.div
            key={aqi}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
            style={{ borderColor: `${aqiColor}40`, backgroundColor: `${aqiColor}15` }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: aqiColor }} />
            <span className="text-xs font-bold" style={{ color: aqiColor }}>AQI {aqi}</span>
            <span className="text-xs opacity-70" style={{ color: aqiColor }}>{category}</span>
          </motion.div>
        )}

        {/* Connectivity status */}
        <div className={`flex items-center gap-1.5 text-xs ${error ? "text-yellow-400" : "text-sage-300"}`}>
          {error ? <WifiOff size={14} /> : <Wifi size={14} />}
          <span className="hidden sm:inline">{error ? "Offline data" : "Live"}</span>
        </div>

        {/* Last updated */}
        {lastUpdated && (
          <span className={`text-xs hidden md:inline ${dark ? "text-white/40" : "text-pine-300/60"}`}>
            Updated {new Date(lastUpdated).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}

        {/* Refresh */}
        <button
          id="refresh-btn"
          onClick={onRefresh}
          disabled={loading}
          className={`p-2 rounded-lg transition-all ${
            dark ? "hover:bg-white/10 text-sage-300" : "hover:bg-hunter-300/10 text-hunter-DEFAULT"
          }`}
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>

        {/* Notifications */}
        <button
          id="notifications-btn"
          className={`relative p-2 rounded-lg transition-all ${
            dark ? "hover:bg-white/10 text-sage-300" : "hover:bg-hunter-300/10 text-hunter-DEFAULT"
          }`}
        >
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}
