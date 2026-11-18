"use client";

import React, { useState } from "react";
import { AlertTriangle, ShieldCheck, ArrowLeftRight, Zap } from "lucide-react";

export const SkiperComparisonSlider: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0c0c10] p-5 select-none font-mono">
      <div className="flex items-center justify-between mb-3 text-xs">
        <span className="text-zinc-400 font-bold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
          <ArrowLeftRight className="w-3.5 h-3.5 text-[#d4af37]" />
          Dispatch Stabilization Comparative Analysis
        </span>
        <span className="text-zinc-500 text-[10px]">Drag slider to inspect grid reliability impact</span>
      </div>

      <div className="relative h-44 rounded-xl overflow-hidden border border-white/[0.08] bg-[#08080a]">
        {/* Left Side: Unmitigated Grid (Smoked Terracotta) */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between bg-gradient-to-br from-[#201514] via-[#09090c] to-[#09090c]">
          <div className="flex items-center gap-1.5 text-[#c86754] font-medium text-xs">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>UNMITIGATED DUCK CURVE (BASELINE)</span>
          </div>

          <div className="space-y-1 text-xs">
            <div className="text-2xl font-bold text-[#e07563]">+13,400 MW / 3h Ramp</div>
            <div className="text-zinc-400 text-[11px]">
              Solar drops out abruptly at 18:00. Thermal generation units caught cold without pre-warming lead time.
            </div>
            <div className="text-[#e07563] text-[10px] bg-[#291715] border border-[#c86754]/30 px-2 py-0.5 rounded w-max">
              Status: Grid Frequency Collapse & Brownout Risk
            </div>
          </div>
        </div>

        {/* Right Side: ML-Stabilized Grid (Celadon Sage & Champagne) */}
        <div
          className="absolute inset-0 p-4 flex flex-col justify-between bg-gradient-to-br from-[#131b17] via-[#09090c] to-[#09090c]"
          style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
        >
          <div className="flex items-center gap-1.5 text-[#5a9a7c] font-medium text-xs ml-auto">
            <span>NET DEMAND ML PRE-DISPATCH</span>
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>

          <div className="space-y-1 text-xs ml-auto text-right">
            <div className="text-2xl font-bold text-[#6aa88a]">Ramp Dampened to &lt; 2,100 MW/h</div>
            <div className="text-zinc-300 text-[11px] max-w-sm">
              LSTM predicted evening ramp 3 hours in advance. BESS discharged 14.2 GWh; gas peakers pre-synchronized.
            </div>
            <div className="text-[#6aa88a] text-[10px] bg-[#16221c] border border-[#5a9a7c]/30 px-2 py-0.5 rounded w-max ml-auto">
              Status: 50.00 Hz Frequency Locked • Zero Outage
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-[#d4af37] cursor-ew-resize shadow-[0_0_10px_rgba(212,175,55,0.4)]"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#18181d] border border-[#d4af37] text-[#d4af37] flex items-center justify-center shadow-lg">
            <ArrowLeftRight className="w-3 h-3" />
          </div>
        </div>

        {/* Drag input */}
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
