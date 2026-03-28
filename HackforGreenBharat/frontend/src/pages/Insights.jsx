import Navbar from "@/components/Navbar";
import { useState } from "react";
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Bell,
  MapPin,
  Download,
  Share2,
  Leaf,
  Wind,
  Activity,
} from "lucide-react";

const monthlyReport = {
  month: "November 2024",
  totalCO2: 156,
  previousMonth: 189,
  improvement: 17.5,
  aqiExposure: { good: 45, moderate: 32, unhealthy: 18, hazardous: 5 },
  categories: [
    { name: "Transport", current: 45, previous: 62, change: -27 },
    { name: "Energy", current: 38, previous: 42, change: -9 },
    { name: "Shopping", current: 52, previous: 58, change: -10 },
    { name: "Lifestyle", current: 21, previous: 27, change: -22 },
  ],
  toxinsInhaled: { pm25: 234, pm10: 456, no2: 89, co: 12 },
};

const predictiveAlerts = [
  {
    id: 1,
    type: "warning",
    title: "High AQI Predicted Tomorrow",
    description: "AQI expected to reach 280+ between 8–10 AM in Central Delhi",
    recommendation: "Consider leaving 30 mins early or working from home",
    time: "Tomorrow, 8:00 AM",
  },
  {
    id: 2,
    type: "info",
    title: "Best Travel Window",
    description: "AQI will be lowest between 2–4 PM today",
    recommendation: "Ideal time for outdoor activities or commute",
    time: "Today, 2:00 PM",
  },
  {
    id: 3,
    type: "alert",
    title: "Entering High Pollution Zone",
    description: "Anand Vihar area has AQI 350+ currently",
    recommendation: "Take Ring Road alternate route (−45 min exposure)",
    time: "Real-time",
  },
];

const routeHeatmapData = [
  { area: "Connaught Place", aqi: 185, trend: "up" },
  { area: "Karol Bagh", aqi: 220, trend: "up" },
  { area: "South Extension", aqi: 145, trend: "down" },
  { area: "Dwarka", aqi: 165, trend: "stable" },
  { area: "Noida Sec 18", aqi: 195, trend: "up" },
  { area: "Gurgaon Cyber City", aqi: 175, trend: "down" },
];

const getAQILabel = (aqi) => {
  if (aqi <= 50) return { label: "Good", color: "#16a34a", bg: "#dcfce7" };
  if (aqi <= 100) return { label: "Moderate", color: "#ca8a04", bg: "#fef9c3" };
  if (aqi <= 150) return { label: "Unhealthy (Sensitive)", color: "#ea580c", bg: "#ffedd5" };
  if (aqi <= 200) return { label: "Unhealthy", color: "#dc2626", bg: "#fee2e2" };
  if (aqi <= 300) return { label: "Very Unhealthy", color: "#9333ea", bg: "#f3e8ff" };
  return { label: "Hazardous", color: "#7f1d1d", bg: "#fce7f3" };
};

const TABS = ["Monthly Report", "Smart Alerts", "Route Heatmap"];

