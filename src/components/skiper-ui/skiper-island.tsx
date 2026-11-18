"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Zap, AlertTriangle, ShieldCheck, BatteryCharging, ChevronDown, Sliders } from "lucide-react";
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
      color: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/60 dark:border-emerald-800",
      dot: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
      label: "Grid Synchronized (Nominal)",
      icon: ShieldCheck,
    },
    ELEVATED_RAMP: {
      color: "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/60 dark:border-amber-800",
      dot: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]",
      label: "Elevated Duck Ramp Warning",
      icon: Activity,
    },
    CRITICAL_DISPATCH_REQUIRED: {
      color: "text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-950/60 dark:border-rose-800",
      dot: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]",
      label: "Critical Ramp: Peakers Spooling",
      icon: AlertTriangle,
    },
  }[status];

  const Icon = statusConfig.icon;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-auto">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={cn(
          "relative overflow-hidden backdrop-blur-2xl border rounded-full px-4 py-2 transition-all duration-300 shadow-lg",
          "bg-white/95 border-slate-200 text-slate-800 hover:border-slate-300",
          "dark:bg-[#111827]/95 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700",
          isExpanded ? "rounded-3xl px-6 py-5 max-w-xl w-[92vw] sm:w-auto" : ""
        )}
      >
        {/* Subtle hairline top accent */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-80" />

        {/* Collapsed Bar */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 cursor-pointer select-none text-xs tracking-tight"
        >
          <div className="flex items-center gap-2">
            <span className={cn("w-2.5 h-2.5 rounded-full", statusConfig.dot)} />
            <span className="font-semibold text-slate-900 dark:text-white">GRID TELEMETRY HUD</span>
          </div>

          <div className="h-3 w-[1px] bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          {/* Alert Status Pill */}
          <div className={cn("hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-medium", statusConfig.color)}>
            <Icon className="w-3.5 h-3.5" />
            <span>{statusConfig.label}</span>
          </div>

          <div className="h-3 w-[1px] bg-slate-200 dark:bg-slate-700 hidden md:block" />

          {/* Ramp metric */}
          <div className="hidden md:flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[11px]">
            <span>3h Ramp:</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold font-mono">
              {(threeHourRampMW / 1000).toFixed(1)} GW
            </span>
          </div>

          <div className="text-slate-400 hover:text-slate-600 dark:hover:text-white ml-1">
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
              className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <Activity className="w-3.5 h-3.5 text-amber-500" />
                    <span>Max 3-Hour Ramp</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400">
                    {threeHourRampMW.toLocaleString()} MW
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Evening collapse gradient</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <Zap className="w-3.5 h-3.5 text-rose-500" />
                    <span>Peaker Spool Demand</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400">
                    {backupPowerNeededMW.toLocaleString()} MW
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Fast-start gas requirement</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
                    <span>BESS Storage Buffer</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {batteryStatus}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Battery absorption & dispatch</span>
                </div>
              </div>

              {/* Quick Scenario Preset Chips */}
              {onQuickScenario && (
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2 flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-blue-500" />
                    <span>Preset Grid Stress Scenarios:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onQuickScenario("summer-normal")}
                      className="px-3 py-1 rounded-full text-xs font-medium transition-colors bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700"
                    >
                      ☀️ Summer Baseline
                    </button>
                    <button
                      onClick={() => onQuickScenario("heatwave")}
                      className="px-3 py-1 rounded-full text-xs font-medium transition-colors bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:hover:bg-rose-900 dark:text-rose-300 dark:border-rose-800"
                    >
                      🔥 41°C Heatwave
                    </button>
                    <button
                      onClick={() => onQuickScenario("cloud-storm")}
                      className="px-3 py-1 rounded-full text-xs font-medium transition-colors bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:hover:bg-blue-900 dark:text-blue-300 dark:border-blue-800"
                    >
                      ⛈️ Cloud Storm
                    </button>
                    <button
                      onClick={() => onQuickScenario("high-renewables")}
                      className="px-3 py-1 rounded-full text-xs font-medium transition-colors bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900 dark:text-amber-300 dark:border-amber-800"
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
