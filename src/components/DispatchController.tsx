"use client";

import React from "react";
import { GridSummary, HourlyDataPoint } from "@/lib/forecasting-engine";
import { formatMW, formatMWh } from "@/lib/utils";
import { BentoCard } from "./skiper-ui/skiper-bento-grid";
import { ShieldAlert, Zap, AlertTriangle, Flame, Clock, Radio, CheckCircle } from "lucide-react";
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
      glowColor={isCritical ? "red" : isElevated ? "yellow" : "green"}
      badge="GOOGLE CLOUD DISPATCH ORCHESTRATOR"
      title="Peaker Spool & Blackout Prevention Engine"
      subtitle="Automated reserve dispatch to absorb solar belly and supply evening ramp neck."
      className="col-span-12 lg:col-span-4"
    >
      <div className="space-y-4 text-xs font-sans">
        {/* Status Alarm Banner */}
        <div
          className={`p-3.5 rounded-xl border flex items-start gap-3 ${
            isCritical
              ? "bg-[#331111] border-[#ea4335]/40 text-[#f28b82]"
              : isElevated
              ? "bg-[#332800] border-[#fbbc04]/40 text-[#fdd663]"
              : "bg-[#0d2818] border-[#34a853]/40 text-[#81c995]"
          }`}
        >
          {isCritical ? (
            <ShieldAlert className="w-5 h-5 text-[#ea4335] shrink-0" />
          ) : isElevated ? (
            <AlertTriangle className="w-5 h-5 text-[#fbbc04] shrink-0" />
          ) : (
            <Zap className="w-5 h-5 text-[#34a853] shrink-0" />
          )}

          <div>
            <div className="font-semibold text-sm text-[#e8eaed]">
              {isCritical
                ? "CRITICAL PEAKER DISPATCH ACTIVE"
                : isElevated
                ? "ELEVATED RAMP RATE DETECTED"
                : "GRID BALANCED & SYNCHRONIZED"}
            </div>
            <div className="text-[11px] mt-1 text-[#9aa0a6] leading-relaxed">
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
          <div className="p-2.5 rounded-lg bg-[#18191c] border border-[#3c4043] flex items-center justify-between">
            <span className="text-[#9aa0a6]">3-Hour Evening Ramp:</span>
            <span className={`font-bold font-mono text-sm ${summary.threeHourRampMW > 9000 ? "text-[#f28b82]" : "text-[#fdd663]"}`}>
              +{formatMW(summary.threeHourRampMW)}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#18191c] border border-[#3c4043] flex items-center justify-between">
            <span className="text-[#9aa0a6]">Required Peaker Backup:</span>
            <span className="font-bold font-mono text-sm text-[#e8eaed] flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#ea4335]" />
              {formatMW(summary.backupPowerNeededMW)}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#18191c] border border-[#3c4043] flex items-center justify-between">
            <span className="text-[#9aa0a6]">BESS Midday Solar Absorbed:</span>
            <span className="font-bold font-mono text-sm text-[#81c995]">
              {formatMWh(summary.batteryEnergyAbsorbedMWh)}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#18191c] border border-[#3c4043] flex items-center justify-between">
            <span className="text-[#9aa0a6]">Evening BESS Discharged:</span>
            <span className="font-bold font-mono text-sm text-[#8ab4f8]">
              {formatMWh(summary.batteryEnergyDischargedMWh)}
            </span>
          </div>

          {summary.curtailmentMW > 0 && (
            <div className="p-2.5 rounded-lg bg-[#332800] border border-[#fbbc04]/30 flex items-center justify-between">
              <span className="text-[#fdd663]">Solar Curtailment Incurred:</span>
              <span className="font-bold font-mono text-sm text-[#fdd663]">
                {formatMW(summary.curtailmentMW)}
              </span>
            </div>
          )}
        </div>

        {/* Turbine Pre-Spinning Lead Time Advisory */}
        <div className="p-3 rounded-lg bg-[#18191c] border border-[#3c4043] space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-[#8ab4f8] font-medium">
            <Clock className="w-3.5 h-3.5 text-[#8ab4f8]" />
            <span>Gas Peaker Lead Time Timeline</span>
          </div>
          <div className="text-[11px] text-[#9aa0a6] leading-relaxed">
            Aeroderivative turbines take 10-15 minutes; combined cycle takes 45+ minutes.
            The ML model forecasts net load 3 hours ahead, eliminating emergency spinning deficits.
          </div>
        </div>

        {/* Emergency Dispatch Button in Google Blue */}
        <button
          onClick={onTriggerEmergencyDispatch}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-sans font-semibold text-xs tracking-tight transition-all duration-200 shadow-md bg-[#1a73e8] hover:bg-[#1557b0] text-white active:scale-[0.98]"
        >
          <Zap className="w-4 h-4 text-[#fdd663]" />
          <span>Manual Vertex Dispatch Trigger (+2,000 MW BESS)</span>
        </button>
      </div>
    </BentoCard>
  );
};
