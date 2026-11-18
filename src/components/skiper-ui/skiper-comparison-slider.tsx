"use client";

import React, { useState } from "react";
import { AlertTriangle, ShieldCheck, ArrowLeftRight, Zap } from "lucide-react";

export const SkiperComparisonSlider: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0e15] p-5 select-none font-mono">
      <div className="flex items-center justify-between mb-3 text-xs">
        <span className="text-slate-400 font-bold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
          <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-400" />
          Interactive Dispatch Stabilization Comparison
        </span>
        <span className="text-slate-500 text-[10px]">Drag slider to compare grid outcomes</span>
      </div>

      <div className="relative h-44 rounded-xl overflow-hidden border border-white/10 bg-slate-950">
        {/* Left Side: Unmitigated Grid */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between bg-gradient-to-br from-rose-950/40 via-slate-950 to-slate-950">
          <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
            <AlertTriangle className="w-4 h-4" />
            <span>UNMITIGATED DUCK CURVE (BASELINE)</span>
          </div>

          <div className="space-y-1 text-xs">
            <div className="text-2xl font-bold text-rose-400">+13,400 MW / 3h Ramp</div>
            <div className="text-slate-400 text-[11px]">
              Solar cuts out suddenly at 18:00. Fast-start turbines caught cold without pre-warming lead time.
            </div>
            <div className="text-rose-300 font-semibold text-[10px] bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded w-max">
              Status: Grid Frequency Collapse & Brownout Risk
            </div>
          </div>
        </div>

        {/* Right Side: ML-Stabilized Grid (Clipped by sliderPos) */}
        <div
          className="absolute inset-0 p-4 flex flex-col justify-between bg-gradient-to-br from-emerald-950/50 via-slate-950 to-slate-950"
          style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
        >
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs ml-auto">
            <span>NET DEMAND ML PRE-DISPATCH</span>
            <ShieldCheck className="w-4 h-4" />
          </div>

          <div className="space-y-1 text-xs ml-auto text-right">
            <div className="text-2xl font-bold text-emerald-400">Ramp Flattened to &lt; 2,100 MW/h</div>
            <div className="text-slate-300 text-[11px] max-w-sm">
              LSTM predicted evening ramp 3 hours prior. BESS discharged 14.2 GWh; gas peakers pre-synchronized.
            </div>
            <div className="text-emerald-300 font-semibold text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded w-max ml-auto">
              Status: 50.00 Hz Frequency Locked • Zero Blackout
            </div>
          </div>
        </div>

        {/* Draggable Divider Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-cyan-400 cursor-ew-resize shadow-[0_0_12px_#22d3ee]"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg">
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Hidden full-width range input for touch & mouse drag */}
        <input
          type="range"
          min="5"
          max="95"
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
        />
      </div>
    </div>
  );
};
