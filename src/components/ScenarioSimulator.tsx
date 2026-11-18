"use client";

import React from "react";
import { ScenarioParams, DEFAULT_SCENARIOS } from "@/lib/forecasting-engine";
import { BentoCard } from "./skiper-ui/skiper-bento-grid";
import { Sun, Wind, CloudRain, Thermometer, Battery, Car, RefreshCw } from "lucide-react";

interface ScenarioSimulatorProps {
  params: ScenarioParams;
  onChange: (params: ScenarioParams) => void;
  onReset: () => void;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  params,
  onChange,
  onReset,
}) => {
  const handleSliderChange = (field: keyof ScenarioParams, value: number) => {
    onChange({
      ...params,
      [field]: value,
      scenarioType: "custom",
    });
  };

  const setPreset = (type: keyof typeof DEFAULT_SCENARIOS) => {
    onChange(DEFAULT_SCENARIOS[type]);
  };

  return (
    <BentoCard
      glowColor="blue"
      badge="LIVE GRID SCENARIO GENERATOR"
      title="Dynamic Parameter Injection & Grid Stress Sandbox"
      subtitle="Tune renewable penetration, weather covariates, EV charging surge, and battery energy storage buffer."
      className="col-span-12 lg:col-span-8"
    >
      {/* Preset Selector */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs text-slate-500 dark:text-slate-400 mr-1">Simulated Scenarios:</span>
        <button
          onClick={() => setPreset("summer-normal")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
            params.scenarioType === "summer-normal"
              ? "bg-blue-600 text-white border-blue-600 shadow-sm"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700"
          }`}
        >
          ☀️ Normal Summer
        </button>

        <button
          onClick={() => setPreset("heatwave")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
            params.scenarioType === "heatwave"
              ? "bg-rose-600 text-white border-rose-600 shadow-sm"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700"
          }`}
        >
          🔥 41°C Heatwave Surge
        </button>

        <button
          onClick={() => setPreset("cloud-storm")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
            params.scenarioType === "cloud-storm"
              ? "bg-blue-700 text-white border-blue-700 shadow-sm"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700"
          }`}
        >
          ⛈️ Severe Cloud Storm
        </button>

        <button
          onClick={() => setPreset("high-renewables")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
            params.scenarioType === "high-renewables"
              ? "bg-amber-600 text-white border-amber-600 shadow-sm"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700"
          }`}
        >
          ⚡ Ultra Deep Duck (24 GW Solar)
        </button>

        <button
          onClick={onReset}
          className="ml-auto p-1.5 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
          title="Reset to baseline"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Solar Capacity */}
        <div className="p-3.5 rounded-xl border bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
              <Sun className="w-4 h-4" />
              Installed Solar PV Fleet
            </span>
            <span className="font-bold font-mono text-slate-900 dark:text-white">{(params.solarCapacityMW / 1000).toFixed(1)} GW</span>
          </div>
          <input
            type="range"
            min="4000"
            max="30000"
            step="500"
            value={params.solarCapacityMW}
            onChange={(e) => handleSliderChange("solarCapacityMW", Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
            <span>4 GW (Legacy Grid)</span>
            <span>30 GW (High Influx)</span>
          </div>
        </div>

        {/* Wind Capacity */}
        <div className="p-3.5 rounded-xl border bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <Wind className="w-4 h-4" />
              Installed Wind Turbine Fleet
            </span>
            <span className="font-bold font-mono text-slate-900 dark:text-white">{(params.windCapacityMW / 1000).toFixed(1)} GW</span>
          </div>
          <input
            type="range"
            min="1000"
            max="12000"
            step="200"
            value={params.windCapacityMW}
            onChange={(e) => handleSliderChange("windCapacityMW", Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
            <span>1 GW</span>
            <span>12 GW (Offshore + Onshore)</span>
          </div>
        </div>

        {/* Cloud Cover */}
        <div className="p-3.5 rounded-xl border bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
              <CloudRain className="w-4 h-4" />
              Cloud Cover Attenuation
            </span>
            <span className="font-bold font-mono text-slate-900 dark:text-white">{params.cloudCoverPercent}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="95"
            step="1"
            value={params.cloudCoverPercent}
            onChange={(e) => handleSliderChange("cloudCoverPercent", Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
            <span>0% (Clear Sky)</span>
            <span>95% (Dense Overcast)</span>
          </div>
        </div>

        {/* Temperature */}
        <div className="p-3.5 rounded-xl border bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium">
              <Thermometer className="w-4 h-4" />
              Ambient Peak Temperature
            </span>
            <span className="font-bold font-mono text-slate-900 dark:text-white">{params.temperatureCelsius} °C</span>
          </div>
          <input
            type="range"
            min="18"
            max="45"
            step="1"
            value={params.temperatureCelsius}
            onChange={(e) => handleSliderChange("temperatureCelsius", Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
            <span>18°C (Mild)</span>
            <span>45°C (Extreme Heat Dome)</span>
          </div>
        </div>

        {/* EV Fleet Adoption */}
        <div className="p-3.5 rounded-xl border bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400 font-medium">
              <Car className="w-4 h-4" />
              Evening EV Charging Multiplier
            </span>
            <span className="font-bold font-mono text-slate-900 dark:text-white">{params.evAdoptionFactor.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="2.2"
            step="0.05"
            value={params.evAdoptionFactor}
            onChange={(e) => handleSliderChange("evAdoptionFactor", Number(e.target.value))}
            className="w-full accent-violet-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
            <span>1.0x (Baseline)</span>
            <span>2.2x (Uncoordinated Fleet Peak)</span>
          </div>
        </div>

        {/* Battery Capacity */}
        <div className="p-3.5 rounded-xl border bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-medium">
              <Battery className="w-4 h-4" />
              Grid Battery Storage (BESS Buffer)
            </span>
            <span className="font-bold font-mono text-slate-900 dark:text-white">{(params.batteryCapacityMWh / 1000).toFixed(1)} GWh</span>
          </div>
          <input
            type="range"
            min="2000"
            max="30000"
            step="1000"
            value={params.batteryCapacityMWh}
            onChange={(e) => handleSliderChange("batteryCapacityMWh", Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
            <span>2 GWh</span>
            <span>30 GWh (Deep Decarbonization)</span>
          </div>
        </div>
      </div>
    </BentoCard>
  );
};
