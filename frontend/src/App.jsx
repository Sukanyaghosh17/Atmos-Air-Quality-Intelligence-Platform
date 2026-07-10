import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "./contexts/ThemeContext";
import { useAirQuality } from "./hooks/useAirQuality";
import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";
import Dashboard from "./pages/Dashboard";
import AnomalyCard from "./components/cards/AnomalyCard";
import TrendChart from "./components/charts/TrendChart";

export default function App() {
  const { dark } = useTheme();
  const [selectedCity, setSelectedCity] = useState("delhi");
  const [activeSection, setActiveSection] = useState("dashboard");

  const airData = useAirQuality(selectedCity);

  const handleCityChange = (cityId) => {
    setSelectedCity(cityId);
    setActiveSection("dashboard");
  };

  return (
    <div className={`flex h-screen overflow-hidden font-sans ${
      dark ? "bg-atmos-dark text-white" : "bg-atmos-light text-pine-DEFAULT"
    }`}>
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20 animate-spin-slow ${
          dark ? "bg-fern-DEFAULT" : "bg-fern-300"
        }`} />
        <div className={`absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-15 animate-spin-slow ${
          dark ? "bg-hunter-DEFAULT" : "bg-sage-300"
        }`} style={{ animationDirection: "reverse" }} />
      </div>

      {/* Sidebar */}
      <Sidebar
        cities={airData.cities}
        selectedCity={selectedCity}
        onCityChange={handleCityChange}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <TopBar
          cityId={selectedCity}
          aqi={airData.current?.aqi}
          category={airData.current?.category}
          loading={airData.loading}
          error={airData.error}
          lastUpdated={airData.current?.updated_at}
          onRefresh={() => airData.refetch(selectedCity, airData.trendPeriod)}
        />

        <main className="flex-1 overflow-y-auto">
          {activeSection === "dashboard" && (
            <Dashboard cityId={selectedCity} data={airData} />
          )}
          {activeSection === "trends" && (
            <div className="p-5 md:p-6 space-y-5">
              <TrendChart
                data={airData.trends}
                period={airData.trendPeriod}
                onPeriodChange={airData.changePeriod}
                loading={airData.loading}
              />
            </div>
          )}
          {activeSection === "anomalies" && (
            <div className="p-5 md:p-6 max-w-3xl">
              <AnomalyCard data={airData.anomalies} loading={airData.loading} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
