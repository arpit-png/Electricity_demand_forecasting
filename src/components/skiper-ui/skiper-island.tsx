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
      color: "text-[#5a9a7c] border-[#5a9a7c]/25 bg-[#141d18]",
      dot: "bg-[#5a9a7c] shadow-[0_0_8px_rgba(90,154,124,0.4)]",
      label: "Grid Synchronized",
      icon: ShieldCheck,
    },
    ELEVATED_RAMP: {
      color: "text-[#d4af37] border-[#d4af37]/25 bg-[#211d14]",
      dot: "bg-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.4)]",
      label: "Elevated Ramp Warning",
      icon: Activity,
    },
    CRITICAL_DISPATCH_REQUIRED: {
      color: "text-[#c86754] border-[#c86754]/30 bg-[#251715]",
      dot: "bg-[#c86754] shadow-[0_0_8px_rgba(200,103,84,0.5)]",
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
          "relative overflow-hidden backdrop-blur-2xl border rounded-full px-4 py-2 transition-colors duration-300 shadow-2xl",
          "bg-[#0e0e13]/90 border-white/[0.08] hover:border-white/[0.15]",
          isExpanded ? "rounded-2xl px-6 py-4" : ""
        )}
      >
        {/* Subtle top champagne highlight */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/25 to-transparent" />

        {/* Collapsed Bar */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 cursor-pointer select-none text-xs font-mono tracking-wide"
        >
          <div className="flex items-center gap-2">
            <span className={cn("w-2 h-2 rounded-full", statusConfig.dot)} />
            <span className="font-semibold text-zinc-200">TRANSMISSION GRID HUD</span>
          </div>

          <div className="h-3 w-[1px] bg-white/10 hidden sm:block" />

          <div className={cn("hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px]", statusConfig.color)}>
            <Icon className="w-3 h-3" />
            <span>{statusConfig.label}</span>
          </div>

          <div className="h-3 w-[1px] bg-white/10 hidden md:block" />

          <div className="hidden md:flex items-center gap-1 text-zinc-300 text-[11px]">
            <span className="text-zinc-500">Ramp:</span>
            <span className="text-[#e6cca0] font-bold">{(threeHourRampMW / 1000).toFixed(1)} GW/3h</span>
          </div>

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-zinc-400 hover:text-white ml-1"
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
              className="mt-4 pt-3 border-t border-white/[0.08] flex flex-col gap-3 min-w-[310px] sm:min-w-[420px]"
            >
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-1">
                  <span className="text-zinc-400 text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3 h-3 text-[#d4af37]" />
                    Peaker Spool Reserve
                  </span>
                  <span className="text-base font-bold text-white font-mono">
                    {backupPowerNeededMW > 0 ? `${backupPowerNeededMW.toLocaleString()} MW` : "0 MW (Idle)"}
                  </span>
                  <span className="text-[10px] text-zinc-500">Natural gas quick-start units</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-1">
                  <span className="text-zinc-400 text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <BatteryCharging className="w-3 h-3 text-[#5a9a7c]" />
                    Battery Storage (BESS)
                  </span>
                  <span className="text-base font-bold text-[#6aa88a] font-mono">
                    {batteryStatus}
                  </span>
                  <span className="text-[10px] text-zinc-500">Belly absorbing / Neck discharge</span>
                </div>
              </div>

              {/* Quick Scenario Toggles */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] uppercase font-mono text-zinc-400">Quick Scenario Injections:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  <button
                    onClick={() => {
                      onQuickScenario?.("summer-normal");
                      setIsExpanded(false);
                    }}
                    className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-zinc-300 hover:text-white transition-colors border border-white/5"
                  >
                    ☀️ Normal
                  </button>
                  <button
                    onClick={() => {
                      onQuickScenario?.("heatwave");
                      setIsExpanded(false);
                    }}
                    className="px-2 py-1.5 rounded-lg bg-[#251715] hover:bg-[#321c1a] text-[#e07563] transition-colors border border-[#c86754]/25 text-[11px]"
                  >
                    🔥 Heatwave
                  </button>
                  <button
                    onClick={() => {
                      onQuickScenario?.("cloud-storm");
                      setIsExpanded(false);
                    }}
                    className="px-2 py-1.5 rounded-lg bg-[#141b24] hover:bg-[#1a2330] text-[#8fa8c0] transition-colors border border-[#788ca0]/25 text-[11px]"
                  >
                    ⛈️ Cloud Storm
                  </button>
                  <button
                    onClick={() => {
                      onQuickScenario?.("high-renewables");
                      setIsExpanded(false);
                    }}
                    className="px-2 py-1.5 rounded-lg bg-[#211d14] hover:bg-[#2b2518] text-[#e5c268] transition-colors border border-[#d4af37]/25 text-[11px]"
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
                  className="w-full text-center py-1.5 text-[11px] font-mono text-[#d4af37] hover:text-[#e6cca0] hover:underline transition-colors pt-1 border-t border-white/5"
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
