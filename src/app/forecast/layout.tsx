import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "24-Hour Net Demand Forecasting & Duck Curve Telemetry",
  description:
    "Inspect synchronous 24-hour gross load, distributed photovoltaic generation, wind influx, and net demand curves with automated 3-hour evening ramp alerts.",
  alternates: {
    canonical: "/forecast",
  },
  openGraph: {
    title: "24-Hour Net Demand Forecasting & Duck Curve Telemetry | GridForecaster",
    description:
      "Interactive 24-hour net load telemetry and automated 3-hour evening ramp detection adhering to IEEE 1547 standards.",
    url: "https://grid-demand-forecast.vercel.app/forecast",
  },
};

export default function ForecastLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
