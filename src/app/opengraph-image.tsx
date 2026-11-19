import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "GridForecaster | Net Demand & Duck Curve Intelligence Engine";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          backgroundColor: "#090d16",
          backgroundImage: "radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.25) 0%, transparent 60%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
          border: "8px solid #1e293b",
        }}
      >
        {/* Top Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#fbbf24">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "28px", fontWeight: "bold", letterSpacing: "-0.5px" }}>
                GridForecaster
              </span>
              <span style={{ fontSize: "14px", color: "#94a3b8" }}>
                Transmission Analytics & Duck Curve Mitigation
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 20px",
              borderRadius: "999px",
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              color: "#34d399",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            <span>● 50.00 Hz SYNCHRONOUS</span>
            <span>|</span>
            <span>IEEE 1547 COMPLIANT</span>
          </div>
        </div>

        {/* Center Main Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "950px" }}>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "700",
              color: "#60a5fa",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Machine Learning Grid Intelligence Platform
          </div>
          <div
            style={{
              fontSize: "52px",
              fontWeight: "800",
              lineHeight: 1.15,
              letterSpacing: "-1px",
              color: "#f8fafc",
            }}
          >
            Electricity Demand Forecasting & Net Duck Curve Mitigation
          </div>
          <div style={{ fontSize: "20px", color: "#94a3b8", lineHeight: 1.5 }}>
            Predicting net load and the critical 3-hour evening ramp (+9,000 MW) using Bidirectional LSTM, Gradient Boosted Trees, and automated BESS dispatch.
          </div>
        </div>

        {/* Bottom Metrics Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 32px",
            backgroundColor: "rgba(15, 23, 42, 0.8)",
            borderRadius: "16px",
            border: "1px solid #334155",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase" }}>Primary Model</span>
            <span style={{ fontSize: "20px", fontWeight: "bold", color: "#a78bfa" }}>Bi-LSTM with Attention</span>
          </div>
          <div style={{ width: "1px", height: "36px", backgroundColor: "#334155" }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase" }}>Peak Evening Ramp</span>
            <span style={{ fontSize: "20px", fontWeight: "bold", color: "#fbbf24" }}>+9,000 MW / 3-Hour</span>
          </div>
          <div style={{ width: "1px", height: "36px", backgroundColor: "#334155" }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase" }}>Forecasting Horizon</span>
            <span style={{ fontSize: "20px", fontWeight: "bold", color: "#38bdf8" }}>24 Hours Ahead</span>
          </div>
          <div style={{ width: "1px", height: "36px", backgroundColor: "#334155" }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase" }}>Standard</span>
            <span style={{ fontSize: "20px", fontWeight: "bold", color: "#34d399" }}>NERC BAL-003</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
