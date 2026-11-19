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
            <span style={{ fontSize: "28px", fontWeight: "bold", letterSpacing: "-0.5px" }}>
              GridForecaster
            </span>
          </div>
          <span style={{ fontSize: "14px", color: "#34d399", fontWeight: "bold" }}>
            ● 50.00 Hz • IEEE 1547 COMPLIANT
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: "48px", fontWeight: "800", lineHeight: 1.2 }}>
            Electricity Demand Forecasting Using Machine Learning
          </div>
          <div style={{ fontSize: "20px", color: "#94a3b8" }}>
            Real-time Net Demand Forecasting solving the Duck Curve evening ramp deficit with Bi-LSTM Neural Networks and XGBoost.
          </div>
        </div>

        <div style={{ display: "flex", gap: "24px", color: "#60a5fa", fontSize: "16px", fontWeight: "600" }}>
          <span>✓ Bi-LSTM with Attention</span>
          <span>✓ Gradient Boosted Trees</span>
          <span>✓ Automated BESS Dispatch</span>
          <span>✓ Resilient Telemetry</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
