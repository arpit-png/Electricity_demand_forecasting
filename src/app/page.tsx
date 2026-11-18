"use client";

import React, { useState, useMemo } from "react";
import {
  generate24HourForecast,
  DEFAULT_SCENARIOS,
  ScenarioParams,
  GridSummary,
} from "@/lib/forecasting-engine";
import { formatMW, formatMWh } from "@/lib/utils";
import { SkiperIsland } from "@/components/skiper-ui/skiper-island";
import { SkiperTicker } from "@/components/skiper-ui/skiper-ticker";
import { SkiperStatCard } from "@/components/skiper-ui/skiper-stat-card";
import { SkiperTextReveal } from "@/components/skiper-ui/skiper-text-reveal";
import { SkiperMagneticButton } from "@/components/skiper-ui/skiper-magnetic-button";
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
    <div className="relative min-h-screen text-zinc-100 pb-32 overflow-x-hidden selection:bg-[#d4af37] selection:text-[#09090c]">
      {/* Interactive Liquid / Glass Ambient Fluid Canvas */}
      <SkiperFluidCanvas mode={fluidMode} intensity={0.9} />

      {/* Skiper Floating Dynamic Island HUD */}
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
        <div className="fixed bottom-20 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#141419]/95 border border-[#d4af37]/30 text-[#e6cca0] text-xs font-mono shadow-2xl backdrop-blur-2xl">
          <Zap className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Telemetry Ticker Marquee */}
      <div className="pt-20">
        <SkiperTicker />
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12 relative z-10">
        {/* Hero Section */}
        <section className="relative pt-6 pb-4">
          <div className="flex flex-col items-start gap-4">
            {/* System Status Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18181f]/80 border border-white/[0.08] text-xs font-mono text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] shadow-[0_0_6px_#d4af37]" />
              <span className="text-[#e5c268]">TRANSMISSION SYSTEMS ARCHITECTURE</span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-400">NET DEMAND FORECASTING PIPELINE</span>
              <span className="text-zinc-600">|</span>
              <span className="text-[#5a9a7c]">IEEE 1547 COMPLIANT</span>
            </div>

            {/* Title with Skiper Text Reveal */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl font-sans leading-[1.1]">
              <SkiperTextReveal
                text="Electricity Demand Forecasting Using Machine Learning"
                highlightWords={["Forecasting", "Machine", "Learning"]}
              />
            </h1>

            {/* Universal Problem & Mathematical Solution Statement */}
            <p className="text-sm sm:text-base text-zinc-400 max-w-3xl font-mono leading-relaxed">
              Traditional electrical infrastructure struggles with the <strong className="text-[#e5c268]">"Duck Curve"</strong>—the rapid fluctuation in power availability caused by decentralized solar and wind energy. When renewable generation drops off sharply in the evening just as household demand spikes, the grid faces sudden power shortages. Instead of standard consumption, this pipeline forecasts <strong className="text-zinc-200">Net Demand (Total Demand minus Renewable Generation)</strong> using <strong className="text-[#9d8ec2]">LSTM Neural Networks</strong>, <strong className="text-[#8fa8c0]">Gradient Boosting</strong>, and <strong className="text-[#d1b181]">Time-Series Regression</strong> to accurately predict when the grid will need backup power.
            </p>

            {/* Hero Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <SkiperMagneticButton
                onClick={() => {
                  const el = document.getElementById("visualizer");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                variant="primary"
                size="md"
                icon={<Zap className="w-4 h-4 text-zinc-950" />}
              >
                Inspect 24h Duck Curve
              </SkiperMagneticButton>

              <SkiperMagneticButton
                onClick={() => setIsHistoryModalOpen(true)}
                variant="secondary"
                size="md"
                icon={<Database className="w-4 h-4 text-[#d4af37]" />}
              >
                Database Simulation Vault
              </SkiperMagneticButton>

              <SkiperMagneticButton
                onClick={() => {
                  const el = document.getElementById("models");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                variant="secondary"
                size="md"
                icon={<Cpu className="w-4 h-4 text-[#9d8ec2]" />}
              >
                Benchmarked ML Models
              </SkiperMagneticButton>
            </div>
          </div>

          {/* Real-Time Telemetry Counters */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/[0.08]">
            <SkiperStatCard
              label="Peak Gross Consumption"
              value={formatMW(forecast.summary.peakGrossDemand)}
              unit={`at ${forecast.summary.peakGrossHour}`}
              change="Total Grid Load"
              changeType="neutral"
              highlightColor="cyan"
              icon={<Zap className="w-4 h-4" />}
            />

            <SkiperStatCard
              label="Duck Belly (Min Net Load)"
              value={formatMW(forecast.summary.minNetDemand)}
              unit={`at ${forecast.summary.minNetHour}`}
              change="Midday Solar Influx"
              changeType="warning"
              highlightColor="amber"
              icon={<Sun className="w-4 h-4" />}
            />

            <SkiperStatCard
              label="3-Hour Evening Ramp"
              value={`+${formatMW(forecast.summary.threeHourRampMW)}`}
              unit="17:00 → 20:00"
              change={forecast.summary.threeHourRampMW > 9000 ? "CRITICAL RAMP" : "Moderate Slope"}
              changeType={forecast.summary.threeHourRampMW > 9000 ? "negative" : "warning"}
              highlightColor="rose"
              icon={<AlertTriangle className="w-4 h-4" />}
            />

            <SkiperStatCard
              label="Peaker Reserve Required"
              value={formatMW(forecast.summary.backupPowerNeededMW)}
              unit="Fast-Start Turbines"
              change={forecast.summary.backupPowerNeededMW > 0 ? "Spooling Required" : "Idle Margin"}
              changeType={forecast.summary.backupPowerNeededMW > 0 ? "negative" : "positive"}
              highlightColor={forecast.summary.backupPowerNeededMW > 0 ? "rose" : "emerald"}
              icon={<Flame className="w-4 h-4" />}
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

      {/* Floating macOS / MotionSites Interactive Dock */}
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

      {/* Institutional Footer */}
      <footer className="mt-20 border-t border-white/[0.08] py-10 text-xs font-mono text-zinc-500 text-center max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
            <span>Electricity Demand Forecasting Using Machine Learning • System Telemetry</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-zinc-400">
            <span>Time-Series Forecasting</span>
            <span>•</span>
            <span>Multivariate Regression</span>
            <span>•</span>
            <span>Deep Bidirectional LSTM</span>
            <span>•</span>
            <span>Gradient Boosted Trees</span>
          </div>

          <div className="text-[11px] text-zinc-500">
            Production Vercel Ready • Cloud Firestore Persistent
          </div>
        </div>
      </footer>
    </div>
  );
}
