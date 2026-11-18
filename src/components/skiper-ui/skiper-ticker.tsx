"use client";

import React from "react";
import { Zap, Sun, Wind, Battery, Activity, ShieldCheck, Database, Cpu } from "lucide-react";

export const SkiperTicker: React.FC = () => {
  const tickerItems = [
    { label: "SCADA TELEMETRY FEED", value: "240,000 pts/sec", icon: Database, color: "text-blue-500" },
    { label: "BI-LSTM NEURAL INFERENCE", value: "18ms Latency", icon: Cpu, color: "text-violet-500" },
    { label: "SOLAR NOON BELLY", value: "13,224 MW Generation", icon: Sun, color: "text-amber-500" },
    { label: "EVENING RAMP GRADIENT", value: "3,752 MW/h (Critical)", icon: Zap, color: "text-rose-500" },
    { label: "GRID SYNCHRONOUS FREQ", value: "50.00 Hz (Nominal)", icon: Activity, color: "text-emerald-500" },
    { label: "BESS DISPATCH BUFFER", value: "12.0 GWh Dispatched", icon: Battery, color: "text-cyan-500" },
    { label: "RELIABILITY STANDARD", value: "IEEE 1547 / NERC BAL-003", icon: ShieldCheck, color: "text-emerald-500" },
    { label: "DATABASE STATE SYNC", value: "Sub-50ms Persistence", icon: Database, color: "text-amber-500" },
  ];

  return (
    <div className="relative w-full overflow-hidden border-y py-2.5 backdrop-blur-xl select-none transition-colors duration-300 bg-white/60 border-slate-200 dark:bg-slate-900/60 dark:border-slate-800">
      <div className="flex w-max animate-ticker items-center gap-8">
        {[...tickerItems, ...tickerItems].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-2.5 text-xs tracking-tight">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="text-slate-500 dark:text-slate-400 font-medium uppercase text-[11px]">
                {item.label}
              </span>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                <Icon className={`w-3 h-3 ${item.color}`} />
                <span className={`font-mono font-semibold text-xs ${item.color}`}>
                  {item.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
