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
import { DuckCurveVisualizer } from "@/components/DuckCurveVisualizer";
import { ModelComparisonMatrix } from "@/components/ModelComparisonMatrix";
import { ScenarioSimulator } from "@/components/ScenarioSimulator";
import { DispatchController } from "@/components/DispatchController";
import { TeamCreditsDossier } from "@/components/TeamCreditsDossier";
import { SimulationHistoryModal } from "@/components/SimulationHistoryModal";
import {
  Zap,
  Sun,
  AlertTriangle,
  BatteryCharging,
  Cpu,
  Database,
  ArrowRight,
  TrendingDown,
  ShieldAlert,
  Flame,
  Award,
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
    // Increase battery power and peaker reserve to alleviate the ramp
    setParams((prev) => ({
      ...prev,
      batteryCapacityMWh: Math.min(30000, prev.batteryCapacityMWh + 5000),
      batteryMaxPowerMW: Math.min(8000, prev.batteryMaxPowerMW + 2000),
    }));
    showNotification("Emergency reserve dispatched: BESS discharge capacity boosted by +2,000 MW!");
  };

  const batteryStatusText = `${(forecast.summary.batteryEnergyDischargedMWh / 1000).toFixed(1)} / ${(params.batteryCapacityMWh / 1000).toFixed(1)} GWh`;

  return (
    <div className="relative min-h-screen text-slate-100 pb-24">
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
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-950/90 border border-cyan-500/40 text-cyan-200 text-xs font-mono shadow-2xl backdrop-blur-xl animate-bounce">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Telemetry Ticker Marquee */}
      <div className="pt-20">
        <SkiperTicker />
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* Hero Section */}
        <section className="relative pt-6 pb-4">
          <div className="flex flex-col items-start gap-4">
            {/* Meta Tags Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>TEAM 08 • DATA SCIENCE CAPSTONE PROJECT</span>
              <span className="text-slate-600">|</span>
              <span className="text-amber-300">5TH SEMESTER</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">VERCEL DEPLOYMENT READY</span>
            </div>

            {/* Title with Skiper Text Reveal */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl font-sans leading-[1.1]">
              <SkiperTextReveal
                text="Electricity Demand Forecasting Using Machine Learning"
                highlightWords={["Forecasting", "Machine", "Learning"]}
              />
            </h1>

            {/* Problem & Solution Statement */}
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl font-mono leading-relaxed">
              Traditional infrastructure struggles with the <strong className="text-amber-400">"Duck Curve"</strong>—the rapid fluctuation in power availability caused by decentralized solar and wind energy. Instead of predicting gross consumption, our machine learning pipeline forecasts <strong className="text-cyan-400">Net Demand (Total Demand minus Renewable Generation)</strong> using <strong className="text-purple-400">LSTM Neural Networks</strong>, <strong className="text-sky-400">Gradient Boosting</strong>, and <strong className="text-emerald-400">Time-Series Regression</strong> to alert the grid hours before blackout-inducing evening ramps occur.
            </p>

            {/* Hero Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <SkiperMagneticButton
                onClick={() => {
                  const el = document.getElementById("visualizer");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                variant="primary"
                size="md"
                icon={<Zap className="w-4 h-4 text-slate-950" />}
              >
                Explore 24h Duck Curve
              </SkiperMagneticButton>

              <SkiperMagneticButton
                onClick={() => setIsHistoryModalOpen(true)}
                variant="secondary"
                size="md"
                icon={<Database className="w-4 h-4 text-cyan-400" />}
              >
                Database History Vault
              </SkiperMagneticButton>

              <SkiperMagneticButton
                onClick={() => {
                  const el = document.getElementById("models");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                variant="secondary"
                size="md"
                icon={<Cpu className="w-4 h-4 text-purple-400" />}
              >
                Compare ML Models
              </SkiperMagneticButton>
            </div>
          </div>

          {/* Quick Real-Time Stat Strip */}
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

        {/* Section 2: Interactive Parameter Sandbox & Grid Dispatch Engine */}
        <section className="grid grid-cols-12 gap-6">
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

        {/* Section 4: Team Credits Dossier & Academic Presentation */}
        <section id="team" className="scroll-mt-24">
          <TeamCreditsDossier data={forecast.data} />
        </section>
      </main>

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

      {/* Footer */}
      <footer className="mt-20 border-t border-white/[0.08] py-10 text-xs font-mono text-slate-500 text-center max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Electricity Demand Forecasting Using Machine Learning • Team 08</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <span>Rishikant Sharma</span>
            <span>•</span>
            <span>Sachin Sengar</span>
            <span>•</span>
            <span>Nihad Khan</span>
            <span>•</span>
            <span>Ayush Singh Bhadauria</span>
            <span>•</span>
            <span className="text-cyan-300 font-bold">Arpit Shukla</span>
          </div>

          <div className="text-[11px] text-slate-500">
            Engineered with Skiper UI & Awwwards Standard Design
          </div>
        </div>
      </footer>
    </div>
  );
}
