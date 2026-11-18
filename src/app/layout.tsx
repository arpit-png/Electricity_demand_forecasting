import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Google Cloud | Electricity Net Demand Forecasting & Duck Curve Intelligence Engine",
  description: "Enterprise Net Demand forecasting platform solving the universal Duck Curve grid instability and 3-hour evening ramp challenge using DeepMind Bi-LSTM, Vertex AI Gradient Boosting, and BigQuery data pipelines.",
  keywords: [
    "Google Cloud",
    "Vertex AI",
    "Duck Curve",
    "Net Demand Forecasting",
    "DeepMind LSTM",
    "Gradient Boosting",
    "Grid Stability",
    "Renewable Energy Dispatch",
    "California CAISO",
    "BigQuery Energy Analytics",
    "IEEE 1547"
  ],
  authors: [{ name: "Google Cloud Energy & Utilities Engineering Group" }],
  openGraph: {
    title: "Google Cloud | Electricity Net Demand Forecasting & Duck Curve Intelligence",
    description: "Enterprise machine learning platform forecasting electricity net demand to mitigate rapid evening solar ramp and prevent blackout risk.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[#131314] text-[#e8eaed] antialiased selection:bg-[#8ab4f8] selection:text-[#041e49]">
        {/* Subtle Google engineering dot scrim */}
        <div className="fixed inset-0 bg-google-grid pointer-events-none z-0 opacity-40" />
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
