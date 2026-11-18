"use client";

import React, { useState, useRef, useCallback } from "react";
import { MoveHorizontal, AlertTriangle, ShieldCheck } from "lucide-react";

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
      className="relative w-full h-[260px] sm:h-[300px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 select-none cursor-ew-resize shadow-sm"
    >
      {/* Background (Right View: ML Pre-Dispatched & BESS Stabilized Curve) */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-slate-50 to-slate-100 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-950 p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>ML Pre-Dispatched &amp; BESS Peak Shaved</span>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">Ramp Reduced: -52%</span>
        </div>

        {/* Stabilized Net Demand Curve Graphic */}
        <div className="relative h-28 w-full flex items-end">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
            <path
              d="M 0 60 Q 120 50 200 45 T 320 40 Q 380 35 500 48"
              fill="none"
              stroke="#059669"
              strokeWidth="3.5"
            />
            <path
              d="M 160 48 Q 250 35 340 42"
              fill="none"
              stroke="#0891b2"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />
          </svg>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-2">
          <span>Ramp: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">1,820 MW/h</strong></span>
          <span>Blackout Probability: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">0.001%</strong></span>
          <span>BESS Peak Shave: <strong className="text-cyan-600 dark:text-cyan-400 font-mono">3,500 MW</strong></span>
        </div>
      </div>

      {/* Foreground (Left View: Unmitigated Duck Curve Breakdown) */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-rose-50 via-slate-50 to-slate-100 dark:from-rose-950/40 dark:via-slate-900 dark:to-slate-950 p-6 flex flex-col justify-between overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-medium">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>Unmitigated Duck Curve (Standard Grid)</span>
          </div>
          <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">Critical Ramp: 3,752 MW/h</span>
        </div>

        {/* Harsh Duck Curve Graph Graphic */}
        <div className="relative h-28 w-full flex items-end">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
            <path
              d="M 0 55 Q 100 65 180 88 T 280 85 Q 360 15 500 20"
              fill="none"
              stroke="#e11d48"
              strokeWidth="3.5"
            />
          </svg>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-2">
          <span>Max Ramp: <strong className="text-rose-600 dark:text-rose-400 font-mono">3,752 MW/h</strong></span>
          <span>Blackout Probability: <strong className="text-rose-600 dark:text-rose-400 font-mono">14.8%</strong></span>
          <span>Peaker Spool Delay: <strong className="text-amber-600 dark:text-amber-400 font-mono">+45 mins</strong></span>
        </div>
      </div>

      {/* Draggable Divider Line & Pill Handle */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-blue-500 shadow-md pointer-events-none"
        style={{ left: `${sliderPos}%` }}
      >
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          className="pointer-events-auto absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 active:scale-95 transition-transform"
        >
          <MoveHorizontal className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
