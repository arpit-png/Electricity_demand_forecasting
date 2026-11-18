import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Electricity Demand Forecasting Using Machine Learning | Duck Curve Net Demand ML Engine",
  description: "Advanced Net Demand (Gross Demand minus Solar/Wind Renewables) forecasting pipeline solving the universal Duck Curve grid instability and evening ramp challenge using LSTM, Gradient Boosting, and Multivariate Regression.",
  keywords: [
    "Duck Curve",
    "Net Demand Forecasting",
    "Machine Learning",
    "LSTM",
    "Gradient Boosting",
    "Regression",
    "Grid Stability",
    "Renewable Energy",
    "California Duck Curve",
    "Transmission Grid Reliability",
    "Energy Transition Analytics"
  ],
  authors: [{ name: "Transmission System Engineering Group" }],
  openGraph: {
    title: "Electricity Demand Forecasting Using Machine Learning",
    description: "Machine Learning pipeline solving the universal Duck Curve problem by forecasting Net Demand with LSTM and Gradient Boosting.",
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
      <body className="min-h-screen bg-[#07090e] text-slate-100 antialiased selection:bg-cyan-500 selection:text-slate-950">
        {/* Subtle grid pattern background */}
        <div className="fixed inset-0 bg-noise-scrim pointer-events-none z-0 opacity-60" />
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
