"use client";

import React, { useEffect, useRef } from "react";

interface SkiperFrequencyWaveProps {
  rampRate: number;
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

    // Quiet luxury colors
    const color = {
      STABLE: "#5a9a7c",              // Celadon Sage
      ELEVATED_RAMP: "#d4af37",       // Brushed Champagne Gold
      CRITICAL_DISPATCH_REQUIRED: "#c86754", // Smoked Terracotta
    }[status];

    const render = () => {
      t += 0.035;
      const w = (canvas.width = canvas.parentElement?.clientWidth || 300);
      const h = (canvas.height = 70);

      ctx.clearRect(0, 0, w, h);

      // Baseline grid line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw subtle wave
      ctx.lineWidth = 1.75;
      ctx.strokeStyle = color;
      ctx.beginPath();

      const waveSpeed = t * 1.5;
      const amplitude = status === "CRITICAL_DISPATCH_REQUIRED" ? 18 : 12;

      for (let x = 0; x < w; x++) {
        const harmonic = Math.sin(x * 0.025 + waveSpeed) + 0.2 * Math.sin(x * 0.05 - waveSpeed * 1.2);
        const y = h / 2 + harmonic * amplitude;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Soft luxury underglow
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, `${color}18`);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [rampRate, status]);

  return (
    <div className="w-full relative overflow-hidden rounded-xl bg-[#09090d]/80 border border-white/[0.06] p-2.5">
      <div className="flex items-center justify-between text-[10px] font-mono mb-1 text-zinc-400">
        <span className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${status === "STABLE" ? "bg-[#5a9a7c]" : status === "ELEVATED_RAMP" ? "bg-[#d4af37]" : "bg-[#c86754]"}`} />
          AC Frequency Real-Time Waveform
        </span>
        <span className="font-bold text-zinc-200">
          {(50.0 + (rampRate > 2500 ? -0.04 : (Math.sin(Date.now() / 1500) * 0.015))).toFixed(2)} Hz
        </span>
      </div>
      <canvas ref={canvasRef} className="w-full block" />
    </div>
  );
};
