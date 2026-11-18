"use client";

import React, { useEffect, useRef } from "react";

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = 110);

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Google Material 3 Grid Lines
      ctx.strokeStyle = "#303134";
      ctx.lineWidth = 1;

      // Draw horizontal reference lines
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

      // Wave Color based on Google System Alert
      let waveStroke = "#8ab4f8"; // Google Blue 300 (Normal)
      if (isPeakRamp || Math.abs(rampRateMW) > 3000) {
        waveStroke = "#f28b82"; // Google Red 300 (Critical Ramp)
      } else if (Math.abs(rampRateMW) > 1500) {
        waveStroke = "#fdd663"; // Google Yellow 300 (Elevated)
      }

      // Draw primary AC Sine wave
      ctx.beginPath();
      ctx.strokeStyle = waveStroke;
      ctx.lineWidth = 2.5;

      const speed = (frequencyHz / 50.0) * 0.08;
      phase += speed;

      // Higher harmonic distortion on steep duck ramps
      const harmonicDistortion = isPeakRamp ? 0.35 : 0.04;

      for (let x = 0; x < width; x++) {
        const rad = (x / width) * Math.PI * 4 + phase;
        // Fundamental frequency + 3rd harmonic
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

      // Subtle underglow
      ctx.strokeStyle = waveStroke;
      ctx.lineWidth = 8;
      ctx.globalAlpha = 0.15;
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [frequencyHz, rampRateMW, isPeakRamp]);

  return (
    <div className="w-full relative rounded-xl bg-[#18191c] border border-[#3c4043] p-3 overflow-hidden select-none">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isPeakRamp ? "bg-[#ea4335] animate-ping" : "bg-[#34a853]"}`} />
          <span className="text-xs font-sans font-medium text-[#e8eaed]">AC Frequency Synchronous Oscilloscope</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[#9aa0a6]">Nominal: 50.00 Hz</span>
          <span className={`font-bold ${isPeakRamp ? "text-[#f28b82]" : "text-[#81c995]"}`}>
            {frequencyHz.toFixed(2)} Hz
          </span>
        </div>
      </div>
      <canvas ref={canvasRef} className="w-full block" />
      <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-[#9aa0a6]">
        <span>-35 ms</span>
        <span className="text-[#8ab4f8]">Zero-Crossing Interconnect Sync</span>
        <span>+35 ms</span>
      </div>
    </div>
  );
};
