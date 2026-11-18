import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";

export const metadata: Metadata = {
  title: "Electricity Net Demand Forecasting | Duck Curve Machine Learning Platform",
  description: "Advanced time-series forecasting pipeline solving the universal Duck Curve grid instability and 3-hour evening ramp challenge using Bidirectional LSTM, Gradient Boosted Trees, and Multivariate Regression.",
  keywords: [
    "Duck Curve",
    "Net Demand Forecasting",
    "Machine Learning",
    "Bidirectional LSTM",
    "Gradient Boosting",
    "XGBoost",
    "Grid Stability",
    "Renewable Energy Dispatch",
    "IEEE 1547",
    "NERC Reliability",
  ],
  authors: [{ name: "Transmission System Engineering Group" }],
  openGraph: {
    title: "Electricity Net Demand Forecasting | Duck Curve ML Platform",
    description: "Time-series machine learning system forecasting net electricity demand to prevent evening ramp blackouts and optimize storage dispatch.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-blue-500 selection:text-white">
        <ThemeProvider>
          {/* Subtle grid pattern background */}
          <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0 opacity-80" />
          <div className="relative z-10 flex flex-col min-h-screen">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
