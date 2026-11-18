"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Zap, ArrowUpRight, ArrowDownRight, Radio } from "lucide-react";

interface TickerItem {
  iso: string;
  grossLoad: string;
  solar: string;
  netLoad: string;
  rampStatus: "STABLE" | "RAMPING" | "PEAK";
  frequency: string;
}

const SAMPLE_FEEDS: TickerItem[] = [
  { iso: "CAISO (California)", grossLoad: "31,450 MW", solar: "14,210 MW", netLoad: "17,240 MW", rampStatus: "RAMPING", frequency: "59.99 Hz" },
  { iso: "ERCOT (Texas)", grossLoad: "68,900 MW", solar: "18,400 MW", netLoad: "50,500 MW", rampStatus: "PEAK", frequency: "60.01 Hz" },
  { iso: "PJM Interconnection", grossLoad: "92,100 MW", solar: "8,900 MW", netLoad: "83,200 MW", rampStatus: "STABLE", frequency: "60.00 Hz" },
  { iso: "ISO-NE (New England)", grossLoad: "16,800 MW", solar: "4,200 MW", netLoad: "12,600 MW", rampStatus: "RAMPING", frequency: "60.02 Hz" },
  { iso: "National Grid ESO (UK)", grossLoad: "34,200 MW", solar: "7,800 MW", netLoad: "26,400 MW", rampStatus: "STABLE", frequency: "50.01 Hz" },
  { iso: "NEM (Australia)", grossLoad: "24,500 MW", solar: "12,900 MW", netLoad: "11,600 MW", rampStatus: "PEAK", frequency: "49.99 Hz" },
];

export const SkiperTicker: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden border-y border-white/[0.06] bg-[#07090d]/80 py-2.5 backdrop-blur-md",
        className
      )}
    >
      {/* Edge gradient masks */}
      <div className="pointer-events-none absolute left-0 inset-y-0 w-24 bg-gradient-to-r from-[#07090d] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 inset-y-0 w-24 bg-gradient-to-l from-[#07090d] to-transparent z-10" />

      <div className="flex w-max animate-ticker items-center gap-8">
        {[...SAMPLE_FEEDS, ...SAMPLE_FEEDS].map((item, idx) => {
          const isPeak = item.rampStatus === "PEAK";
          const isRamping = item.rampStatus === "RAMPING";

          return (
            <div
              key={idx}
              className="flex items-center gap-3 font-mono text-xs text-slate-300"
            >
              <div className="flex items-center gap-1.5 font-semibold text-slate-100">
                <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span>{item.iso}</span>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <span>Gross:</span>
                <span className="text-slate-200">{item.grossLoad}</span>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-amber-400/90">
                <span>☀️ Solar:</span>
                <span>{item.solar}</span>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-bold">
                <span className="text-slate-400">Net:</span>
                <span className={cn(isPeak ? "text-rose-400" : isRamping ? "text-amber-400" : "text-emerald-400")}>
                  {item.netLoad}
                </span>
                {isPeak ? (
                  <ArrowUpRight className="w-3 h-3 text-rose-400" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 text-slate-400" />
                )}
              </div>

              <span
                className={cn(
                  "px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider",
                  isPeak
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    : isRamping
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                )}
              >
                {item.rampStatus}
              </span>

              <span className="text-slate-500 text-[10px]">Freq: {item.frequency}</span>
              <span className="text-slate-700 mx-2">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
