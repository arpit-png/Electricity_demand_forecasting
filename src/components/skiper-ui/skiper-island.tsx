"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Zap, AlertTriangle, ShieldCheck, BatteryCharging, ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkiperIslandProps {
  status: "STABLE" | "ELEVATED_RAMP" | "CRITICAL_DISPATCH_REQUIRED";
  threeHourRampMW: number;
  backupPowerNeededMW: number;
  batteryStatus: string;
  onQuickScenario?: (scenario: "summer-normal" | "heatwave" | "cloud-storm" | "high-renewables") => void;
  onOpenHistory?: () => void;
}

export const SkiperIsland: React.FC<SkiperIslandProps> = ({
  status,
  threeHourRampMW,
  backupPowerNeededMW,
  batteryStatus,
  onQuickScenario,
  onOpenHistory,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusConfig = {
    STABLE: {
      color: "text-[#81c995] border-[#81c995]/30 bg-[#0d2818]",
      dot: "bg-[#34a853] shadow-[0_0_8px_rgba(52,168,83,0.6)]",
      label: "Grid Synchronized (Nominal)",
      icon: ShieldCheck,
    },
    ELEVATED_RAMP: {
      color: "text-[#fdd663] border-[#fdd663]/30 bg-[#332800]",
      dot: "bg-[#fbbc04] shadow-[0_0_8px_rgba(251,188,4,0.6)]",
      label: "Elevated Duck Ramp Warning",
      icon: Activity,
    },
    CRITICAL_DISPATCH_REQUIRED: {
      color: "text-[#f28b82] border-[#f28b82]/30 bg-[#331111]",
      dot: "bg-[#ea4335] shadow-[0_0_8px_rgba(234,67,53,0.7)]",
      label: "Critical Duck Ramp: Peakers Spooling",
      icon: AlertTriangle,
    },
  }[status];

  const Icon = statusConfig.icon;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-auto">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={cn(
          "relative overflow-hidden backdrop-blur-2xl border rounded-full px-4 py-2 transition-colors duration-300 shadow-xl",
          "bg-[#202124]/95 border-[#3c4043] hover:border-[#8ab4f8]/50",
          isExpanded ? "rounded-3xl px-6 py-5 max-w-xl w-[92vw] sm:w-auto" : ""
        )}
      >
        {/* Google 4-color hairline accent glow */}
        <div className="absolute inset-x-0 top-0 h-[2px] google-brand-bar opacity-80" />

        {/* Collapsed Bar */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 cursor-pointer select-none text-xs font-sans tracking-tight"
        >
          <div className="flex items-center gap-2">
            <span className={cn("w-2.5 h-2.5 rounded-full", statusConfig.dot)} />
            <span className="font-semibold text-[#e8eaed] font-sans">GRID TELEMETRY HUD</span>
          </div>

          <div className="h-3 w-[1px] bg-[#3c4043] hidden sm:block" />

          {/* Alert Status Pill */}
          <div className={cn("hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-sans font-medium", statusConfig.color)}>
            <Icon className="w-3.5 h-3.5" />
            <span>{statusConfig.label}</span>
          </div>

          <div className="h-3 w-[1px] bg-[#3c4043] hidden md:block" />

          {/* Ramp metric */}
          <div className="hidden md:flex items-center gap-1 text-[#9aa0a6] text-[11px] font-sans">
            <span>3h Ramp:</span>
            <span className="text-[#fdd663] font-bold font-mono">
              {(threeHourRampMW / 1000).toFixed(1)} GW
            </span>
          </div>

          <div className="text-[#9aa0a6] hover:text-white ml-1">
            <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", isExpanded ? "rotate-180" : "")} />
          </div>
        </div>

        {/* Expanded Drawer */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 pt-4 border-t border-[#3c4043] space-y-4 font-sans"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-[#18191c] border border-[#3c4043]">
                  <div className="flex items-center gap-1.5 text-xs text-[#9aa0a6] mb-1">
                    <Activity className="w-3.5 h-3.5 text-[#fdd663]" />
                    <span>Max 3-Hour Ramp</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-[#fdd663]">
                    {threeHourRampMW.toLocaleString()} MW
                  </div>
                  <span className="text-[10px] text-[#9aa0a6]">Evening collapse gradient</span>
                </div>

                <div className="p-3 rounded-xl bg-[#18191c] border border-[#3c4043]">
                  <div className="flex items-center gap-1.5 text-xs text-[#9aa0a6] mb-1">
                    <Zap className="w-3.5 h-3.5 text-[#f28b82]" />
                    <span>Peaker Spool Demand</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-[#f28b82]">
                    {backupPowerNeededMW.toLocaleString()} MW
                  </div>
                  <span className="text-[10px] text-[#9aa0a6]">Fast-start gas requirement</span>
                </div>

                <div className="p-3 rounded-xl bg-[#18191c] border border-[#3c4043]">
                  <div className="flex items-center gap-1.5 text-xs text-[#9aa0a6] mb-1">
                    <BatteryCharging className="w-3.5 h-3.5 text-[#81c995]" />
                    <span>BESS Storage Buffer</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-[#81c995]">
                    {batteryStatus}
                  </div>
                  <span className="text-[10px] text-[#9aa0a6]">Grid-scale absorption & dispatch</span>
                </div>
              </div>

              {/* Quick Scenario Preset Chips */}
              {onQuickScenario && (
                <div>
                  <div className="text-xs text-[#9aa0a6] font-medium mb-2 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#8ab4f8]" />
                    <span>Vertex AI Scenario Simulator Presets:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onQuickScenario("summer-normal")}
                      className="px-3 py-1 rounded-full text-xs bg-[#28292c] hover:bg-[#303134] text-[#e8eaed] border border-[#3c4043] transition-colors"
                    >
                      ☀️ Summer Baseline
                    </button>
                    <button
                      onClick={() => onQuickScenario("heatwave")}
                      className="px-3 py-1 rounded-full text-xs bg-[#331111] hover:bg-[#441616] text-[#f28b82] border border-[#f28b82]/30 transition-colors"
                    >
                      🔥 41°C Heatwave
                    </button>
                    <button
                      onClick={() => onQuickScenario("cloud-storm")}
                      className="px-3 py-1 rounded-full text-xs bg-[#1b2b44] hover:bg-[#25395a] text-[#8ab4f8] border border-[#8ab4f8]/30 transition-colors"
                    >
                      ⛈️ Cloud Storm
                    </button>
                    <button
                      onClick={() => onQuickScenario("high-renewables")}
                      className="px-3 py-1 rounded-full text-xs bg-[#332800] hover:bg-[#443600] text-[#fdd663] border border-[#fdd663]/30 transition-colors"
                    >
                      ⚡ Deep Duck (24 GW Solar)
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
