"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ScenarioSimulator } from "@/components/ScenarioSimulator";
import { DispatchController } from "@/components/DispatchController";
import { SimulationHistoryModal } from "@/components/SimulationHistoryModal";
import {
  generate24HourForecast,
  DEFAULT_SCENARIOS,
  ScenarioParams,
} from "@/lib/forecasting-engine";
import {
  Sliders,
  Database,
  BatteryCharging,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function ScenariosPage() {
  const [params, setParams] = useState<ScenarioParams>(
    DEFAULT_SCENARIOS["summer-normal"]
  );
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const forecast = useMemo(() => {
    return generate24HourForecast(params);
  }, [params]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const triggerEmergencyDispatch = () => {
    setParams((prev) => ({
      ...prev,
      batteryCapacityMWh: Math.min(30000, prev.batteryCapacityMWh + 5000),
      batteryMaxPowerMW: Math.min(8000, prev.batteryMaxPowerMW + 2000),
    }));
    showNotification("Emergency reserve dispatched: BESS capacity augmented!");
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        frequencyHz={50.0}
      />

      {notification && (
        <div className="fixed bottom-24 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-2xl border text-xs font-medium bg-white/90 border-slate-200 text-slate-800 dark:bg-slate-900/90 dark:border-slate-800 dark:text-slate-100">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span>{notification}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <Breadcrumbs items={[{ label: "Grid Scenario Sandbox" }]} />

        {/* Page Header */}
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/60 dark:border-amber-900/60 dark:text-amber-400">
            <Sliders className="w-3.5 h-3.5 text-amber-500" />
            <span>DYNAMIC STRESS-TEST ENGINE • MULTI-VARIABLE PARAMETRIC SIMULATOR</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Grid Scenario Stress Simulator &amp; Curtailment Sandbox
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            Modify transmission operating conditions in real time. Simulate intense heatwaves (+41°C ambient cooling surge), sudden cloud cover storms (-65% PV collapse), and aggressive solar penetration to evaluate grid flexibility and storage adequacy.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setIsHistoryModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-md transition-all active:scale-95"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Open Scenario Snapshot Vault</span>
            </button>
            <Link
              href="/dispatch"
              className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 transition-all shadow-sm"
            >
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
              <span>Verify Automated Ramp Dispatch</span>
            </Link>
          </div>
        </section>

        {/* Simulator Grid */}
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

        {/* Cross Navigation */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/models"
            className="text-xs font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
          >
            &larr; Machine Learning Benchmarks
          </Link>
          <Link
            href="/dispatch"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <span>Proceed to Automated Ramp Dispatch</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>

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
    </div>
  );
}
