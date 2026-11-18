"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceArea,
  ReferenceLine,
} from "recharts";
import { HourlyDataPoint, GridSummary } from "@/lib/forecasting-engine";
import { formatMW } from "@/lib/utils";
import { Sun, Wind, Zap, AlertTriangle, BatteryCharging, Play, Pause } from "lucide-react";
import { BentoCard } from "./skiper-ui/skiper-bento-grid";
import { SkiperTabs } from "./skiper-ui/skiper-tabs";
import { SkiperFrequencyWave } from "./skiper-ui/skiper-frequency-wave";

interface DuckCurveVisualizerProps {
  data: HourlyDataPoint[];
  summary: GridSummary;
  selectedHour: number;
  onSelectHour: (hour: number) => void;
}

export const DuckCurveVisualizer: React.FC<DuckCurveVisualizerProps> = ({
  data,
  summary,
  selectedHour,
  onSelectHour,
}) => {
  const [activeLayer, setActiveLayer] = useState<"standard" | "dispatch" | "ml-overlay">("standard");
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto playback of the 24-hour cycle
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        onSelectHour((selectedHour + 1) % 24);
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedHour, onSelectHour]);

  const currentPoint = data[selectedHour] || data[12];

  const layerTabs = [
    { id: "standard", label: "Duck Curve Anatomy" },
    { id: "dispatch", label: "Battery & Peaker Dispatch" },
    { id: "ml-overlay", label: "ML Model Forecasts" },
  ];

  return (
    <BentoCard
      glowColor="gold"
      badge="SIGNATURE INTERACTIVE CANVAS"
      title="24-Hour Diurnal Net Demand & Duck Curve Visualizer"
      subtitle="Visualizing the midday belly overgeneration collapse and the rapid 3-hour evening neck ramp."
      className="col-span-12"
    >
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pt-2 border-b border-white/[0.06] pb-4">
        <SkiperTabs
          tabs={layerTabs}
          activeId={activeLayer}
          onChange={(id) => setActiveLayer(id as any)}
          size="sm"
        />

        {/* Playback & Scrubber Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 text-xs font-mono transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-[#d4af37]" /> : <Play className="w-3.5 h-3.5 text-[#d4af37]" />}
            <span>{isPlaying ? "Pause" : "Play Cycle"}</span>
          </button>

          <button
            onClick={() => onSelectHour(18)}
            className="px-2.5 py-1.5 rounded-lg bg-[#251715] hover:bg-[#321c1a] text-[#e07563] border border-[#c86754]/30 text-xs font-mono transition-colors"
          >
            Peak Ramp (18:00)
          </button>

          <button
            onClick={() => onSelectHour(12)}
            className="px-2.5 py-1.5 rounded-lg bg-[#211d14] hover:bg-[#2b2518] text-[#e5c268] border border-[#d4af37]/30 text-xs font-mono transition-colors"
          >
            Solar Belly (12:00)
          </button>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="w-full h-[410px] relative select-none">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              {/* Solar Champagne Gradient */}
              <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#d4af37" stopOpacity={0.0} />
              </linearGradient>

              {/* Wind Mist Gradient */}
              <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9aa9b8" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#9aa9b8" stopOpacity={0.0} />
              </linearGradient>

              {/* Net Demand Terracotta Gradient */}
              <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c86754" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#c86754" stopOpacity={0.02} />
              </linearGradient>

              {/* Battery Celadon Gradient */}
              <linearGradient id="batteryGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5a9a7c" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#5a9a7c" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="timeLabel"
              stroke="#52525b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#27272a" }}
            />
            <YAxis
              stroke="#52525b"
              fontSize={11}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              tickLine={false}
              axisLine={{ stroke: "#27272a" }}
            />
            <Tooltip content={<CustomChartTooltip />} />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "11px", fontFamily: "monospace" }} />

            {/* Shaded Annotations: Duck Belly & Evening Ramp */}
            <ReferenceArea
              x1="10:00"
              x2="15:00"
              fill="#d4af37"
              fillOpacity={0.04}
              stroke="#d4af37"
              strokeOpacity={0.2}
              strokeDasharray="3 3"
              label={{ value: "DUCK BELLY (Solar Overgeneration)", fill: "#c5a059", fontSize: 10, position: "insideTop" }}
            />
            <ReferenceArea
              x1="17:00"
              x2="21:00"
              fill="#c86754"
              fillOpacity={0.05}
              stroke="#c86754"
              strokeOpacity={0.25}
              strokeDasharray="3 3"
              label={{ value: "DUCK NECK (Peak Evening Ramp)", fill: "#c86754", fontSize: 10, position: "insideTop" }}
            />

            {/* Scrubber vertical line indicator */}
            <ReferenceLine
              x={data[selectedHour]?.timeLabel}
              stroke="#d4af37"
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />

            {/* Curves */}
            {activeLayer === "standard" && (
              <>
                <Area
                  type="monotone"
                  dataKey="solarGen"
                  name="Solar Generation (MW)"
                  stroke="#d4af37"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#solarGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="windGen"
                  name="Wind Generation (MW)"
                  stroke="#9aa9b8"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#windGrad)"
                />
                <Line
                  type="monotone"
                  dataKey="grossDemand"
                  name="Total Gross Demand (MW)"
                  stroke="#788ca0"
                  strokeWidth={2}
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="netDemand"
                  name="Net Demand (Duck Curve)"
                  stroke="#c86754"
                  strokeWidth={2.75}
                  fillOpacity={1}
                  fill="url(#netGrad)"
                />
              </>
            )}

            {activeLayer === "dispatch" && (
              <>
                <Line
                  type="monotone"
                  dataKey="netDemand"
                  name="Unmitigated Net Demand"
                  stroke="#c86754"
                  strokeWidth={1.75}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="adjustedNetDemand"
                  name="Stabilized Net Demand (Post-BESS)"
                  stroke="#5a9a7c"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="batteryDispatch"
                  name="Battery Storage Dispatch (MW)"
                  stroke="#5a9a7c"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#batteryGrad)"
                />
                <Line
                  type="monotone"
                  dataKey="peakerGasDispatch"
                  name="Peaker Gas Backup (MW)"
                  stroke="#b85848"
                  strokeWidth={2}
                  dot={false}
                />
              </>
            )}

            {activeLayer === "ml-overlay" && (
              <>
                <Line
                  type="monotone"
                  dataKey="netDemand"
                  name="Ground Truth Net Demand"
                  stroke="#e4e4e7"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="lstmPrediction"
                  name="LSTM Neural Forecast"
                  stroke="#9d8ec2"
                  strokeWidth={2.25}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="gradientBoostingPrediction"
                  name="Gradient Boosting (XGBoost)"
                  stroke="#8fa8c0"
                  strokeWidth={1.75}
                  strokeDasharray="3 3"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="ridgeRegressionPrediction"
                  name="Multivariate Ridge Regression"
                  stroke="#d1b181"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Interactive 24-Hour Slider & Telemetry Scrubber Bar */}
      <div className="mt-5 pt-4 border-t border-white/[0.06]">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[#d4af37] font-semibold">TIME SCRUBBER:</span>
            <span className="text-zinc-200 font-bold bg-white/[0.06] px-2 py-0.5 rounded border border-white/5">
              {currentPoint.timeLabel}
            </span>
            {currentPoint.isPeakRamp && (
              <span className="text-[#e07563] bg-[#291715] px-2 py-0.5 rounded border border-[#c86754]/30 flex items-center gap-1 text-[11px]">
                <AlertTriangle className="w-3 h-3" />
                CRITICAL EVENING RAMP WINDOW
              </span>
            )}
          </div>
          <span className="text-zinc-500 hidden sm:inline text-[11px]">Click or drag along the 24-hour cycle</span>
        </div>

        <input
          type="range"
          min="0"
          max="23"
          value={selectedHour}
          onChange={(e) => onSelectHour(parseInt(e.target.value))}
          className="w-full accent-[#d4af37] cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
        />

        {/* 24-Hour Hour Buttons */}
        <div className="hidden lg:grid grid-cols-24 gap-1 mt-2 text-[10px] font-mono">
          {data.map((d) => (
            <button
              key={d.hour}
              onClick={() => onSelectHour(d.hour)}
              className={`py-1 rounded text-center transition-all ${
                d.hour === selectedHour
                  ? "bg-[#d4af37] text-zinc-950 font-bold scale-105 shadow-[0_0_8px_rgba(212,175,55,0.4)]"
                  : d.isPeakRamp
                  ? "bg-[#251715] text-[#e07563] hover:bg-[#321c1a]"
                  : d.hour >= 11 && d.hour <= 14
                  ? "bg-[#211d14] text-[#e5c268] hover:bg-[#2b2518]"
                  : "bg-white/[0.02] text-zinc-400 hover:bg-white/[0.06]"
              }`}
            >
              {d.hour}
            </button>
          ))}
        </div>
      </div>

      {/* Live AC Oscilloscope Frequency Waveform */}
      <div className="mt-4">
        <SkiperFrequencyWave
          rampRate={currentPoint.rampRate}
          status={summary.overallStatus}
        />
      </div>

      {/* Real-Time Live Point Telemetry Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4 pt-4 border-t border-white/[0.06] text-xs font-mono">
        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-zinc-400 text-[10px] uppercase flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#788ca0]" />
            Gross Demand
          </span>
          <span className="text-sm font-bold text-zinc-200">{formatMW(currentPoint.grossDemand)}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-zinc-400 text-[10px] uppercase flex items-center gap-1">
            <Sun className="w-3 h-3 text-[#d4af37]" />
            Solar Generation
          </span>
          <span className="text-sm font-bold text-[#e5c268]">{formatMW(currentPoint.solarGen)}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-zinc-400 text-[10px] uppercase flex items-center gap-1">
            <Wind className="w-3 h-3 text-[#9aa9b8]" />
            Wind Generation
          </span>
          <span className="text-sm font-bold text-[#b4c2d0]">{formatMW(currentPoint.windGen)}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-zinc-400 text-[10px] uppercase flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-[#c86754]" />
            Net Demand
          </span>
          <span className="text-sm font-bold text-[#e07563]">{formatMW(currentPoint.netDemand)}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 col-span-2 md:col-span-1">
          <span className="text-zinc-400 text-[10px] uppercase flex items-center gap-1">
            <BatteryCharging className="w-3 h-3 text-[#5a9a7c]" />
            Ramp Velocity
          </span>
          <span className={`text-sm font-bold ${currentPoint.rampRate > 2000 ? "text-[#e07563]" : currentPoint.rampRate > 0 ? "text-[#e5c268]" : "text-[#6aa88a]"}`}>
            {currentPoint.rampRate > 0 ? `+${currentPoint.rampRate} MW/h` : `${currentPoint.rampRate} MW/h`}
          </span>
        </div>
      </div>
    </BentoCard>
  );
};

function CustomChartTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-[#0c0c10]/95 p-3.5 backdrop-blur-2xl shadow-2xl font-mono text-xs text-zinc-200 min-w-[200px]">
      <div className="font-semibold text-[#d4af37] border-b border-white/10 pb-1.5 mb-2 flex items-center justify-between">
        <span>Time: {label}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {payload.map((item: any, i: number) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-[11px]" style={{ color: item.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}:
            </span>
            <span className="font-bold text-white text-[11px]">
              {typeof item.value === "number" ? `${item.value.toLocaleString()} MW` : item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
