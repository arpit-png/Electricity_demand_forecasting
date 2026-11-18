"use client";

import React, { useState, useMemo } from "react";
import {
  generate24HourForecast,
  DEFAULT_SCENARIOS,
  ScenarioParams,
  GridSummary,
} from "@/lib/forecasting-engine";
import { formatMW, formatMWh } from "@/lib/utils";
import { GoogleCloudHeader } from "@/components/google/GoogleCloudHeader";
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
  CheckCircle2,
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
    showNotification(`Activated Vertex AI scenario preset: ${key.toUpperCase()}`);
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
    <div className="relative min-h-screen text-[#e8eaed] bg-[#131314] pb-32 overflow-x-hidden selection:bg-[#8ab4f8] selection:text-[#041e49] font-sans">
      {/* Interactive Google 4-Color Ambient Fluid Canvas */}
      <SkiperFluidCanvas mode={fluidMode} intensity={0.85} />

      {/* Google Cloud Enterprise Header */}
      <GoogleCloudHeader
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        frequencyHz={50.0}
      />

      {/* Google Material 3 Dynamic Island HUD */}
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
        <div className="fixed bottom-24 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#202124]/95 border border-[#8ab4f8]/40 text-[#8ab4f8] text-xs font-sans font-medium shadow-2xl backdrop-blur-2xl">
          <Sparkles className="w-4 h-4 text-[#8ab4f8]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top BigQuery & Vertex AI Telemetry Ticker Marquee */}
      <div>
        <SkiperTicker />
      </div>

      {/* Main Container */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12 relative z-10">
        {/* Hero Section */}
        <section className="relative pt-4 pb-2">
          <div className="flex flex-col items-start gap-4">
            {/* Google Cloud System Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#202124] border border-[#3c4043] text-xs font-sans font-medium text-[#e8eaed] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#34a853] shadow-[0_0_8px_#34a853]" />
              <span className="text-[#8ab4f8]">GOOGLE CLOUD PLATFORM</span>
              <span className="text-[#5f6368]">|</span>
              <span className="text-[#e8eaed]">VERTEX AI NET DEMAND ENGINE</span>
              <span className="text-[#5f6368]">|</span>
              <span className="text-[#81c995]">IEEE 1547 COMPLIANT</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#e8eaed] max-w-4xl font-sans leading-[1.15]">
              Electricity Demand Forecasting Using Machine Learning
            </h1>

            {/* Universal Problem & Mathematical Solution Statement */}
            <p className="text-sm sm:text-base text-[#9aa0a6] max-w-3xl font-sans leading-relaxed">
              Traditional electric infrastructure struggles with the <strong className="text-[#fdd663]">"Duck Curve"</strong>—the rapid fluctuation in net generation caused by decentralized solar and wind energy. When solar generation drops off sharply in the evening just as household demand surges, the grid faces sudden power shortages and blackout risks. Instead of predicting gross consumption, this Google Cloud pipeline forecasts <strong className="text-white">Net Demand (Gross Demand minus Solar/Wind Generation)</strong> using <strong className="text-[#c58af9]">DeepMind Bidirectional LSTM</strong>, <strong className="text-[#8ab4f8]">Vertex AI Boosted Trees (XGBoost)</strong>, and <strong className="text-[#fdd663]">TensorFlow Ridge Regression</strong> to accurately predict when the transmission grid requires backup power.
            </p>

            {/* Google Material 3 Hero Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById("visualizer");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-sans font-semibold text-xs tracking-tight transition-all duration-200 shadow-sm"
              >
                <Zap className="w-4 h-4 text-[#fdd663]" />
                <span>Inspect 24h Duck Curve</span>
              </button>

              <button
                onClick={() => setIsHistoryModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#202124] hover:bg-[#303134] text-[#e8eaed] border border-[#3c4043] font-sans font-medium text-xs tracking-tight transition-all duration-200"
              >
                <Database className="w-4 h-4 text-[#fbbc04]" />
                <span>Cloud Firestore Vault</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById("models");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#202124] hover:bg-[#303134] text-[#e8eaed] border border-[#3c4043] font-sans font-medium text-xs tracking-tight transition-all duration-200"
              >
                <Cpu className="w-4 h-4 text-[#8ab4f8]" />
                <span>Vertex AI Benchmarks</span>
              </button>

              <button
                onClick={triggerEmergencyDispatch}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0d2818] hover:bg-[#143a24] text-[#81c995] border border-[#81c995]/30 font-sans font-medium text-xs tracking-tight transition-all duration-200"
              >
                <BatteryCharging className="w-4 h-4 text-[#81c995]" />
                <span>Emergency Dispatch (+2 GW BESS)</span>
              </button>
            </div>
          </div>

          {/* Real-Time Telemetry Counters */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#3c4043]">
            <SkiperStatCard
              label="Peak Gross Consumption"
              value={formatMW(forecast.summary.peakGrossDemand)}
              subValue={`at ${forecast.summary.peakGrossHour}`}
              trend="neutral"
              trendLabel="Total Transmission Load"
              variant="blue"
              icon={<Zap className="w-4 h-4 text-[#8ab4f8]" />}
              badge="BigQuery"
            />

            <SkiperStatCard
              label="Solar Belly (Min Net Load)"
              value={formatMW(forecast.summary.minNetDemand)}
              subValue={`at ${forecast.summary.minNetHour}`}
              trend="warning"
              trendLabel="Midday Solar Influx"
              variant="warning"
              icon={<Sun className="w-4 h-4 text-[#fbbc04]" />}
              badge="Overgeneration"
            />

            <SkiperStatCard
              label="3-Hour Evening Ramp"
              value={`+${formatMW(forecast.summary.threeHourRampMW)}`}
              subValue="17:00 → 20:00"
              trend={forecast.summary.threeHourRampMW > 9000 ? "up" : "warning"}
              trendLabel={forecast.summary.threeHourRampMW > 9000 ? "CRITICAL RAMP" : "Moderate Slope"}
              variant={forecast.summary.threeHourRampMW > 9000 ? "critical" : "warning"}
              icon={<AlertTriangle className="w-4 h-4 text-[#ea4335]" />}
              badge="Peak Gradient"
            />

            <SkiperStatCard
              label="Peaker Reserve Required"
              value={formatMW(forecast.summary.backupPowerNeededMW)}
              subValue="Fast-Start Turbines"
              trend={forecast.summary.backupPowerNeededMW > 0 ? "up" : "down"}
              trendLabel={forecast.summary.backupPowerNeededMW > 0 ? "Spooling Required" : "Zero Margin Deficit"}
              variant={forecast.summary.backupPowerNeededMW > 0 ? "critical" : "success"}
              icon={<Flame className="w-4 h-4 text-[#ea4335]" />}
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
            <span className="text-xs font-sans font-medium text-[#8ab4f8] uppercase tracking-wide">
              INTERACTIVE GRID COMPARISON
            </span>
            <h3 className="text-xl font-bold font-sans text-[#e8eaed]">
              Unmitigated Duck Curve vs. Vertex AI Pre-Dispatch Stabilization
            </h3>
            <p className="text-xs text-[#9aa0a6] font-sans">
              Drag the split slider to observe how proactive 3-hour machine learning forecasting shaves the evening ramp and prevents grid instability.
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

      {/* Floating Google Material 3 Action Dock */}
      <SkiperDock onOpenVault={() => setIsHistoryModalOpen(true)} />

      {/* Database History Modal */}
      <SimulationHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        currentParams={params}
        currentSummary={forecast.summary}
        onLoadScenario={(newParams) => {
          setParams(newParams);
          showNotification("Restored scenario from Google Cloud database archive!");
        }}
      />

      {/* Google Cloud Enterprise Footer */}
      <footer className="mt-20 border-t border-[#3c4043] py-10 text-xs font-sans text-[#9aa0a6] text-center max-w-[1400px] mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[#e8eaed]">
            <span className="w-2 h-2 rounded-full bg-[#4285f4]" />
            <span className="font-medium font-sans">Google Cloud Platform • Electricity Net Demand Forecasting Engine</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[#9aa0a6] font-sans">
            <span>Google Cloud BigQuery</span>
            <span>•</span>
            <span>Vertex AI (Bi-LSTM & XGBoost)</span>
            <span>•</span>
            <span>Cloud Firestore</span>
            <span>•</span>
            <span>IEEE 1547 Standards</span>
          </div>

          <div className="text-[11px] text-[#9aa0a6] font-mono">
            Vercel Edge Ready • Production Deployed
          </div>
        </div>
      </footer>
    </div>
  );
}
