"use client";

import React from "react";
import { GridSummary, HourlyDataPoint } from "@/lib/forecasting-engine";
import { formatMW, formatMWh } from "@/lib/utils";
import { BentoCard } from "./skiper-ui/skiper-bento-grid";
import { ShieldAlert, Zap, BatteryCharging, AlertTriangle, Flame, Clock } from "lucide-react";
import { SkiperMagneticButton } from "./skiper-ui/skiper-magnetic-button";

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
      glowColor={isCritical ? "rose" : isElevated ? "amber" : "emerald"}
      badge="GRID RELIABILITY & DISPATCH ENGINE"
      title="Peaker Spool-Up & Blackout Prevention Controller"
      subtitle="Automated dispatch decisions calculating rapid reserve requirements to absorb solar belly and supply evening neck."
      className="col-span-12 lg:col-span-4"
    >
      <div className="space-y-4 text-xs font-mono">
        {/* Status Alarm Banner */}
        <div
          className={`p-3.5 rounded-xl border flex items-start gap-3 ${
            isCritical
              ? "bg-rose-950/40 border-rose-500/40 text-rose-300"
              : isElevated
              ? "bg-amber-950/40 border-amber-500/40 text-amber-300"
              : "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
          }`}
        >
          {isCritical ? (
            <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 animate-bounce" />
          ) : isElevated ? (
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          ) : (
            <Zap className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          )}

          <div>
            <div className="font-bold text-sm text-white">
              {isCritical
                ? "CRITICAL PEAKER DISPATCH ACTIVE"
                : isElevated
                ? "ELEVATED RAMP RATE DETECTED"
                : "GRID BALANCED & SYNCHRONIZED"}
            </div>
            <div className="text-[11px] mt-1 text-slate-300 leading-tight">
              {isCritical
                ? "3-Hour net demand ramp exceeds 9,000 MW. Fast-start turbines and full BESS capacity dispatched to prevent localized brownouts."
                : isElevated
                ? "Moderate ramp detected between 17:00 and 20:00. Spinning reserves and hydro pumped-storage queued on hot standby."
                : "Renewable influx absorbed safely; dispatch margins within NERC reliability standards."}
            </div>
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div className="space-y-2">
          <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-between">
            <span className="text-slate-400">3-Hour Evening Ramp:</span>
            <span className={`font-bold text-sm ${summary.threeHourRampMW > 9000 ? "text-rose-400" : "text-amber-400"}`}>
              +{formatMW(summary.threeHourRampMW)}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-between">
            <span className="text-slate-400">Required Peaker Backup:</span>
            <span className="font-bold text-sm text-white flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              {formatMW(summary.backupPowerNeededMW)}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-between">
            <span className="text-slate-400">BESS Midday Solar Absorbed:</span>
            <span className="font-bold text-sm text-emerald-300">
              {formatMWh(summary.batteryEnergyAbsorbedMWh)}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-between">
            <span className="text-slate-400">Evening BESS Discharged:</span>
            <span className="font-bold text-sm text-cyan-300">
              {formatMWh(summary.batteryEnergyDischargedMWh)}
            </span>
          </div>

          {summary.curtailmentMW > 0 && (
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-amber-300">
              <span>Curtailment Excess:</span>
              <span className="font-bold">+{formatMW(summary.curtailmentMW)}</span>
            </div>
          )}
        </div>

        {/* Peaker Spool-Up Notice */}
        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] text-slate-400 space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Spool-Up Lead Time Advisory</span>
          </div>
          <p>
            Simple-cycle gas turbines require 15–20 minutes pre-warming before reaching full governor frequency synchronization. The LSTM model anticipates the ramp 3 hours in advance.
          </p>
        </div>

        {/* Action Button */}
        <SkiperMagneticButton
          onClick={onTriggerEmergencyDispatch}
          variant={isCritical ? "danger" : "primary"}
          size="md"
          className="w-full"
          icon={<Zap className="w-4 h-4" />}
        >
          {isCritical ? "Trigger Blackout Prevention Protocols" : "Force Reserve Dispatch Test"}
        </SkiperMagneticButton>
      </div>
    </BentoCard>
  );
};
