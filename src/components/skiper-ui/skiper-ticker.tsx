"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Radio } from "lucide-react";

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
        "relative w-full overflow-hidden border-y border-white/[0.06] bg-[#08080b]/90 py-2.5 backdrop-blur-xl",
        className
      )}
    >
      {/* Edge gradient masks */}
      <div className="pointer-events-none absolute left-0 inset-y-0 w-24 bg-gradient-to-r from-[#08080b] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 inset-y-0 w-24 bg-gradient-to-l from-[#08080b] to-transparent z-10" />

      <div className="flex w-max animate-ticker items-center gap-8">
        {[...SAMPLE_FEEDS, ...SAMPLE_FEEDS].map((item, idx) => {
          const isPeak = item.rampStatus === "PEAK";
          const isRamping = item.rampStatus === "RAMPING";

          return (
            <div
              key={idx}
              className="flex items-center gap-3 font-mono text-xs text-zinc-300"
            >
              <div className="flex items-center gap-1.5 font-medium text-zinc-200">
                <Radio className="w-3 h-3 text-[#d4af37]" />
                <span>{item.iso}</span>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                <span>Gross:</span>
                <span className="text-zinc-300">{item.grossLoad}</span>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-[#d4af37]">
                <span>☀️ Solar:</span>
                <span>{item.solar}</span>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-semibold">
                <span className="text-zinc-500">Net:</span>
                <span className={cn(isPeak ? "text-[#e07563]" : isRamping ? "text-[#e5c268]" : "text-[#6aa88a]")}>
                  {item.netLoad}
                </span>
                {isPeak ? (
                  <ArrowUpRight className="w-3 h-3 text-[#e07563]" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 text-zinc-500" />
                )}
              </div>

              <span
                className={cn(
                  "px-1.5 py-0.5 rounded text-[9px] uppercase font-semibold tracking-wider border",
                  isPeak
                    ? "bg-[#251715] text-[#e07563] border-[#c86754]/30"
                    : isRamping
                    ? "bg-[#211d14] text-[#e5c268] border-[#d4af37]/30"
                    : "bg-[#141d18] text-[#5a9a7c] border-[#5a9a7c]/30"
                )}
              >
                {item.rampStatus}
              </span>

              <span className="text-zinc-500 text-[10px]">Freq: {item.frequency}</span>
              <span className="text-zinc-800 mx-2">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
