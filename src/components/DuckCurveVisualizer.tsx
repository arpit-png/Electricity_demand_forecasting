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
import { useTheme } from "@/lib/theme-context";

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
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Auto playback of the 24-hour diurnal cycle
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
      glowColor="blue"
      badge="SIGNATURE INTERACTIVE CANVAS"
      title="24-Hour Diurnal Net Demand & Duck Curve Engine"
      subtitle="Visualizing the midday belly overgeneration collapse and the rapid 3-hour evening neck ramp."
      className="col-span-12"
    >
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pt-1 border-b border-slate-200 dark:border-slate-800 pb-4">
        <SkiperTabs
          tabs={layerTabs}
          activeId={activeLayer}
          onChange={(id) => setActiveLayer(id as any)}
          size="sm"
        />

        {/* Playback & Scrubber Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-blue-500" /> : <Play className="w-3.5 h-3.5 text-blue-500" />}
            <span>{isPlaying ? "Pause Cycle" : "Play 24h Cycle"}</span>
          </button>

          <button
            onClick={() => onSelectHour(18)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:hover:bg-rose-900 dark:text-rose-300 dark:border-rose-800"
          >
            Peak Ramp (18:00)
          </button>

          <button
            onClick={() => onSelectHour(12)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900 dark:text-amber-300 dark:border-amber-800"
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
              {/* Solar Gradient */}
              <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d97706" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
              </linearGradient>

              {/* Wind Gradient */}
              <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
              </linearGradient>

              {/* Net Demand Gradient */}
              <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.02} />
              </linearGradient>

              {/* Battery Storage Gradient */}
              <linearGradient id="batteryGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0891b2" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="timeLabel"
              stroke={isDark ? "#64748b" : "#94a3b8"}
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: isDark ? "#334155" : "#cbd5e1" }}
            />
            <YAxis
              stroke={isDark ? "#64748b" : "#94a3b8"}
              fontSize={11}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              tickLine={false}
              axisLine={{ stroke: isDark ? "#334155" : "#cbd5e1" }}
            />
            <Tooltip content={<CustomChartTooltip isDark={isDark} />} />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "11px", fontWeight: 500 }} />

            {/* Shaded Annotations: Duck Belly & Evening Ramp */}
            <ReferenceArea
              x1="10:00"
              x2="15:00"
              fill="#d97706"
              fillOpacity={0.06}
              stroke="#d97706"
              strokeOpacity={0.35}
              strokeDasharray="4 4"
              label={{ value: "DUCK BELLY (Solar Overgeneration)", fill: "#d97706", fontSize: 10, position: "insideTop" }}
            />
            <ReferenceArea
              x1="17:00"
              x2="21:00"
              fill="#e11d48"
              fillOpacity={0.06}
              stroke="#e11d48"
              strokeOpacity={0.4}
              strokeDasharray="4 4"
              label={{ value: "DUCK NECK (Peak Evening Ramp)", fill: "#e11d48", fontSize: 10, position: "insideTop" }}
            />

            {/* Scrubber vertical line indicator */}
            <ReferenceLine
              x={data[selectedHour]?.timeLabel}
              stroke="#2563eb"
              strokeWidth={2}
              strokeDasharray="4 4"
            />

            {/* Layer 1: Standard Duck Curve Anatomy */}
            {activeLayer === "standard" && (
              <>
                <Area
                  type="monotone"
                  dataKey="solarGen"
                  name="Solar Generation (MW)"
                  stroke="#d97706"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#solarGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="windGen"
                  name="Wind Generation (MW)"
                  stroke="#059669"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#windGrad)"
                />
                <Line
                  type="monotone"
                  dataKey="grossDemand"
                  name="Total Gross Demand (MW)"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="netDemand"
                  name="Net Demand (Duck Curve)"
                  stroke="#7c3aed"
                  strokeWidth={2.75}
                  fillOpacity={1}
                  fill="url(#netGrad)"
                />
              </>
            )}

            {/* Layer 2: Battery & Peaker Dispatch */}
            {activeLayer === "dispatch" && (
              <>
                <Line
                  type="monotone"
                  dataKey="netDemand"
                  name="Unmitigated Net Demand"
                  stroke="#e11d48"
                  strokeWidth={1.75}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="adjustedNetDemand"
                  name="Stabilized Net Demand (Post-BESS)"
                  stroke="#059669"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="batteryDispatch"
                  name="Battery Storage Dispatch (MW)"
                  stroke="#0891b2"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#batteryGrad)"
                />
                <Line
                  type="monotone"
                  dataKey="peakerGasDispatch"
                  name="Peaker Gas Backup (MW)"
                  stroke="#e11d48"
                  strokeWidth={2}
                  dot={false}
                />
              </>
            )}

            {/* Layer 3: Model Forecasts */}
            {activeLayer === "ml-overlay" && (
              <>
                <Line
                  type="monotone"
                  dataKey="netDemand"
                  name="Ground Truth Net Demand"
                  stroke={isDark ? "#f8fafc" : "#0f172a"}
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="lstmPrediction"
                  name="Bi-LSTM Forecast"
                  stroke="#7c3aed"
                  strokeWidth={2.25}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="gradientBoostingPrediction"
                  name="Gradient Boosting (XGB)"
                  stroke="#2563eb"
                  strokeWidth={1.75}
                  strokeDasharray="3 3"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="ridgeRegressionPrediction"
                  name="Multivariate Ridge Regression"
                  stroke="#d97706"
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
      <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-semibold">TIME SCRUBBER:</span>
            <span className="font-bold font-mono px-2 py-0.5 rounded border bg-slate-100 border-slate-200 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
              {currentPoint.timeLabel}
            </span>
            {currentPoint.isPeakRamp && (
              <span className="px-2.5 py-0.5 rounded-full border flex items-center gap-1 text-[11px] font-medium bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800">
                <AlertTriangle className="w-3 h-3" />
                CRITICAL EVENING RAMP WINDOW
              </span>
            )}
          </div>
          <span className="hidden sm:inline text-[11px]">Click or drag along the 24-hour cycle</span>
        </div>

        <input
          type="range"
          min="0"
          max="23"
          value={selectedHour}
          onChange={(e) => onSelectHour(parseInt(e.target.value))}
          className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
        />

        {/* 24-Hour Hour Buttons */}
        <div className="hidden lg:grid grid-cols-24 gap-1 mt-2 text-[10px] font-mono">
          {data.map((d) => (
            <button
              key={d.hour}
              onClick={() => onSelectHour(d.hour)}
              className={`py-1 rounded text-center transition-all ${
                d.hour === selectedHour
                  ? "bg-blue-600 text-white font-bold scale-105 shadow-sm"
                  : d.isPeakRamp
                  ? "bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 dark:hover:bg-rose-900"
                  : d.hour >= 11 && d.hour <= 14
                  ? "bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 dark:hover:bg-amber-900"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-700"
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
          frequencyHz={50.0}
          rampRateMW={currentPoint.rampRate}
          isPeakRamp={currentPoint.isPeakRamp}
        />
      </div>

      {/* Real-Time Live Point Telemetry Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
        <div className="p-3 rounded-xl border bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-medium flex items-center gap-1">
            <Zap className="w-3 h-3 text-blue-500" />
            Gross Demand
          </span>
          <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">{formatMW(currentPoint.grossDemand)}</span>
        </div>

        <div className="p-3 rounded-xl border bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-medium flex items-center gap-1">
            <Sun className="w-3 h-3 text-amber-500" />
            Solar Generation
          </span>
          <span className="text-sm font-bold font-mono text-amber-600 dark:text-amber-400">{formatMW(currentPoint.solarGen)}</span>
        </div>

        <div className="p-3 rounded-xl border bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-medium flex items-center gap-1">
            <Wind className="w-3 h-3 text-emerald-500" />
            Wind Generation
          </span>
          <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">{formatMW(currentPoint.windGen)}</span>
        </div>

        <div className="p-3 rounded-xl border bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-medium flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-violet-500" />
            Net Demand
          </span>
          <span className="text-sm font-bold font-mono text-violet-600 dark:text-violet-400">{formatMW(currentPoint.netDemand)}</span>
        </div>

        <div className="p-3 rounded-xl border bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 col-span-2 md:col-span-1">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-medium flex items-center gap-1">
            <BatteryCharging className="w-3 h-3 text-emerald-500" />
            Ramp Velocity
          </span>
          <span className={`text-sm font-bold font-mono ${currentPoint.rampRate > 2000 ? "text-rose-600 dark:text-rose-400" : currentPoint.rampRate > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
            {currentPoint.rampRate > 0 ? `+${currentPoint.rampRate} MW/h` : `${currentPoint.rampRate} MW/h`}
          </span>
        </div>
      </div>
    </BentoCard>
  );
};

function CustomChartTooltip({ active, payload, label, isDark }: any) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className={`rounded-xl border p-3.5 backdrop-blur-2xl shadow-xl text-xs min-w-[220px] ${
      isDark ? "bg-[#111827]/95 border-slate-700 text-slate-100" : "bg-white/95 border-slate-200 text-slate-900"
    }`}>
      <div className={`font-semibold border-b pb-1.5 mb-2 flex items-center justify-between ${
        isDark ? "border-slate-800 text-blue-400" : "border-slate-100 text-blue-600"
      }`}>
        <span>Diurnal Hour: {label}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {payload.map((item: any, i: number) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-[11px]" style={{ color: item.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}:
            </span>
            <span className="font-bold font-mono text-[11px]">
              {typeof item.value === "number" ? `${item.value.toLocaleString()} MW` : item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
