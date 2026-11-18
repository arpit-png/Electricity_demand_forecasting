"use client";

import React from "react";
import { GridSummary, HourlyDataPoint } from "@/lib/forecasting-engine";
import { formatMW, formatMWh } from "@/lib/utils";
import { BentoCard } from "./skiper-ui/skiper-bento-grid";
import { ShieldAlert, Zap, AlertTriangle, Flame, Clock } from "lucide-react";
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
      glowColor={isCritical ? "terracotta" : isElevated ? "gold" : "sage"}
      badge="GRID RELIABILITY & DISPATCH ENGINE"
      title="Peaker Spool-Up & Blackout Prevention Controller"
      subtitle="Automated reserve requirements to absorb solar belly and supply evening ramp neck."
      className="col-span-12 lg:col-span-4"
    >
      <div className="space-y-4 text-xs font-mono">
        {/* Status Alarm Banner */}
        <div
          className={`p-3.5 rounded-xl border flex items-start gap-3 ${
            isCritical
              ? "bg-[#251715] border-[#c86754]/30 text-[#e07563]"
              : isElevated
              ? "bg-[#211d14] border-[#d4af37]/30 text-[#e5c268]"
              : "bg-[#141d18] border-[#5a9a7c]/30 text-[#6aa88a]"
          }`}
        >
          {isCritical ? (
            <ShieldAlert className="w-5 h-5 text-[#c86754] flex-shrink-0" />
          ) : isElevated ? (
            <AlertTriangle className="w-5 h-5 text-[#d4af37] flex-shrink-0" />
          ) : (
            <Zap className="w-5 h-5 text-[#5a9a7c] flex-shrink-0" />
          )}

          <div>
            <div className="font-semibold text-sm text-zinc-100">
              {isCritical
                ? "CRITICAL PEAKER DISPATCH ACTIVE"
                : isElevated
                ? "ELEVATED RAMP RATE DETECTED"
                : "GRID BALANCED & SYNCHRONIZED"}
            </div>
            <div className="text-[11px] mt-1 text-zinc-400 leading-tight">
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
          <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <span className="text-zinc-400">3-Hour Evening Ramp:</span>
            <span className={`font-bold text-sm ${summary.threeHourRampMW > 9000 ? "text-[#e07563]" : "text-[#e5c268]"}`}>
              +{formatMW(summary.threeHourRampMW)}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <span className="text-zinc-400">Required Peaker Backup:</span>
            <span className="font-bold text-sm text-zinc-100 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#c86754]" />
              {formatMW(summary.backupPowerNeededMW)}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <span className="text-zinc-400">BESS Midday Solar Absorbed:</span>
            <span className="font-bold text-sm text-[#6aa88a]">
              {formatMWh(summary.batteryEnergyAbsorbedMWh)}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <span className="text-zinc-400">Evening BESS Discharged:</span>
            <span className="font-bold text-sm text-[#8fa8c0]">
              {formatMWh(summary.batteryEnergyDischargedMWh)}
            </span>
          </div>

          {summary.curtailmentMW > 0 && (
            <div className="p-2.5 rounded-lg bg-[#211d14] border border-[#d4af37]/20 flex items-center justify-between text-[#e5c268]">
              <span>Curtailment Excess:</span>
              <span className="font-bold">+{formatMW(summary.curtailmentMW)}</span>
            </div>
          )}
        </div>

        {/* Peaker Spool-Up Notice */}
        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] text-zinc-400 space-y-1.5">
          <div className="flex items-center gap-1.5 text-zinc-200 font-medium">
            <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Spool-Up Lead Time Advisory</span>
          </div>
          <p className="text-zinc-400 text-[11px]">
            Simple-cycle gas turbines require 15–20 minutes pre-warming before reaching full governor synchronization. The LSTM model anticipates the ramp 3 hours in advance.
          </p>
        </div>

        {/* Action Button */}
        <SkiperMagneticButton
          onClick={onTriggerEmergencyDispatch}
          variant={isCritical ? "danger" : "amber"}
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
