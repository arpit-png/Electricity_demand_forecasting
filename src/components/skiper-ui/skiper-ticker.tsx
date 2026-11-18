"use client";

import React from "react";
import { Zap, Sun, Wind, Battery, Activity, ShieldCheck, Database, Cpu } from "lucide-react";

export const SkiperTicker: React.FC = () => {
  const tickerItems = [
    { label: "BIGQUERY SCADA STREAM", value: "240,000 pts/sec", icon: Database, color: "text-[#8ab4f8]" },
    { label: "VERTEX AI INFERENCE", value: "18ms (Bi-LSTM Attention)", icon: Cpu, color: "text-[#c58af9]" },
    { label: "SOLAR NOON BELLY", value: "13,224 MW Overgeneration", icon: Sun, color: "text-[#fdd663]" },
    { label: "EVENING RAMP GRADIENT", value: "3,752 MW/h (Critical)", icon: Zap, color: "text-[#f28b82]" },
    { label: "GRID SYNCHRONOUS FREQ", value: "50.00 Hz (Nominal)", icon: Activity, color: "text-[#81c995]" },
    { label: "BESS STORAGE BUFFER", value: "12.0 GWh Dispatched", icon: Battery, color: "text-[#78d9ec]" },
    { label: "RELIABILITY COMPLIANCE", value: "IEEE 1547 / NERC BAL-003", icon: ShieldCheck, color: "text-[#81c995]" },
    { label: "CLOUD FIRESTORE STATE", value: "Sub-50ms Persistent Sync", icon: Database, color: "text-[#fbbc04]" },
  ];

  return (
    <div className="relative w-full overflow-hidden border-y border-[#3c4043] bg-[#18191c]/90 py-2.5 backdrop-blur-xl select-none">
      <div className="flex w-max animate-ticker items-center gap-8">
        {/* Repeating twice for infinite marquee */}
        {[...tickerItems, ...tickerItems].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-2.5 text-xs font-sans tracking-tight">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8ab4f8]" />
              <span className="text-[#9aa0a6] font-medium uppercase text-[11px] font-sans">
                {item.label}
              </span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#202124] border border-[#3c4043]">
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
