import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grid Scenario Stress Simulator & Renewable Penetration Sandbox",
  description:
    "Simulate extreme temperature heatwaves, severe cloud storms, and ultra-deep duck curve scenarios to stress-test grid frequency stability and renewable curtailment risks.",
  alternates: {
    canonical: "/scenarios",
  },
  openGraph: {
    title: "Grid Scenario Stress Simulator | GridForecaster",
    description:
      "Interactive climate stress testing and renewable penetration simulation for bulk power system reliability.",
    url: "https://grid-demand-forecast.vercel.app/scenarios",
  },
};

export default function ScenariosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
