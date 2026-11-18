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
import { Sun, Wind, Zap, AlertTriangle, BatteryCharging, Play, Pause, BarChart2 } from "lucide-react";
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
    { id: "ml-overlay", label: "DeepMind & Vertex Forecasts" },
  ];

  return (
    <BentoCard
      glowColor="blue"
      badge="GOOGLE CHARTS TELEMETRY CANVAS"
      title="24-Hour Diurnal Net Demand & Duck Curve Engine"
      subtitle="Visualizing the midday belly overgeneration collapse and the rapid 3-hour evening neck ramp."
      className="col-span-12"
    >
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pt-1 border-b border-[#3c4043] pb-4">
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#28292c] hover:bg-[#303134] text-[#8ab4f8] border border-[#3c4043] text-xs font-sans font-medium transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-[#8ab4f8]" /> : <Play className="w-3.5 h-3.5 text-[#8ab4f8]" />}
            <span>{isPlaying ? "Pause Cycle" : "Play 24h Cycle"}</span>
          </button>

          <button
            onClick={() => onSelectHour(18)}
            className="px-3 py-1.5 rounded-full bg-[#331111] hover:bg-[#441616] text-[#f28b82] border border-[#f28b82]/40 text-xs font-sans font-medium transition-colors"
          >
            Peak Ramp (18:00)
          </button>

          <button
            onClick={() => onSelectHour(12)}
            className="px-3 py-1.5 rounded-full bg-[#332800] hover:bg-[#443600] text-[#fdd663] border border-[#fdd663]/40 text-xs font-sans font-medium transition-colors"
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
              {/* Google Yellow Solar Gradient */}
              <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fbbc04" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#fbbc04" stopOpacity={0.0} />
              </linearGradient>

              {/* Google Green Wind Gradient */}
              <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34a853" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#34a853" stopOpacity={0.0} />
              </linearGradient>

              {/* Google Purple / Iris Net Demand Gradient */}
              <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a142f4" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#a142f4" stopOpacity={0.02} />
              </linearGradient>

              {/* Google Cyan Battery Storage Gradient */}
              <linearGradient id="batteryGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#78d9ec" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#78d9ec" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="timeLabel"
              stroke="#9aa0a6"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#3c4043" }}
              fontFamily="Google Sans, Roboto, sans-serif"
            />
            <YAxis
              stroke="#9aa0a6"
              fontSize={11}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              tickLine={false}
              axisLine={{ stroke: "#3c4043" }}
              fontFamily="Roboto Mono, monospace"
            />
            <Tooltip content={<GoogleChartTooltip />} />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "11px", fontFamily: "Google Sans, sans-serif" }} />

            {/* Shaded Annotations: Duck Belly & Evening Ramp */}
            <ReferenceArea
              x1="10:00"
              x2="15:00"
              fill="#fbbc04"
              fillOpacity={0.05}
              stroke="#fbbc04"
              strokeOpacity={0.35}
              strokeDasharray="4 4"
              label={{ value: "DUCK BELLY (Solar Overgeneration)", fill: "#fdd663", fontSize: 10, position: "insideTop", fontFamily: "Google Sans" }}
            />
            <ReferenceArea
              x1="17:00"
              x2="21:00"
              fill="#ea4335"
              fillOpacity={0.06}
              stroke="#ea4335"
              strokeOpacity={0.4}
              strokeDasharray="4 4"
              label={{ value: "DUCK NECK (Peak Evening Ramp)", fill: "#f28b82", fontSize: 10, position: "insideTop", fontFamily: "Google Sans" }}
            />

            {/* Scrubber vertical line indicator */}
            <ReferenceLine
              x={data[selectedHour]?.timeLabel}
              stroke="#8ab4f8"
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
                  stroke="#fbbc04"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#solarGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="windGen"
                  name="Wind Generation (MW)"
                  stroke="#34a853"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#windGrad)"
                />
                <Line
                  type="monotone"
                  dataKey="grossDemand"
                  name="Total Gross Demand (MW)"
                  stroke="#8ab4f8"
                  strokeWidth={2}
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="netDemand"
                  name="Net Demand (Duck Curve)"
                  stroke="#a142f4"
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
                  stroke="#ea4335"
                  strokeWidth={1.75}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="adjustedNetDemand"
                  name="Stabilized Net Demand (Post-BESS)"
                  stroke="#81c995"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="batteryDispatch"
                  name="Battery Storage Dispatch (MW)"
                  stroke="#78d9ec"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#batteryGrad)"
                />
                <Line
                  type="monotone"
                  dataKey="peakerGasDispatch"
                  name="Peaker Gas Backup (MW)"
                  stroke="#f28b82"
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
                  stroke="#e8eaed"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="lstmPrediction"
                  name="DeepMind Bi-LSTM Forecast"
                  stroke="#c58af9"
                  strokeWidth={2.25}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="gradientBoostingPrediction"
                  name="Vertex AI Boosted Trees (XGB)"
                  stroke="#8ab4f8"
                  strokeWidth={1.75}
                  strokeDasharray="3 3"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="ridgeRegressionPrediction"
                  name="TensorFlow Ridge Regression"
                  stroke="#fdd663"
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
      <div className="mt-5 pt-4 border-t border-[#3c4043]">
        <div className="flex items-center justify-between text-xs font-sans text-[#9aa0a6] mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[#8ab4f8] font-semibold">TIME SCRUBBER:</span>
            <span className="text-[#e8eaed] font-bold font-mono bg-[#28292c] px-2 py-0.5 rounded border border-[#3c4043]">
              {currentPoint.timeLabel}
            </span>
            {currentPoint.isPeakRamp && (
              <span className="text-[#f28b82] bg-[#331111] px-2 py-0.5 rounded-full border border-[#f28b82]/40 flex items-center gap-1 text-[11px] font-sans font-medium">
                <AlertTriangle className="w-3 h-3" />
                CRITICAL EVENING RAMP WINDOW
              </span>
            )}
          </div>
          <span className="text-[#9aa0a6] hidden sm:inline text-[11px]">Click or drag along the 24-hour cycle</span>
        </div>

        <input
          type="range"
          min="0"
          max="23"
          value={selectedHour}
          onChange={(e) => onSelectHour(parseInt(e.target.value))}
          className="w-full accent-[#8ab4f8] cursor-pointer h-1.5 bg-[#303134] rounded-lg appearance-none"
        />

        {/* 24-Hour Hour Buttons */}
        <div className="hidden lg:grid grid-cols-24 gap-1 mt-2 text-[10px] font-mono">
          {data.map((d) => (
            <button
              key={d.hour}
              onClick={() => onSelectHour(d.hour)}
              className={`py-1 rounded text-center transition-all ${
                d.hour === selectedHour
                  ? "bg-[#8ab4f8] text-[#041e49] font-bold scale-105 shadow-[0_0_8px_rgba(138,180,248,0.5)]"
                  : d.isPeakRamp
                  ? "bg-[#331111] text-[#f28b82] hover:bg-[#441616]"
                  : d.hour >= 11 && d.hour <= 14
                  ? "bg-[#332800] text-[#fdd663] hover:bg-[#443600]"
                  : "bg-[#18191c] text-[#9aa0a6] hover:bg-[#28292c]"
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4 pt-4 border-t border-[#3c4043] text-xs font-sans">
        <div className="p-3 rounded-xl bg-[#18191c] border border-[#3c4043]">
          <span className="text-[#9aa0a6] text-[10px] uppercase font-sans font-medium flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#8ab4f8]" />
            Gross Demand
          </span>
          <span className="text-sm font-bold font-mono text-[#e8eaed]">{formatMW(currentPoint.grossDemand)}</span>
        </div>

        <div className="p-3 rounded-xl bg-[#18191c] border border-[#3c4043]">
          <span className="text-[#9aa0a6] text-[10px] uppercase font-sans font-medium flex items-center gap-1">
            <Sun className="w-3 h-3 text-[#fbbc04]" />
            Solar Generation
          </span>
          <span className="text-sm font-bold font-mono text-[#fdd663]">{formatMW(currentPoint.solarGen)}</span>
        </div>

        <div className="p-3 rounded-xl bg-[#18191c] border border-[#3c4043]">
          <span className="text-[#9aa0a6] text-[10px] uppercase font-sans font-medium flex items-center gap-1">
            <Wind className="w-3 h-3 text-[#34a853]" />
            Wind Generation
          </span>
          <span className="text-sm font-bold font-mono text-[#81c995]">{formatMW(currentPoint.windGen)}</span>
        </div>

        <div className="p-3 rounded-xl bg-[#18191c] border border-[#3c4043]">
          <span className="text-[#9aa0a6] text-[10px] uppercase font-sans font-medium flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-[#c58af9]" />
            Net Demand
          </span>
          <span className="text-sm font-bold font-mono text-[#c58af9]">{formatMW(currentPoint.netDemand)}</span>
        </div>

        <div className="p-3 rounded-xl bg-[#18191c] border border-[#3c4043] col-span-2 md:col-span-1">
          <span className="text-[#9aa0a6] text-[10px] uppercase font-sans font-medium flex items-center gap-1">
            <BatteryCharging className="w-3 h-3 text-[#81c995]" />
            Ramp Velocity
          </span>
          <span className={`text-sm font-bold font-mono ${currentPoint.rampRate > 2000 ? "text-[#f28b82]" : currentPoint.rampRate > 0 ? "text-[#fdd663]" : "text-[#81c995]"}`}>
            {currentPoint.rampRate > 0 ? `+${currentPoint.rampRate} MW/h` : `${currentPoint.rampRate} MW/h`}
          </span>
        </div>
      </div>
    </BentoCard>
  );
};

function GoogleChartTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-xl border border-[#5f6368] bg-[#202124]/95 p-3.5 backdrop-blur-2xl shadow-2xl font-sans text-xs text-[#e8eaed] min-w-[220px]">
      <div className="font-semibold text-[#8ab4f8] border-b border-[#3c4043] pb-1.5 mb-2 flex items-center justify-between">
        <span>Diurnal Hour: {label}</span>
      </div>
      <div className="flex flex-col gap-1.5 font-sans">
        {payload.map((item: any, i: number) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-[11px]" style={{ color: item.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}:
            </span>
            <span className="font-bold font-mono text-white text-[11px]">
              {typeof item.value === "number" ? `${item.value.toLocaleString()} MW` : item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