const Insights = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div style={{ minHeight: "100vh", background: "#f0faf5", fontFamily: "'Inter', sans-serif" }} className="mt-16">
      <Navbar />

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "40px 20px" }}>

        {/* ── Page Header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <p style={{ fontSize: "13px", fontWeight: "600", color: "#10b981", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
              Environmental Insights
            </p>
            <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#111827", margin: 0 }}>
              Insights & Reports
            </h1>
            <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>
              Your environmental impact for {monthlyReport.month}
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "9px 16px", borderRadius: "8px",
              background: "#10b981", color: "white",
              border: "none", fontSize: "13px", fontWeight: "600", cursor: "pointer"
            }}>
              <Download size={14} /> Export PDF
            </button>
            <button style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "9px 16px", borderRadius: "8px",
              background: "white", color: "#374151",
              border: "1px solid #e5e7eb", fontSize: "13px", fontWeight: "500", cursor: "pointer"
            }}>
              <Share2 size={14} /> Share
            </button>
          </div>
        </div>

        {/* ── Tab Bar ── */}
        <div style={{
          display: "inline-flex", background: "white",
          border: "1px solid #e5e7eb", borderRadius: "10px",
          padding: "4px", marginBottom: "28px", gap: "2px"
        }}>
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              style={{
                padding: "8px 18px", borderRadius: "7px",
                border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "500",
                background: activeTab === i ? "#10b981" : "transparent",
                color: activeTab === i ? "white" : "#6b7280",
                transition: "all 0.15s ease"
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════ */}
        {/* TAB 0 — Monthly Report                */}
        {/* ══════════════════════════════════════ */}
        {activeTab === 0 && (
          <div>
            {/* Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
              {[
                {
                  icon: <Leaf size={18} color="#10b981" />,
                  value: `${monthlyReport.totalCO2} kg`,
                  label: "Total CO₂ This Month",
                  sub: `↓ ${monthlyReport.improvement}% vs last month`,
                  subColor: "#10b981",
                },
                {
                  icon: <Wind size={18} color="#10b981" />,
                  value: `${monthlyReport.aqiExposure.good}%`,
                  label: "Time in Good AQI",
                  sub: "of total exposure time",
                  subColor: "#9ca3af",
                },
                {
                  icon: <Activity size={18} color="#f97316" />,
                  value: `${monthlyReport.toxinsInhaled.pm25} μg`,
                  label: "PM2.5 Inhaled",
                  sub: "monthly average",
                  subColor: "#9ca3af",
                },
                {
                  icon: <BarChart3 size={18} color="#10b981" />,
                  value: "27",
                  label: "Eco Activities Done",
                  sub: "+6 from last month",
                  subColor: "#10b981",
                },
              ].map((s, i) => (
                <div key={i} style={{
                  background: "white", border: "1px solid #e5e7eb",
                  borderRadius: "12px", padding: "20px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    {s.icon}
                    <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: "500" }}>{s.label}</span>
                  </div>
                  <p style={{ fontSize: "28px", fontWeight: "700", color: "#111827", margin: "0 0 4px" }}>{s.value}</p>
                  <p style={{ fontSize: "12px", color: s.subColor, margin: 0 }}>{s.sub}</p>
                </div>
              ))}
            </div>

            {/* CO₂ by Category */}
            <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "24px" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#111827", margin: "0 0 20px" }}>CO₂ by Category</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {monthlyReport.categories.map((cat) => (
                  <div key={cat.name}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ fontSize: "14px", color: "#374151", fontWeight: "500" }}>{cat.name}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <span style={{ fontSize: "12px", color: "#9ca3af" }}>{cat.current} kg</span>
                        <span style={{
                          display: "flex", alignItems: "center", gap: "3px",
                          fontSize: "13px", fontWeight: "600",
                          color: cat.change < 0 ? "#16a34a" : "#dc2626"
                        }}>
                          {cat.change < 0 ? <TrendingDown size={13} /> : <TrendingUp size={13} />}
                          {Math.abs(cat.change)}%
                        </span>
                      </div>
                    </div>
                    <div style={{ height: "6px", background: "#f3f4f6", borderRadius: "99px", overflow: "hidden" }}>
                      <div style={{
                        height: "100%", width: `${cat.current}%`,
                        background: "#10b981", borderRadius: "99px",
                        transition: "width 0.4s ease"
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AQI Exposure Breakdown */}
            <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "24px", marginTop: "16px" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#111827", margin: "0 0 16px" }}>AQI Exposure Breakdown</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
                {[
                  { label: "Good", value: monthlyReport.aqiExposure.good, color: "#16a34a", bg: "#dcfce7" },
                  { label: "Moderate", value: monthlyReport.aqiExposure.moderate, color: "#ca8a04", bg: "#fef9c3" },
                  { label: "Unhealthy", value: monthlyReport.aqiExposure.unhealthy, color: "#dc2626", bg: "#fee2e2" },
                  { label: "Hazardous", value: monthlyReport.aqiExposure.hazardous, color: "#9333ea", bg: "#f3e8ff" },
                ].map((item) => (
                  <div key={item.label} style={{
                    background: item.bg, borderRadius: "10px",
                    padding: "14px", textAlign: "center"
                  }}>
                    <p style={{ fontSize: "22px", fontWeight: "700", color: item.color, margin: "0 0 4px" }}>{item.value}%</p>
                    <p style={{ fontSize: "12px", color: item.color, margin: 0, fontWeight: "500" }}>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════ */}
        {/* TAB 1 — Smart Alerts                  */}
        {/* ══════════════════════════════════════ */}
        {activeTab === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {predictiveAlerts.map((alert) => {
              const isWarning = alert.type === "warning";
              const isAlert = alert.type === "alert";
              const borderColor = isAlert ? "#fecaca" : isWarning ? "#fed7aa" : "#bbf7d0";
              const iconColor = isAlert ? "#dc2626" : isWarning ? "#f97316" : "#16a34a";
              const tagBg = isAlert ? "#fee2e2" : isWarning ? "#ffedd5" : "#dcfce7";
              const tagColor = isAlert ? "#dc2626" : isWarning ? "#ea580c" : "#16a34a";
              const tagLabel = isAlert ? "Real-time" : isWarning ? "Warning" : "Info";

              return (
                <div key={alert.id} style={{
                  background: "white", border: `1px solid ${borderColor}`,
                  borderRadius: "12px", padding: "20px",
                  display: "flex", gap: "16px", alignItems: "flex-start"
                }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "8px",
                    background: tagBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>
                    <AlertTriangle size={16} color={iconColor} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#111827", margin: 0 }}>{alert.title}</h3>
                      <span style={{
                        fontSize: "11px", fontWeight: "600", padding: "2px 8px",
                        borderRadius: "99px", background: tagBg, color: tagColor
                      }}>{tagLabel}</span>
                    </div>
                    <p style={{ fontSize: "13px", color: "#6b7280", margin: "4px 0 8px" }}>{alert.description}</p>
                    <p style={{ fontSize: "13px", color: "#059669", margin: 0, fontWeight: "500" }}>
                      💡 {alert.recommendation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══════════════════════════════════════ */}
        {/* TAB 2 — Route Heatmap                 */}
        {/* ══════════════════════════════════════ */}
        {activeTab === 2 && (
          <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #f3f4f6" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#111827", margin: 0 }}>Area-wise AQI Status</h2>
              <p style={{ fontSize: "13px", color: "#9ca3af", margin: "4px 0 0" }}>Live pollution levels across Delhi NCR</p>
            </div>

            {/* Legend */}
            <div style={{ padding: "12px 24px", borderBottom: "1px solid #f3f4f6", display: "flex", gap: "16px", flexWrap: "wrap" }}>
              {[
                { label: "Good (0–50)", color: "#16a34a" },
                { label: "Moderate (51–100)", color: "#ca8a04" },
                { label: "Unhealthy (101–200)", color: "#dc2626" },
                { label: "Very Unhealthy (201–300)", color: "#9333ea" },
              ].map(({ label, color }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color }} />
                  <span style={{ fontSize: "11px", color: "#9ca3af" }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Table Header */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr auto auto",
              padding: "10px 24px", background: "#f9fafb",
              borderBottom: "1px solid #f3f4f6"
            }}>
              <span style={{ fontSize: "11px", fontWeight: "600", color: "#9ca3af", textTransform: "uppercase" }}>Area</span>
              <span style={{ fontSize: "11px", fontWeight: "600", color: "#9ca3af", textTransform: "uppercase", minWidth: "80px", textAlign: "center" }}>AQI</span>
              <span style={{ fontSize: "11px", fontWeight: "600", color: "#9ca3af", textTransform: "uppercase", minWidth: "80px", textAlign: "right" }}>Status</span>
            </div>

            {routeHeatmapData.map((area, i) => {
              const { label, color, bg } = getAQILabel(area.aqi);
              return (
                <div key={area.area} style={{
                  display: "grid", gridTemplateColumns: "1fr auto auto",
                  alignItems: "center", padding: "14px 24px",
                  borderBottom: i < routeHeatmapData.length - 1 ? "1px solid #f3f4f6" : "none"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <MapPin size={14} color="#9ca3af" />
                    <span style={{ fontSize: "14px", color: "#374151", fontWeight: "500" }}>{area.area}</span>
                  </div>
                  <span style={{ fontSize: "16px", fontWeight: "700", color, minWidth: "80px", textAlign: "center" }}>
                    {area.aqi}
                  </span>
                  <span style={{
                    fontSize: "11px", fontWeight: "600", padding: "3px 10px",
                    borderRadius: "99px", background: bg, color,
                    minWidth: "80px", textAlign: "center"
                  }}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default Insights;