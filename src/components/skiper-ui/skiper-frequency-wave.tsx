"use client";

import React, { useEffect, useRef } from "react";

interface SkiperFrequencyWaveProps {
  rampRate: number; // Current MW/h change
  status: "STABLE" | "ELEVATED_RAMP" | "CRITICAL_DISPATCH_REQUIRED";
}

export const SkiperFrequencyWave: React.FC<SkiperFrequencyWaveProps> = ({
  rampRate,
  status,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const color = {
      STABLE: "#10b981",              // Emerald/Mint synchronized
      ELEVATED_RAMP: "#f59e0b",       // Sodium Amber
      CRITICAL_DISPATCH_REQUIRED: "#f43f5e", // Magma Crimson
    }[status];

    // Slight frequency perturbation based on ramp velocity
    const frequencyBase = 50.0 + (rampRate > 2500 ? -0.04 : rampRate < -2500 ? 0.03 : (Math.sin(t) * 0.008));

    const render = () => {
      t += 0.04;
      const w = (canvas.width = canvas.parentElement?.clientWidth || 300);
      const h = (canvas.height = 70);

      ctx.clearRect(0, 0, w, h);

      // Draw faint baseline grid line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw AC Wave
      ctx.lineWidth = 2;
      ctx.strokeStyle = color;
      ctx.beginPath();

      const waveSpeed = t * 1.8;
      const amplitude = status === "CRITICAL_DISPATCH_REQUIRED" ? 22 : 14;

      for (let x = 0; x < w; x++) {
        const harmonic = Math.sin(x * 0.03 + waveSpeed) + 0.25 * Math.sin(x * 0.06 - waveSpeed * 1.4);
        const y = h / 2 + harmonic * amplitude;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Subtle underglow area
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, `${color}20`);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [rampRate, status]);

  return (
    <div className="w-full relative overflow-hidden rounded-xl bg-black/40 border border-white/[0.06] p-2.5">
      <div className="flex items-center justify-between text-[10px] font-mono mb-1 text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${status === "STABLE" ? "bg-emerald-400" : status === "ELEVATED_RAMP" ? "bg-amber-400" : "bg-rose-400 animate-ping"}`} />
          AC Frequency Real-Time Waveform
        </span>
        <span className="font-bold text-slate-200">
          {(50.0 + (rampRate > 2500 ? -0.04 : (Math.sin(Date.now() / 1500) * 0.015))).toFixed(2)} Hz
        </span>
      </div>
      <canvas ref={canvasRef} className="w-full block" />
    </div>
  );
};
