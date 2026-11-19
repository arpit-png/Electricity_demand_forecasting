import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  AlertTriangle,
  Home,
  LineChart,
  Cpu,
  Sliders,
  BatteryCharging,
  Layers,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export const metadata = {
  title: "404 - Grid Telemetry Node Unreachable | GridForecaster",
  description:
    "The requested grid telemetry route or transmission node could not be resolved. Please verify the URL or return to central dispatch.",
  alternates: {
    canonical: "/404",
  },
};

export default function NotFound() {
  const routes = [
    {
      href: "/forecast",
      title: "24h Duck Curve Forecast",
      desc: "Live 24-hour synchronous net load, solar and wind telemetry curves.",
      icon: LineChart,
      color: "text-blue-500",
      border: "hover:border-blue-500/50",
    },
    {
      href: "/models",
      title: "ML Model Benchmarks",
      desc: "Bidirectional LSTM with attention, XGBoost, and Ridge comparative metrics.",
      icon: Cpu,
      color: "text-violet-500",
      border: "hover:border-violet-500/50",
    },
    {
      href: "/scenarios",
      title: "Grid Scenario Sandbox",
      desc: "Stress-test ambient temperature, solar surge, and wind variation.",
      icon: Sliders,
      color: "text-amber-500",
      border: "hover:border-amber-500/50",
    },
    {
      href: "/dispatch",
      title: "Automated Ramp Dispatch",
      desc: "Fast-start gas peaker spooling and utility-scale BESS battery dispatch.",
      icon: BatteryCharging,
      color: "text-emerald-500",
      border: "hover:border-emerald-500/50",
    },
    {
      href: "/architecture",
      title: "SCADA System Architecture",
      desc: "4-layer ingestion, transformation, inference, and dispatch architecture.",
      icon: Layers,
      color: "text-cyan-500",
      border: "hover:border-cyan-500/50",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar frequencyHz={50.0} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Breadcrumbs items={[{ label: "404 Telemetry Lost" }]} />

        <div className="text-center space-y-6 pt-4 pb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900/60 dark:text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>ERROR CODE 404 • TELEMETRY DISCONNECT</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Requested Grid Telemetry Node Not Found
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            The requested transmission route or dispatch endpoint is unavailable or does not exist in the active SCADA routing directory.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-md transition-all active:scale-95"
            >
              <Home className="w-4 h-4" />
              <span>Return to Central Dispatch Hub</span>
            </Link>

            <Link
              href="/forecast"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-medium bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 transition-all shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
              <span>Inspect Live Duck Curve</span>
            </Link>
          </div>
        </div>

        {/* Available Clean Slug Routes */}
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 text-center">
            Verified Transmission Routing Nodes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {routes.map((r) => {
              const Icon = r.icon;
              return (
                <Link
                  key={r.href}
                  href={r.href}
                  className={`p-4 rounded-xl border bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 transition-all group ${r.border}`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <Icon className={`w-4 h-4 ${r.color}`} />
                    <span className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {r.title}
                    </span>
                    <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                    {r.desc}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
