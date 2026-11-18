"use client";

import React from "react";
import { GridSummary, HourlyDataPoint } from "@/lib/forecasting-engine";
import { formatMW, formatMWh } from "@/lib/utils";
import { BentoCard } from "./skiper-ui/skiper-bento-grid";
import { ShieldAlert, Zap, AlertTriangle, Flame, Clock } from "lucide-react";

interface DispatchControllerProps {
  summary: GridSummary;
  data: HourlyDataPoint[];
  onTriggerEmergencyDispatch: () => void;
}

export const DispatchController: React.FC<DispatchControllerProps> = ({
  summary,
  data,
  onTriggerEmergencyDispatch,
}) => {
  const isCritical = summary.overallStatus === "CRITICAL_DISPATCH_REQUIRED";
  const isElevated = summary.overallStatus === "ELEVATED_RAMP";

  return (
    <BentoCard
      glowColor={isCritical ? "rose" : isElevated ? "amber" : "green"}
      badge="GRID DISPATCH & RELIABILITY ORCHESTRATOR"
      title="Peaker Spool & Blackout Prevention Engine"
      subtitle="Automated reserve dispatch to absorb solar belly and supply evening ramp neck."
      className="col-span-12 lg:col-span-4"
    >
      <div className="space-y-4 text-xs">
        {/* Status Alarm Banner */}
        <div
          className={`p-3.5 rounded-xl border flex items-start gap-3 ${
            isCritical
              ? "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-300"
              : isElevated
              ? "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/60 dark:border-amber-900 dark:text-amber-300"
              : "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-900 dark:text-emerald-300"
          }`}
        >
          {isCritical ? (
            <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          ) : isElevated ? (
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          ) : (
            <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          )}

          <div>
            <div className="font-semibold text-sm">
              {isCritical
                ? "CRITICAL PEAKER DISPATCH ACTIVE"
                : isElevated
                ? "ELEVATED RAMP RATE DETECTED"
                : "GRID BALANCED & SYNCHRONIZED"}
            </div>
            <div className="text-[11px] mt-1 leading-relaxed text-slate-600 dark:text-slate-400">
              {isCritical
                ? "3-Hour net demand ramp exceeds threshold. Fast-start turbines and full BESS capacity dispatched to prevent localized brownouts."
                : isElevated
                ? "Moderate ramp detected between 17:00 and 20:00. Spinning reserves and hydro pumped-storage queued on hot standby."
                : "Renewable influx absorbed safely; dispatch margins within NERC reliability standards."}
            </div>
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div className="space-y-2">
          <div className="p-2.5 rounded-lg border bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">3-Hour Evening Ramp:</span>
            <span className={`font-bold font-mono text-sm ${summary.threeHourRampMW > 9000 ? "text-rose-600 dark:text-rose-400" : "text-amber-600 dark:text-amber-400"}`}>
              +{formatMW(summary.threeHourRampMW)}
            </span>
          </div>

          <div className="p-2.5 rounded-lg border bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Required Peaker Backup:</span>
            <span className="font-bold font-mono text-sm text-slate-900 dark:text-white flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              {formatMW(summary.backupPowerNeededMW)}
            </span>
          </div>

          <div className="p-2.5 rounded-lg border bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">BESS Midday Solar Absorbed:</span>
            <span className="font-bold font-mono text-sm text-emerald-600 dark:text-emerald-400">
              {formatMWh(summary.batteryEnergyAbsorbedMWh)}
            </span>
          </div>

          <div className="p-2.5 rounded-lg border bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Evening BESS Discharged:</span>
            <span className="font-bold font-mono text-sm text-blue-600 dark:text-blue-400">
              {formatMWh(summary.batteryEnergyDischargedMWh)}
            </span>
          </div>

          {summary.curtailmentMW > 0 && (
            <div className="p-2.5 rounded-lg border bg-amber-50 border-amber-200 dark:bg-amber-950/60 dark:border-amber-900 flex items-center justify-between">
              <span className="text-amber-800 dark:text-amber-300">Solar Curtailment Incurred:</span>
              <span className="font-bold font-mono text-sm text-amber-700 dark:text-amber-300">
                {formatMW(summary.curtailmentMW)}
              </span>
            </div>
          )}
        </div>

        {/* Turbine Pre-Spinning Lead Time Advisory */}
        <div className="p-3 rounded-lg border bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>Gas Peaker Lead Time Timeline</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Aeroderivative turbines take 10-15 minutes; combined cycle takes 45+ minutes.
            The ML model forecasts net load 3 hours ahead, eliminating emergency spinning deficits.
          </div>
        </div>

        {/* Emergency Dispatch Button */}
        <button
          onClick={onTriggerEmergencyDispatch}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-xs tracking-tight transition-all duration-200 shadow-sm bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.98]"
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span>Manual Emergency Dispatch (+2,000 MW BESS)</span>
        </button>
      </div>
    </BentoCard>
  );
};
