import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

import AQICard from "../components/cards/AQICard";
import PollutantCard from "../components/cards/PollutantCard";
import ForecastCard from "../components/cards/ForecastCard";
import DangerousHoursCard from "../components/cards/DangerousHoursCard";
import AnomalyCard from "../components/cards/AnomalyCard";
import TrendChart from "../components/charts/TrendChart";
import SeasonalChart from "../components/charts/SeasonalChart";
import PollutantRadar from "../components/charts/PollutantRadar";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
};

export default function Dashboard({ cityId, data }) {
  const { dark } = useTheme();
  const { current, forecast, trends, dangerousHours, seasonal, anomalies, loading, changePeriod, trendPeriod } = data;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={cityId}
        variants={stagger}
        initial="hidden"
        animate="show"
        className="p-5 md:p-6 space-y-5"
      >
        {/* ── Row 1: AQI + Pollutant Cards ───────────────────────── */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
          <AQICard data={current} loading={loading} />
          <div className="space-y-5">
            <PollutantCard pollutants={current?.pollutants} loading={loading} />
            <PollutantRadar pollutants={current?.pollutants} loading={loading} />
          </div>
        </motion.div>

        {/* ── Row 2: Forecast ────────────────────────────────────── */}
        <motion.div variants={fadeUp}>
          <ForecastCard data={forecast} loading={loading} />
        </motion.div>

        {/* ── Row 3: Trend Chart + Dangerous Hours ───────────────── */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-5">
          <TrendChart data={trends} period={trendPeriod} onPeriodChange={changePeriod} loading={loading} />
          <DangerousHoursCard data={dangerousHours} loading={loading} />
        </motion.div>

        {/* ── Row 4: Seasonal + Anomalies ────────────────────────── */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-5">
          <SeasonalChart data={seasonal} loading={loading} />
          <AnomalyCard data={anomalies} loading={loading} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
