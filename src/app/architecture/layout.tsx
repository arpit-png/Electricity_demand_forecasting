import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Architecture & SCADA Telemetry Specification",
  description:
    "Technical architectural blueprint of the 4-layer grid analytics pipeline: SCADA Telemetry Ingestion, Net Demand Transformation, Multi-Model Inference, and Automated Ramp Dispatch.",
  alternates: {
    canonical: "/architecture",
  },
  openGraph: {
    title: "System Architecture & SCADA Specifications | GridForecaster",
    description:
      "4-layer energy engineering architecture adhering to IEEE 1547 and NERC BAL-003 bulk power reliability standards.",
    url: "https://grid-demand-forecast.vercel.app/architecture",
  },
};

export default function ArchitectureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
