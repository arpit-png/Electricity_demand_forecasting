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
import { Sun, Wind, Zap, AlertTriangle, BatteryCharging, Play, Pause, RotateCcw } from "lucide-react";
import { BentoCard } from "./skiper-ui/skiper-bento-grid";
import { SkiperTabs } from "./skiper-ui/skiper-tabs";

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
      glowColor="amber"
      badge="SIGNATURE INTERACTIVE CANVAS"
      title="24-Hour Diurnal Net Demand & Duck Curve Visualizer"
      subtitle="Visualizing the rapid collapse of net demand at solar noon ('Belly') and the catastrophic evening ramp ('Neck')."
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
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? "Pause" : "Play Cycle"}</span>
          </button>

          <button
            onClick={() => onSelectHour(18)}
            className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono transition-colors"
          >
            Jump to Peak Ramp (18:00)
          </button>

          <button
            onClick={() => onSelectHour(12)}
            className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono transition-colors"
          >
            Jump to Solar Belly (12:00)
          </button>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="w-full h-[420px] relative select-none">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              {/* Solar Gradient */}
              <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>

              {/* Wind Gradient */}
              <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
              </linearGradient>

              {/* Net Demand Gradient */}
              <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.02} />
              </linearGradient>

              {/* Battery Mitigation Gradient */}
              <linearGradient id="batteryGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="timeLabel"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
            />
            <Tooltip content={<CustomChartTooltip />} />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "11px", fontFamily: "monospace" }} />

            {/* Shaded Annotations: Duck Belly & Evening Ramp */}
            <ReferenceArea
              x1="10:00"
              x2="15:00"
              fill="#f59e0b"
              fillOpacity={0.06}
              stroke="#f59e0b"
              strokeOpacity={0.2}
              strokeDasharray="3 3"
              label={{ value: "DUCK BELLY (Solar Overgeneration)", fill: "#f59e0b", fontSize: 10, position: "insideTop" }}
            />
            <ReferenceArea
              x1="17:00"
              x2="21:00"
              fill="#f43f5e"
              fillOpacity={0.08}
              stroke="#f43f5e"
              strokeOpacity={0.25}
              strokeDasharray="3 3"
              label={{ value: "DUCK NECK (Peak Evening Ramp)", fill: "#f43f5e", fontSize: 10, position: "insideTop" }}
            />

            {/* Scrubber vertical line indicator */}
            <ReferenceLine
              x={data[selectedHour]?.timeLabel}
              stroke="#22d3ee"
              strokeWidth={2}
              strokeDasharray="4 4"
            />

            {/* Curves */}
            {activeLayer === "standard" && (
              <>
                <Area
                  type="monotone"
                  dataKey="solarGen"
                  name="Solar Generation (MW)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#solarGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="windGen"
                  name="Wind Generation (MW)"
                  stroke="#38bdf8"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#windGrad)"
                />
                <Line
                  type="monotone"
                  dataKey="grossDemand"
                  name="Total Gross Demand (MW)"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="netDemand"
                  name="Net Demand (Duck Curve)"
                  stroke="#f43f5e"
                  strokeWidth={3.5}
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
                  stroke="#f43f5e"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="adjustedNetDemand"
                  name="Stabilized Net Demand (Post-BESS)"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="batteryDispatch"
                  name="Battery Storage Dispatch (MW)"
                  stroke="#10b981"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#batteryGrad)"
                />
                <Line
                  type="monotone"
                  dataKey="peakerGasDispatch"
                  name="Peaker Gas Backup (MW)"
                  stroke="#ec4899"
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
                  stroke="#ffffff"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="lstmPrediction"
                  name="LSTM Neural Forecast"
                  stroke="#a855f7"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="gradientBoostingPrediction"
                  name="Gradient Boosting (XGBoost)"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="ridgeRegressionPrediction"
                  name="Multivariate Ridge Regression"
                  stroke="#f59e0b"
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
      <div className="mt-6 pt-4 border-t border-white/[0.08]">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">SCRUBBER TIME:</span>
            <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded">
              {currentPoint.timeLabel}
            </span>
            {currentPoint.isPeakRamp && (
              <span className="text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                CRITICAL EVENING RAMP ZONE
              </span>
            )}
          </div>
          <span className="text-slate-400 hidden sm:inline">Drag or click along the 24-hour axis</span>
        </div>

        <input
          type="range"
          min="0"
          max="23"
          value={selectedHour}
          onChange={(e) => onSelectHour(parseInt(e.target.value))}
          className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
        />

        {/* 24-Hour Hour Buttons */}
        <div className="hidden lg:grid grid-cols-24 gap-1 mt-2 text-[10px] font-mono">
          {data.map((d) => (
            <button
              key={d.hour}
              onClick={() => onSelectHour(d.hour)}
              className={`py-1 rounded text-center transition-all ${
                d.hour === selectedHour
                  ? "bg-cyan-500 text-slate-950 font-bold scale-110 shadow-[0_0_10px_#06b6d4]"
                  : d.isPeakRamp
                  ? "bg-rose-500/20 text-rose-300 hover:bg-rose-500/30"
                  : d.hour >= 11 && d.hour <= 14
                  ? "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                  : "bg-white/[0.03] text-slate-400 hover:bg-white/[0.08]"
              }`}
            >
              {d.hour}
            </button>
          ))}
        </div>
      </div>

      {/* Real-Time Live Point Telemetry Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4 pt-4 border-t border-white/[0.06] text-xs font-mono">
        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-slate-500 text-[10px] uppercase flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400" />
            Gross Demand
          </span>
          <span className="text-sm font-bold text-slate-100">{formatMW(currentPoint.grossDemand)}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-slate-500 text-[10px] uppercase flex items-center gap-1">
            <Sun className="w-3 h-3 text-amber-400" />
            Solar Generation
          </span>
          <span className="text-sm font-bold text-amber-300">{formatMW(currentPoint.solarGen)}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-slate-500 text-[10px] uppercase flex items-center gap-1">
            <Wind className="w-3 h-3 text-sky-400" />
            Wind Generation
          </span>
          <span className="text-sm font-bold text-sky-300">{formatMW(currentPoint.windGen)}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-slate-500 text-[10px] uppercase flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            Net Demand
          </span>
          <span className="text-sm font-bold text-rose-400">{formatMW(currentPoint.netDemand)}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 col-span-2 md:col-span-1">
          <span className="text-slate-500 text-[10px] uppercase flex items-center gap-1">
            <BatteryCharging className="w-3 h-3 text-emerald-400" />
            Ramp Velocity
          </span>
          <span className={`text-sm font-bold ${currentPoint.rampRate > 2000 ? "text-rose-400" : currentPoint.rampRate > 0 ? "text-amber-400" : "text-emerald-400"}`}>
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
    <div className="rounded-xl border border-white/10 bg-[#090d14]/95 p-3.5 backdrop-blur-xl shadow-2xl font-mono text-xs text-slate-200 min-w-[200px]">
      <div className="font-bold text-cyan-300 border-b border-white/10 pb-1.5 mb-2 flex items-center justify-between">
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
