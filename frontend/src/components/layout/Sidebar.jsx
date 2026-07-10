import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wind, MapPin, LayoutDashboard, TrendingUp, AlertTriangle,
  Sun, Moon, ChevronLeft, ChevronRight, Leaf, Globe2,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const NAV_ITEMS = [
  { id: "dashboard",   icon: LayoutDashboard, label: "Dashboard"       },
  { id: "trends",      icon: TrendingUp,       label: "Trends"          },
  { id: "anomalies",   icon: AlertTriangle,    label: "Anomalies"       },
];

const CITY_FLAGS = {
  delhi: "🇮🇳", mumbai: "🇮🇳", bangalore: "🇮🇳", chennai: "🇮🇳",
  kolkata: "🇮🇳", beijing: "🇨🇳", london: "🇬🇧", new_york: "🇺🇸",
};

export default function Sidebar({ cities = [], selectedCity, onCityChange, activeSection, onSectionChange }) {
  const { dark, toggle } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [citySearch, setCitySearch] = useState("");

  const filtered = (cities?.cities ?? []).filter(c =>
    c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
    c.country.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={`
        relative flex flex-col h-full overflow-hidden z-20 shrink-0
        ${dark ? "bg-pine-400 border-r border-hunter-400/40" : "bg-hunter-DEFAULT border-r border-hunter-400/30"}
      `}
      style={{ minWidth: collapsed ? 72 : 260 }}
    >
      {/* ── Logo ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-fern-DEFAULT flex items-center justify-center shrink-0 shadow-glow-green">
          <Wind size={18} className="text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <span className="text-white font-bold text-lg tracking-tight">Atmos</span>
              <span className="block text-sage-300 text-[10px] font-medium tracking-widest uppercase">Air Intelligence</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Navigation ───────────────────────────────────────────── */}
      <nav className="px-2 pt-4 space-y-1">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const active = activeSection === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => onSectionChange(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
                transition-all duration-200 group
                ${active
                  ? "bg-fern-DEFAULT text-white shadow-glow-green"
                  : "text-sage-300 hover:bg-white/8 hover:text-white"
                }
              `}
            >
              <Icon size={18} className="shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      {/* ── City Selector ─────────────────────────────────────────── */}
      {!collapsed && (
        <div className="flex-1 flex flex-col px-2 pt-6 min-h-0">
          <div className="flex items-center gap-2 px-2 mb-3">
            <Globe2 size={14} className="text-sage-300" />
            <span className="text-sage-300 text-xs font-semibold uppercase tracking-widest">Cities</span>
          </div>

          <div className="relative mb-2">
            <input
              id="city-search-input"
              type="text"
              placeholder="Search city…"
              value={citySearch}
              onChange={e => setCitySearch(e.target.value)}
              className="
                w-full bg-white/8 border border-white/12 rounded-lg
                px-3 py-2 text-white text-xs placeholder-white/40
                focus:outline-none focus:border-fern-300 focus:bg-white/12
                transition-all duration-200
              "
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-0.5 pr-1">
            {filtered.map(city => {
              const sel = city.id === selectedCity;
              return (
                <button
                  key={city.id}
                  id={`city-btn-${city.id}`}
                  onClick={() => onCityChange(city.id)}
                  className={`
                    w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left
                    transition-all duration-200
                    ${sel
                      ? "bg-fern-DEFAULT/30 border border-fern-300/40 text-white"
                      : "text-sage-300 hover:bg-white/8 hover:text-white border border-transparent"
                    }
                  `}
                >
                  <span className="text-base">{CITY_FLAGS[city.id] ?? "🌍"}</span>
                  <div className="min-w-0">
                    <div className="text-xs font-medium truncate">{city.name}</div>
                    <div className="text-[10px] text-white/40 truncate">{city.country}</div>
                  </div>
                  {sel && <MapPin size={10} className="ml-auto text-fern-300 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Footer ───────────────────────────────────────────────── */}
      <div className="px-2 py-4 border-t border-white/10 space-y-2 mt-auto">
        {/* Theme toggle */}
        <button
          id="theme-toggle-btn"
          onClick={toggle}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sage-300 hover:bg-white/8 hover:text-white transition-all"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm font-medium">
                {dark ? "Light mode" : "Dark mode"}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Collapse toggle */}
        <button
          id="sidebar-collapse-btn"
          onClick={() => setCollapsed(c => !c)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sage-300 hover:bg-white/8 hover:text-white transition-all"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm font-medium">
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
