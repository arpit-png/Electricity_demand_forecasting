import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Automated Ramp Dispatch & Battery Energy Storage (BESS)",
  description:
    "Automated dispatch controller balancing the 3-hour evening net load ramp (+9,000 MW) through coordinated battery storage discharge and fast-start gas peaker spooling.",
  alternates: {
    canonical: "/dispatch",
  },
  openGraph: {
    title: "Automated Ramp Dispatch & BESS Controller | GridForecaster",
    description:
      "Calculates required fast-ramping gas peaker spooling and utility-scale battery energy storage discharge to prevent frequency deviation.",
    url: "https://grid-demand-forecast.vercel.app/dispatch",
  },
};

export default function DispatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
