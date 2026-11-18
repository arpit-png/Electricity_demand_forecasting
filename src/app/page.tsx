"use client";

import React, { useState, useMemo } from "react";
import {
  generate24HourForecast,
  DEFAULT_SCENARIOS,
  ScenarioParams,
  GridSummary,
} from "@/lib/forecasting-engine";
import { formatMW, formatMWh } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { SkiperIsland } from "@/components/skiper-ui/skiper-island";
import { SkiperTicker } from "@/components/skiper-ui/skiper-ticker";
import { SkiperStatCard } from "@/components/skiper-ui/skiper-stat-card";
import { SkiperFluidCanvas } from "@/components/skiper-ui/skiper-fluid-canvas";
import { SkiperComparisonSlider } from "@/components/skiper-ui/skiper-comparison-slider";
import { SkiperDock } from "@/components/skiper-ui/skiper-dock";
import { DuckCurveVisualizer } from "@/components/DuckCurveVisualizer";
import { ModelComparisonMatrix } from "@/components/ModelComparisonMatrix";
import { ScenarioSimulator } from "@/components/ScenarioSimulator";
import { DispatchController } from "@/components/DispatchController";
import { SystemArchitecture } from "@/components/SystemArchitecture";
import { SimulationHistoryModal } from "@/components/SimulationHistoryModal";
import {
  Zap,
  Sun,
  AlertTriangle,
  Cpu,
  Database,
  Flame,
  BatteryCharging,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const [params, setParams] = useState<ScenarioParams>(DEFAULT_SCENARIOS["summer-normal"]);
  const [selectedHour, setSelectedHour] = useState<number>(18);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Generate real-time forecast and metrics whenever parameters change
  const forecast = useMemo(() => {
    return generate24HourForecast(params);
  }, [params]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleQuickScenario = (key: keyof typeof DEFAULT_SCENARIOS) => {
    setParams(DEFAULT_SCENARIOS[key]);
    showNotification(`Activated scenario preset: ${key.toUpperCase()}`);
  };

  const triggerEmergencyDispatch = () => {
    setParams((prev) => ({
      ...prev,
      batteryCapacityMWh: Math.min(30000, prev.batteryCapacityMWh + 5000),
      batteryMaxPowerMW: Math.min(8000, prev.batteryMaxPowerMW + 2000),
    }));
    showNotification("Emergency reserve dispatched: BESS discharge capacity boosted by +2,000 MW!");
  };

  const batteryStatusText = `${(forecast.summary.batteryEnergyDischargedMWh / 1000).toFixed(1)} / ${(params.batteryCapacityMWh / 1000).toFixed(1)} GWh`;

  // Fluid canvas mode derived from selected hour and grid stress
  const fluidMode = useMemo(() => {
    if (forecast.summary.overallStatus === "CRITICAL_DISPATCH_REQUIRED" || (selectedHour >= 17 && selectedHour <= 20)) {
      return "ramp";
    }
    if (selectedHour >= 10 && selectedHour <= 15) {
      return "solar";
    }
    if (forecast.summary.batteryEnergyDischargedMWh > 0) {
      return "battery";
    }
    return "normal";
  }, [forecast.summary, selectedHour]);

  return (
    <div className="relative min-h-screen text-foreground bg-background pb-32 overflow-x-hidden transition-colors duration-300 font-sans">
      {/* Interactive Fluid Background Canvas */}
      <SkiperFluidCanvas mode={fluidMode} intensity={0.65} />

      {/* Main Navigation Bar with Smooth Theme Toggle */}
      <Navbar
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        frequencyHz={50.0}
      />

      {/* Dynamic Telemetry HUD */}
      <SkiperIsland
        status={forecast.summary.overallStatus}
        threeHourRampMW={forecast.summary.threeHourRampMW}
        backupPowerNeededMW={forecast.summary.backupPowerNeededMW}
        batteryStatus={batteryStatusText}
        onQuickScenario={handleQuickScenario}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
      />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed bottom-24 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-2xl border text-xs font-medium bg-white/90 border-slate-200 text-slate-800 dark:bg-slate-900/90 dark:border-slate-800 dark:text-slate-100">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span>{notification}</span>
        </div>
      )}

      {/* Real-Time Telemetry Ticker Marquee */}
      <div>
        <SkiperTicker />
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12 relative z-10">
        {/* Hero Section */}
        <section className="relative pt-4 pb-2">
          <div className="flex flex-col items-start gap-4">
            {/* System Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-medium shadow-sm bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="font-semibold text-blue-600 dark:text-blue-400">TRANSMISSION GRID ANALYTICS</span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span>NET DEMAND FORECASTING ENGINE</span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">IEEE 1547 COMPLIANT</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white max-w-4xl leading-[1.15]">
              Electricity Demand Forecasting Using Machine Learning
            </h1>

            {/* Universal Problem & Solution Statement */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              Traditional electrical grids struggle with the <strong className="text-amber-600 dark:text-amber-400">"Duck Curve"</strong>—the rapid fluctuation in net generation caused by decentralized solar and wind energy. When solar generation drops off sharply in the evening just as household demand surges, the grid faces sudden power shortages and blackout risks. Instead of predicting gross consumption, this pipeline forecasts <strong className="text-slate-900 dark:text-white">Net Demand (Gross Demand minus Solar/Wind Generation)</strong> using <strong className="text-violet-600 dark:text-violet-400">Bidirectional LSTM Neural Networks</strong>, <strong className="text-blue-600 dark:text-blue-400">Gradient Boosted Trees (XGBoost)</strong>, and <strong className="text-amber-600 dark:text-amber-400">Time-Series Regression</strong> to accurately predict when the grid requires backup power.
            </p>

            {/* Hero Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById("visualizer");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs tracking-tight transition-all duration-200 shadow-md active:scale-95"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Inspect 24h Duck Curve</span>
              </button>

              <button
                onClick={() => setIsHistoryModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-medium tracking-tight transition-all duration-200 shadow-sm bg-white hover:bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-800"
              >
                <Database className="w-4 h-4 text-amber-500" />
                <span>Scenario Database Vault</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById("models");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-medium tracking-tight transition-all duration-200 shadow-sm bg-white hover:bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-800"
              >
                <Cpu className="w-4 h-4 text-violet-500" />
                <span>ML Model Benchmarks</span>
              </button>

              <button
                onClick={triggerEmergencyDispatch}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-medium tracking-tight transition-all duration-200 shadow-sm bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-800"
              >
                <BatteryCharging className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Emergency Dispatch (+2 GW BESS)</span>
              </button>
            </div>
          </div>

          {/* Real-Time Telemetry Counters */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <SkiperStatCard
              label="Peak Gross Consumption"
              value={formatMW(forecast.summary.peakGrossDemand)}
              subValue={`at ${forecast.summary.peakGrossHour}`}
              trend="neutral"
              trendLabel="Total Transmission Load"
              variant="blue"
              icon={<Zap className="w-4 h-4" />}
              badge="Total Load"
            />

            <SkiperStatCard
              label="Duck Belly (Min Net Load)"
              value={formatMW(forecast.summary.minNetDemand)}
              subValue={`at ${forecast.summary.minNetHour}`}
              trend="warning"
              trendLabel="Midday Solar Influx"
              variant="warning"
              icon={<Sun className="w-4 h-4" />}
              badge="Overgeneration"
            />

            <SkiperStatCard
              label="3-Hour Evening Ramp"
              value={`+${formatMW(forecast.summary.threeHourRampMW)}`}
              subValue="17:00 → 20:00"
              trend={forecast.summary.threeHourRampMW > 9000 ? "up" : "warning"}
              trendLabel={forecast.summary.threeHourRampMW > 9000 ? "CRITICAL RAMP" : "Moderate Slope"}
              variant={forecast.summary.threeHourRampMW > 9000 ? "critical" : "warning"}
              icon={<AlertTriangle className="w-4 h-4" />}
              badge="Peak Gradient"
            />

            <SkiperStatCard
              label="Peaker Reserve Required"
              value={formatMW(forecast.summary.backupPowerNeededMW)}
              subValue="Fast-Start Turbines"
              trend={forecast.summary.backupPowerNeededMW > 0 ? "up" : "down"}
              trendLabel={forecast.summary.backupPowerNeededMW > 0 ? "Spooling Required" : "Zero Margin Deficit"}
              variant={forecast.summary.backupPowerNeededMW > 0 ? "critical" : "success"}
              icon={<Flame className="w-4 h-4" />}
              badge="Grid Security"
            />
          </div>
        </section>

        {/* Section 1: The Signature Duck Curve Visualizer */}
        <section id="visualizer" className="scroll-mt-24">
          <DuckCurveVisualizer
            data={forecast.data}
            summary={forecast.summary}
            selectedHour={selectedHour}
            onSelectHour={setSelectedHour}
          />
        </section>

        {/* Interactive Split Comparison Slider */}
        <section className="col-span-12">
          <div className="mb-3">
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              INTERACTIVE GRID COMPARISON
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Unmitigated Duck Curve vs. Machine Learning Pre-Dispatch Stabilization
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Drag the split slider to observe how proactive 3-hour forecasting shaves the evening ramp and prevents grid instability.
            </p>
          </div>
          <SkiperComparisonSlider />
        </section>

        {/* Section 2: Interactive Parameter Sandbox & Grid Dispatch Engine */}
        <section id="sandbox" className="grid grid-cols-12 gap-6 scroll-mt-24">
          <ScenarioSimulator
            params={params}
            onChange={setParams}
            onReset={() => setParams(DEFAULT_SCENARIOS["summer-normal"])}
          />

          <DispatchController
            summary={forecast.summary}
            data={forecast.data}
            onTriggerEmergencyDispatch={triggerEmergencyDispatch}
          />
        </section>

        {/* Section 3: Machine Learning Model Benchmarking Matrix */}
        <section id="models" className="scroll-mt-24">
          <ModelComparisonMatrix metrics={forecast.metrics} />
        </section>

        {/* Section 4: System Architecture & Technical Specifications */}
        <section id="architecture" className="scroll-mt-24">
          <SystemArchitecture data={forecast.data} />
        </section>
      </main>

      {/* Floating Interactive Dock */}
      <SkiperDock onOpenVault={() => setIsHistoryModalOpen(true)} />

      {/* Database History Modal */}
      <SimulationHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        currentParams={params}
        currentSummary={forecast.summary}
        onLoadScenario={(newParams) => {
          setParams(newParams);
          showNotification("Restored scenario from database archive!");
        }}
      />

      {/* Institutional Clean Footer */}
      <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 py-10 text-xs text-slate-500 dark:text-slate-400 text-center max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="font-medium">Electricity Net Demand Forecasting &amp; Duck Curve Intelligence Platform</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span>Time-Series Forecasting</span>
            <span>•</span>
            <span>Bidirectional LSTM</span>
            <span>•</span>
            <span>Gradient Boosted Trees</span>
            <span>•</span>
            <span>IEEE 1547 Standards</span>
          </div>

          <div className="text-[11px] font-mono">
            Production Vercel Ready • Resilient Database Vault
          </div>
        </div>
      </footer>
    </div>
  );
}
