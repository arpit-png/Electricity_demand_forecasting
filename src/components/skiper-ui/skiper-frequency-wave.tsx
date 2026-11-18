"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "@/lib/theme-context";

interface SkiperFrequencyWaveProps {
  frequencyHz?: number;
  rampRateMW?: number;
  isPeakRamp?: boolean;
}

export const SkiperFrequencyWave: React.FC<SkiperFrequencyWaveProps> = ({
  frequencyHz = 50.0,
  rampRateMW = 0,
  isPeakRamp = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = 110);

    let phase = 0;
    const isDark = theme === "dark";

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Grid reference lines
      ctx.strokeStyle = isDark ? "#1e293b" : "#e2e8f0";
      ctx.lineWidth = 1;

      const yCenter = height / 2;
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.moveTo(0, yCenter);
      ctx.lineTo(width, yCenter);
      ctx.moveTo(0, yCenter - 28);
      ctx.lineTo(width, yCenter - 28);
      ctx.moveTo(0, yCenter + 28);
      ctx.lineTo(width, yCenter + 28);
      ctx.stroke();
      ctx.setLineDash([]);

      // Dynamic waveform color
      let waveStroke = isDark ? "#60a5fa" : "#2563eb";
      if (isPeakRamp || Math.abs(rampRateMW) > 3000) {
        waveStroke = "#e11d48"; // Critical Ramp Rose
      } else if (Math.abs(rampRateMW) > 1500) {
        waveStroke = "#d97706"; // Elevated Amber
      }

      ctx.beginPath();
      ctx.strokeStyle = waveStroke;
      ctx.lineWidth = 2.5;

      const speed = (frequencyHz / 50.0) * 0.08;
      phase += speed;

      const harmonicDistortion = isPeakRamp ? 0.32 : 0.04;

      for (let x = 0; x < width; x++) {
        const rad = (x / width) * Math.PI * 4 + phase;
        const fundamental = Math.sin(rad);
        const thirdHarmonic = Math.sin(rad * 3 + phase * 0.5) * harmonicDistortion;
        const y = yCenter + (fundamental + thirdHarmonic) * 32;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      ctx.strokeStyle = waveStroke;
      ctx.lineWidth = 7;
      ctx.globalAlpha = 0.12;
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [frequencyHz, rampRateMW, isPeakRamp, theme]);

  return (
    <div className="w-full relative rounded-xl border p-3.5 overflow-hidden select-none transition-colors duration-200 bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isPeakRamp ? "bg-rose-500 animate-ping" : "bg-emerald-500"}`} />
          <span className="text-xs font-medium text-slate-800 dark:text-slate-200">AC Frequency Synchronous Oscilloscope</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-500 dark:text-slate-400">Nominal: 50.00 Hz</span>
          <span className={`font-bold ${isPeakRamp ? "text-rose-500" : "text-emerald-500"}`}>
            {frequencyHz.toFixed(2)} Hz
          </span>
        </div>
      </div>
      <canvas ref={canvasRef} className="w-full block" />
      <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
        <span>-35 ms</span>
        <span className="text-blue-600 dark:text-blue-400">Zero-Crossing Transmission Interconnect Sync</span>
        <span>+35 ms</span>
      </div>
    </div>
  );
};
