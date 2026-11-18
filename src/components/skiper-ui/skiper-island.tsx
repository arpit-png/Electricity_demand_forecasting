"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Zap, AlertTriangle, ShieldCheck, BatteryCharging, ChevronDown } from "lucide-react";
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
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-950/40",
      dot: "bg-emerald-400 shadow-[0_0_12px_#34d399]",
      label: "Grid Synchronized",
      icon: ShieldCheck,
    },
    ELEVATED_RAMP: {
      color: "text-amber-400 border-amber-500/30 bg-amber-950/40",
      dot: "bg-amber-400 shadow-[0_0_12px_#fbbf24]",
      label: "Elevated Ramp Warning",
      icon: Activity,
    },
    CRITICAL_DISPATCH_REQUIRED: {
      color: "text-rose-400 border-rose-500/30 bg-rose-950/40",
      dot: "bg-rose-400 shadow-[0_0_14px_#f43f5e] animate-ping",
      label: "Duck Ramp Alert: Peaker Dispatch Active",
      icon: AlertTriangle,
    },
  }[status];

  const Icon = statusConfig.icon;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-auto">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={cn(
          "relative overflow-hidden backdrop-blur-xl border rounded-full px-4 py-2 transition-colors duration-300 shadow-2xl",
          "bg-[#0e1219]/90 border-white/10 hover:border-white/20",
          isExpanded ? "rounded-2xl px-6 py-4" : ""
        )}
      >
        {/* Subtle top glow highlight */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

        {/* Collapsed Bar */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 cursor-pointer select-none text-xs font-mono tracking-wide"
        >
          <div className="flex items-center gap-2">
            <span className={cn("w-2 h-2 rounded-full", statusConfig.dot)} />
            <span className="font-semibold text-slate-200">ISO-NET DEMAND HUD</span>
          </div>

          <div className="h-3 w-[1px] bg-white/10 hidden sm:block" />

          <div className={cn("hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px]", statusConfig.color)}>
            <Icon className="w-3 h-3" />
            <span>{statusConfig.label}</span>
          </div>

          <div className="h-3 w-[1px] bg-white/10 hidden md:block" />

          <div className="hidden md:flex items-center gap-1 text-slate-300 text-[11px]">
            <span className="text-slate-500">Ramp:</span>
            <span className="text-amber-300 font-bold">{(threeHourRampMW / 1000).toFixed(1)} GW/3h</span>
          </div>

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-slate-400 hover:text-white ml-1"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.div>
        </div>

        {/* Expanded Drawer Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-3 min-w-[310px] sm:min-w-[420px]"
            >
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-1">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3 h-3 text-cyan-400" />
                    Peaker Spool Reserve
                  </span>
                  <span className="text-base font-bold text-white font-mono">
                    {backupPowerNeededMW > 0 ? `${backupPowerNeededMW.toLocaleString()} MW` : "0 MW (Idle)"}
                  </span>
                  <span className="text-[10px] text-slate-400">Natural gas quick-start units</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-1">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <BatteryCharging className="w-3 h-3 text-emerald-400" />
                    Battery Storage (BESS)
                  </span>
                  <span className="text-base font-bold text-emerald-300 font-mono">
                    {batteryStatus}
                  </span>
                  <span className="text-[10px] text-slate-400">Belly absorbing / Neck discharge</span>
                </div>
              </div>

              {/* Quick Scenario Toggles */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] uppercase font-mono text-slate-400">Quick Scenario Injections:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  <button
                    onClick={() => {
                      onQuickScenario?.("summer-normal");
                      setIsExpanded(false);
                    }}
                    className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 hover:text-white transition-colors border border-white/5"
                  >
                    ☀️ Normal
                  </button>
                  <button
                    onClick={() => {
                      onQuickScenario?.("heatwave");
                      setIsExpanded(false);
                    }}
                    className="px-2 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-[11px] text-rose-300 hover:text-rose-200 transition-colors border border-rose-500/20"
                  >
                    🔥 Heatwave
                  </button>
                  <button
                    onClick={() => {
                      onQuickScenario?.("cloud-storm");
                      setIsExpanded(false);
                    }}
                    className="px-2 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-[11px] text-sky-300 hover:text-sky-200 transition-colors border border-sky-500/20"
                  >
                    ⛈️ Cloud Storm
                  </button>
                  <button
                    onClick={() => {
                      onQuickScenario?.("high-renewables");
                      setIsExpanded(false);
                    }}
                    className="px-2 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-[11px] text-amber-300 hover:text-amber-200 transition-colors border border-amber-500/20"
                  >
                    ⚡ Deep Duck
                  </button>
                </div>
              </div>

              {onOpenHistory && (
                <button
                  onClick={() => {
                    onOpenHistory();
                    setIsExpanded(false);
                  }}
                  className="w-full text-center py-1.5 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 hover:underline transition-colors pt-1 border-t border-white/5"
                >
                  View Database Simulation Logs →
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
