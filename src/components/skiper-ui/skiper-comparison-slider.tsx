"use client";

import React, { useState, useRef, useCallback } from "react";
import { MoveHorizontal, AlertTriangle, ShieldCheck, Zap } from "lucide-react";

export const SkiperComparisonSlider: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(percent);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      className="relative w-full h-[260px] sm:h-[300px] rounded-2xl overflow-hidden border border-[#3c4043] bg-[#18191c] select-none cursor-ew-resize group"
    >
      {/* Background (Right View: Google Vertex AI & BESS Stabilized Curve) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1b2b44] to-[#18191c] p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d2818] border border-[#81c995]/30 text-[#81c995] text-xs font-sans font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Vertex AI Pre-Dispatched & BESS Shaved</span>
          </div>
          <span className="text-xs font-mono text-[#81c995]">Ramp Reduced: -52%</span>
        </div>

        {/* Stabilized Net Demand Simulation Graph Graphic */}
        <div className="relative h-28 w-full flex items-end">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
            {/* Smoothed Net Demand with Battery & Peaker Dispatch */}
            <path
              d="M 0 60 Q 120 50 200 45 T 320 40 Q 380 35 500 48"
              fill="none"
              stroke="#81c995"
              strokeWidth="3.5"
            />
            {/* Battery absorption region */}
            <path
              d="M 160 48 Q 250 35 340 42"
              fill="none"
              stroke="#78d9ec"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />
          </svg>
        </div>

        <div className="flex items-center justify-between text-xs text-[#9aa0a6] font-sans border-t border-[#3c4043] pt-2">
          <span>Ramp: <strong className="text-[#81c995] font-mono">1,820 MW/h</strong></span>
          <span>Blackout Probability: <strong className="text-[#81c995] font-mono">0.001%</strong></span>
          <span>BESS Peak Shave: <strong className="text-[#78d9ec] font-mono">3,500 MW</strong></span>
        </div>
      </div>

      {/* Foreground (Left View: Unmitigated Duck Curve Breakdown) */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#331111] via-[#241315] to-[#18191c] p-6 flex flex-col justify-between overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#331111] border border-[#ea4335]/40 text-[#f28b82] text-xs font-sans font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Unmitigated Duck Curve (Standard Grid)</span>
          </div>
          <span className="text-xs font-mono text-[#f28b82]">Critical Ramp: 3,752 MW/h</span>
        </div>

        {/* Harsh Duck Curve Graph Graphic */}
        <div className="relative h-28 w-full flex items-end">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
            {/* Deep midday belly dropping then violent evening spike */}
            <path
              d="M 0 55 Q 100 65 180 88 T 280 85 Q 360 15 500 20"
              fill="none"
              stroke="#ea4335"
              strokeWidth="3.5"
            />
          </svg>
        </div>

        <div className="flex items-center justify-between text-xs text-[#9aa0a6] font-sans border-t border-[#3c4043] pt-2">
          <span>Max Ramp: <strong className="text-[#f28b82] font-mono">3,752 MW/h</strong></span>
          <span>Blackout Probability: <strong className="text-[#f28b82] font-mono">14.8%</strong></span>
          <span>Peaker Spool Delay: <strong className="text-[#fdd663] font-mono">+45 mins</strong></span>
        </div>
      </div>

      {/* Draggable Divider Line & Pill Handle */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-[#8ab4f8] shadow-[0_0_12px_rgba(138,180,248,0.7)] pointer-events-none"
        style={{ left: `${sliderPos}%` }}
      >
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          className="pointer-events-auto absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#8ab4f8] text-[#041e49] flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 active:scale-95 transition-transform"
        >
          <MoveHorizontal className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
