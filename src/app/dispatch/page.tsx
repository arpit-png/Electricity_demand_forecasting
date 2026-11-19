"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DispatchController } from "@/components/DispatchController";
import { SkiperStatCard } from "@/components/skiper-ui/skiper-stat-card";
import {
  generate24HourForecast,
  DEFAULT_SCENARIOS,
  ScenarioParams,
} from "@/lib/forecasting-engine";
import { formatMW, formatMWh } from "@/lib/utils";
import {
  BatteryCharging,
  Zap,
  Flame,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

export default function DispatchPage() {
  const [params, setParams] = useState<ScenarioParams>(
    DEFAULT_SCENARIOS["summer-normal"]
  );

  const forecast = useMemo(() => {
    return generate24HourForecast(params);
  }, [params]);

  const triggerEmergencyDispatch = () => {
    setParams((prev) => ({
      ...prev,
      batteryCapacityMWh: Math.min(30000, prev.batteryCapacityMWh + 5000),
      batteryMaxPowerMW: Math.min(8000, prev.batteryMaxPowerMW + 2000),
    }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar frequencyHz={50.0} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <Breadcrumbs items={[{ label: "Automated Ramp Dispatch" }]} />

        {/* Page Header */}
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/60 dark:border-emerald-900/60 dark:text-emerald-400">
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
            <span>DISPATCH ORCHESTRATION • NERC BAL-003 FREQUENCY CONTROL</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Automated Ramp Dispatch &amp; Battery Energy Storage (BESS)
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            Autonomous dispatch optimizer synchronizing fast-response battery energy storage (BESS) and aeroderivative gas peaker turbines to counter the steep evening net load ramp (+9,000 MW/3h) while absorbing midday solar overgeneration.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={triggerEmergencyDispatch}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-md transition-all active:scale-95"
            >
              <BatteryCharging className="w-3.5 h-3.5 text-white" />
              <span>Boost BESS Reserve (+2,000 MW)</span>
            </button>
            <Link
              href="/architecture"
              className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 transition-all shadow-sm"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-500" />
              <span>Inspect SCADA Telemetry Pipeline</span>
            </Link>
          </div>
        </section>

        {/* Dispatch Metrics Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SkiperStatCard
            label="3-Hour Evening Ramp"
            value={`+${formatMW(forecast.summary.threeHourRampMW)}`}
            subValue="17:00 → 20:00"
            trend={forecast.summary.threeHourRampMW > 9000 ? "up" : "warning"}
            trendLabel={forecast.summary.threeHourRampMW > 9000 ? "CRITICAL RAMP" : "Normal Gradient"}
            variant={forecast.summary.threeHourRampMW > 9000 ? "critical" : "warning"}
            icon={<AlertTriangle className="w-4 h-4" />}
            badge="Gradient"
          />
          <SkiperStatCard
            label="BESS Discharged Energy"
            value={formatMWh(forecast.summary.batteryEnergyDischargedMWh)}
            subValue={`Max Power: ${formatMW(params.batteryMaxPowerMW)}`}
            trend="down"
            trendLabel="Active Peak Shaving"
            variant="blue"
            icon={<BatteryCharging className="w-4 h-4" />}
            badge="Storage"
          />
          <SkiperStatCard
            label="Fast Peaker Capacity"
            value={formatMW(forecast.summary.backupPowerNeededMW)}
            subValue="Thermal Reserve"
            trend={forecast.summary.backupPowerNeededMW > 0 ? "up" : "down"}
            trendLabel={forecast.summary.backupPowerNeededMW > 0 ? "Spooling Online" : "Zero Deficit"}
            variant={forecast.summary.backupPowerNeededMW > 0 ? "critical" : "success"}
            icon={<Flame className="w-4 h-4" />}
            badge="Generation"
          />
          <SkiperStatCard
            label="Grid Compliance State"
            value="PASS"
            subValue="50.00 Hz Frequency Lock"
            trend="neutral"
            trendLabel="NERC BAL-003 Compliant"
            variant="success"
            icon={<ShieldCheck className="w-4 h-4" />}
            badge="Reliability"
          />
        </section>

        {/* Dispatch Controller Component */}
        <section className="max-w-4xl mx-auto w-full">
          <DispatchController
            summary={forecast.summary}
            data={forecast.data}
            onTriggerEmergencyDispatch={triggerEmergencyDispatch}
          />
        </section>

        {/* Cross Navigation */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/scenarios"
            className="text-xs font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
          >
            &larr; Grid Scenario Sandbox
          </Link>
          <Link
            href="/architecture"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <span>Proceed to System Architecture Specifications</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
