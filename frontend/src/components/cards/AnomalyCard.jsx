import { motion } from "framer-motion";
import { Zap, TrendingUp, Clock } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { getSeverityStyle } from "../../utils/aqi";

function timeAgo(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h === 0) return `${m}m ago`;
  if (h < 24) return `${h}h ${m}m ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const CAUSE_ICONS = {
  "Crop Burning": "🌾", "Industrial Leak": "🏭", "Traffic Surge": "🚗",
  "Dust Storm": "🌪️", "Festival Fireworks": "🎆", "Power Plant": "⚡",
  "Wildfire Smoke": "🔥",
};

export default function AnomalyCard({ data, loading }) {
  const { dark } = useTheme();

  if (loading || !data) {
    return (
      <div className={`rounded-2xl p-5 ${dark ? "glass-dark" : "glass-light"}`}>
        <div className="skeleton h-6 w-44 mb-4" />
        {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-xl mb-2" />)}
      </div>
    );
  }

  const anomalies = data.anomalies ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
      className={`rounded-2xl p-5 card-hover ${dark ? "glass-dark" : "glass-light"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-500/20 flex items-center justify-center">
            <Zap size={14} className="text-orange-400" />
          </div>
          <span className={`text-sm font-semibold ${dark ? "text-white" : "text-pine-DEFAULT"}`}>Anomaly Detection</span>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold
          ${dark ? "bg-orange-500/20 text-orange-300 border border-orange-500/30" : "bg-orange-50 text-orange-700 border border-orange-200"}`}>
          {anomalies.length} events
        </span>
      </div>

      {/* Anomaly list */}
      <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
        {anomalies.map((a, i) => {
          const sev = getSeverityStyle(a.severity);
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`p-3.5 rounded-xl border ${dark ? "bg-white/4" : "bg-white/70"}`}
              style={{ borderColor: sev.border }}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl shrink-0">{CAUSE_ICONS[a.cause] ?? "⚠️"}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {/* Severity badge */}
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                      style={{ color: sev.text, backgroundColor: sev.bg, borderColor: sev.border }}
                    >
                      {a.severity.toUpperCase()}
                    </span>
                    {/* Pollutant badge */}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
                      ${dark ? "bg-white/10 text-white/70" : "bg-pine-300/10 text-pine-DEFAULT"}`}>
                      {a.pollutant}
                    </span>
                    {/* AQI spike */}
                    <span className="text-[10px] text-red-400 font-bold ml-auto">
                      AQI {a.aqi_spike}
                    </span>
                  </div>

                  <p className={`text-xs font-semibold ${dark ? "text-white" : "text-pine-DEFAULT"}`}>{a.cause}</p>
                  <p className={`text-[11px] mt-0.5 leading-relaxed ${dark ? "text-white/55" : "text-pine-300/70"}`}>
                    {a.description}
                  </p>

                  {/* Deviation bar */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: sev.text }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(a.deviation_pct, 100)}%` }}
                        transition={{ duration: 0.8, delay: i * 0.08 }}
                      />
                    </div>
                    <span className="text-[10px] font-bold shrink-0" style={{ color: sev.text }}>
                      +{a.deviation_pct}%
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mt-1.5">
                    <Clock size={9} className="text-white/30" />
                    <span className={`text-[10px] ${dark ? "text-white/30" : "text-pine-300/50"}`}>
                      {timeAgo(a.timestamp)}
                    </span>
                    <TrendingUp size={9} className="ml-2 text-white/30" />
                    <span className={`text-[10px] ${dark ? "text-white/30" : "text-pine-300/50"}`}>
                      {a.observed} vs {a.expected} expected
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
