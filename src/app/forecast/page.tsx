"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DuckCurveVisualizer } from "@/components/DuckCurveVisualizer";
import { SkiperComparisonSlider } from "@/components/skiper-ui/skiper-comparison-slider";
import { SkiperStatCard } from "@/components/skiper-ui/skiper-stat-card";
import {
  generate24HourForecast,
  DEFAULT_SCENARIOS,
  HourlyDataPoint,
} from "@/lib/forecasting-engine";
import { formatMW } from "@/lib/utils";
import {
  Zap,
  Sun,
  AlertTriangle,
  Flame,
  ArrowRight,
  Download,
  Cpu,
  Sliders,
  BatteryCharging,
} from "lucide-react";

export default function ForecastPage() {
  const [selectedHour, setSelectedHour] = useState<number>(18);
  const forecast = useMemo(() => {
    return generate24HourForecast(DEFAULT_SCENARIOS["summer-normal"]);
  }, []);

  const downloadCSV = () => {
    const headers = [
      "Hour",
      "Time",
      "Gross Demand (MW)",
      "Solar Gen (MW)",
      "Wind Gen (MW)",
      "Net Demand (MW)",
      "LSTM Pred (MW)",
      "XGBoost Pred (MW)",
      "Ramp Rate (MW/h)",
      "Status",
    ];
    const rows = forecast.data.map((d) => [
      d.hour,
      d.timeLabel,
      d.grossDemand,
      d.solarGen,
      d.windGen,
      d.netDemand,
      d.lstmPrediction,
      d.gradientBoostingPrediction,
      d.rampRate,
      d.alertLevel,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `forecast_telemetry_24h_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar frequencyHz={50.0} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <Breadcrumbs items={[{ label: "24h Duck Curve Forecast" }]} />

        {/* Page Header */}
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/60 dark:border-blue-900/60 dark:text-blue-400">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>24-HOUR SYNCHRONOUS TELEMETRY • CAISO / NERC STANDARD</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            24-Hour Net Demand Forecasting &amp; Duck Curve Telemetry
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            Real-time multi-stream telemetry tracking gross grid consumption, distributed photovoltaic overgeneration, wind farm contributions, and predicted net load. Evaluated across 24 synchronous hourly intervals to identify and mitigate the 3-hour evening ramp gradient.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-md transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Telemetry Dataset (.CSV)</span>
            </button>
            <Link
              href="/models"
              className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 transition-all shadow-sm"
            >
              <Cpu className="w-3.5 h-3.5 text-violet-500" />
              <span>Inspect ML Benchmarks</span>
            </Link>
            <Link
              href="/dispatch"
              className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 transition-all shadow-sm"
            >
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
              <span>Open Ramp Dispatch</span>
            </Link>
          </div>
        </section>

        {/* Telemetry Stat Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SkiperStatCard
            label="Peak Gross Consumption"
            value={formatMW(forecast.summary.peakGrossDemand)}
            subValue={`at ${forecast.summary.peakGrossHour}`}
            trend="neutral"
            trendLabel="Total Transmission Load"
            variant="blue"
            icon={<Zap className="w-4 h-4" />}
            badge="Gross Load"
          />
          <SkiperStatCard
            label="Duck Belly (Min Net Load)"
            value={formatMW(forecast.summary.minNetDemand)}
            subValue={`at ${forecast.summary.minNetHour}`}
            trend="warning"
            trendLabel="Solar Overgeneration"
            variant="warning"
            icon={<Sun className="w-4 h-4" />}
            badge="Min Net Load"
          />
          <SkiperStatCard
            label="3-Hour Evening Ramp"
            value={`+${formatMW(forecast.summary.threeHourRampMW)}`}
            subValue="17:00 → 20:00"
            trend={forecast.summary.threeHourRampMW > 9000 ? "up" : "warning"}
            trendLabel={forecast.summary.threeHourRampMW > 9000 ? "CRITICAL RAMP" : "Moderate Slope"}
            variant={forecast.summary.threeHourRampMW > 9000 ? "critical" : "warning"}
            icon={<AlertTriangle className="w-4 h-4" />}
            badge="Gradient"
          />
          <SkiperStatCard
            label="Peaker Reserve Required"
            value={formatMW(forecast.summary.backupPowerNeededMW)}
            subValue="Fast-Start Turbines"
            trend={forecast.summary.backupPowerNeededMW > 0 ? "up" : "down"}
            trendLabel={forecast.summary.backupPowerNeededMW > 0 ? "Spooling Required" : "Zero Deficit"}
            variant={forecast.summary.backupPowerNeededMW > 0 ? "critical" : "success"}
            icon={<Flame className="w-4 h-4" />}
            badge="Emergency"
          />
        </section>

        {/* The Signature Duck Curve Visualizer */}
        <section>
          <DuckCurveVisualizer
            data={forecast.data}
            summary={forecast.summary}
            selectedHour={selectedHour}
            onSelectHour={setSelectedHour}
          />
        </section>

        {/* Split Comparison Slider */}
        <section>
          <div className="mb-4">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              SPLIT COMPARISON ANALYSIS
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Unmitigated Volatility vs. Proactive ML Dispatch
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Drag the boundary slider to inspect the impact of automated 3-hour pre-dispatch battery injection.
            </p>
          </div>
          <SkiperComparisonSlider />
        </section>

        {/* Hourly Breakdown Table */}
        <section className="p-6 rounded-2xl border bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Synchronous 24-Hour Telemetry Log
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                All measurements formatted in Megawatts (MW) adhering to IEEE 1547.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-mono">
                <tr>
                  <th className="py-2.5 px-3">Hour</th>
                  <th className="py-2.5 px-3">Gross Demand</th>
                  <th className="py-2.5 px-3">Solar PV</th>
                  <th className="py-2.5 px-3">Wind Influx</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">Net Demand</th>
                  <th className="py-2.5 px-3 text-violet-600 dark:text-violet-400">Bi-LSTM</th>
                  <th className="py-2.5 px-3 text-blue-600 dark:text-blue-400">XGBoost</th>
                  <th className="py-2.5 px-3">Ramp Rate</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {forecast.data.map((row) => (
                  <tr
                    key={row.hour}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                      row.isPeakRamp ? "bg-amber-50/50 dark:bg-amber-950/20" : ""
                    }`}
                  >
                    <td className="py-2.5 px-3 font-semibold">{row.timeLabel}</td>
                    <td className="py-2.5 px-3">{formatMW(row.grossDemand)}</td>
                    <td className="py-2.5 px-3 text-amber-600 dark:text-amber-400">{formatMW(row.solarGen)}</td>
                    <td className="py-2.5 px-3 text-cyan-600 dark:text-cyan-400">{formatMW(row.windGen)}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{formatMW(row.netDemand)}</td>
                    <td className="py-2.5 px-3 text-violet-600 dark:text-violet-400">{formatMW(row.lstmPrediction)}</td>
                    <td className="py-2.5 px-3 text-blue-600 dark:text-blue-400">{formatMW(row.gradientBoostingPrediction)}</td>
                    <td className="py-2.5 px-3 font-semibold">
                      {row.rampRate > 0 ? `+${formatMW(row.rampRate)}/h` : `${formatMW(row.rampRate)}/h`}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          row.alertLevel === "critical"
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                            : row.alertLevel === "advisory"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                        }`}
                      >
                        {row.alertLevel.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Cross-Page Navigation */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="text-xs font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
          >
            &larr; Central Overview Hub
          </Link>
          <Link
            href="/models"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <span>Proceed to Machine Learning Model Benchmarks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
