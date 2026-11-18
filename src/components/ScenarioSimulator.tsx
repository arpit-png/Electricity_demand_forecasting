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
      glowColor="gold"
      badge="LIVE GRID SCENARIO GENERATOR"
      title="Dynamic Parameter Injection & Stress Test Sandbox"
      subtitle="Tune renewable penetration, weather covariates, EV charging surge, and battery energy storage buffer."
      className="col-span-12 lg:col-span-8"
    >
      {/* Preset Selector */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs font-mono text-zinc-400 mr-2">Preset Scenarios:</span>
        <button
          onClick={() => setPreset("summer-normal")}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
            params.scenarioType === "summer-normal"
              ? "bg-[#221e14] text-[#e5c268] border-[#d4af37]/40 font-semibold"
              : "bg-white/[0.03] text-zinc-400 border-white/5 hover:bg-white/[0.07]"
          }`}
        >
          ☀️ Normal Summer
        </button>

        <button
          onClick={() => setPreset("heatwave")}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
            params.scenarioType === "heatwave"
              ? "bg-[#251715] text-[#e07563] border-[#c86754]/40 font-semibold"
              : "bg-white/[0.03] text-zinc-400 border-white/5 hover:bg-white/[0.07]"
          }`}
        >
          🔥 41°C Heatwave Surge
        </button>

        <button
          onClick={() => setPreset("cloud-storm")}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
            params.scenarioType === "cloud-storm"
              ? "bg-[#141b24] text-[#8fa8c0] border-[#788ca0]/40 font-semibold"
              : "bg-white/[0.03] text-zinc-400 border-white/5 hover:bg-white/[0.07]"
          }`}
        >
          ⛈️ Severe Cloud Storm
        </button>

        <button
          onClick={() => setPreset("high-renewables")}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
            params.scenarioType === "high-renewables"
              ? "bg-[#1f1d19] text-[#e6cca0] border-[#d4af37]/40 font-semibold"
              : "bg-white/[0.03] text-zinc-400 border-white/5 hover:bg-white/[0.07]"
          }`}
        >
          ⚡ Ultra Deep Duck (24 GW Solar)
        </button>

        <button
          onClick={onReset}
          className="ml-auto p-1.5 rounded-lg text-zinc-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] transition-colors"
          title="Reset to baseline"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-mono">
        {/* Solar Capacity */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center justify-between text-zinc-300 mb-2">
            <span className="flex items-center gap-1.5 text-[#d4af37]">
              <Sun className="w-4 h-4" />
              Installed Solar PV
            </span>
            <span className="font-bold text-white">{(params.solarCapacityMW / 1000).toFixed(1)} GW</span>
          </div>
          <input
            type="range"
            min="4000"
            max="30000"
            step="500"
            value={params.solarCapacityMW}
            onChange={(e) => handleSliderChange("solarCapacityMW", Number(e.target.value))}
            className="w-full accent-[#d4af37] cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
            <span>4 GW (Legacy Grid)</span>
            <span>30 GW (High Influx)</span>
          </div>
        </div>

        {/* Wind Capacity */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center justify-between text-zinc-300 mb-2">
            <span className="flex items-center gap-1.5 text-[#9aa9b8]">
              <Wind className="w-4 h-4" />
              Installed Wind Fleet
            </span>
            <span className="font-bold text-white">{(params.windCapacityMW / 1000).toFixed(1)} GW</span>
          </div>
          <input
            type="range"
            min="1000"
            max="12000"
            step="200"
            value={params.windCapacityMW}
            onChange={(e) => handleSliderChange("windCapacityMW", Number(e.target.value))}
            className="w-full accent-[#9aa9b8] cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
            <span>1 GW</span>
            <span>12 GW (Offshore + Onshore)</span>
          </div>
        </div>

        {/* Cloud Cover */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center justify-between text-zinc-300 mb-2">
            <span className="flex items-center gap-1.5 text-[#8fa8c0]">
              <CloudRain className="w-4 h-4" />
              Cloud Cover Attenuation
            </span>
            <span className="font-bold text-white">{params.cloudCoverPercent}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="95"
            step="1"
            value={params.cloudCoverPercent}
            onChange={(e) => handleSliderChange("cloudCoverPercent", Number(e.target.value))}
            className="w-full accent-[#8fa8c0] cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
            <span>0% (Clear Sky)</span>
            <span>95% (Dense Overcast)</span>
          </div>
        </div>

        {/* Temperature */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center justify-between text-zinc-300 mb-2">
            <span className="flex items-center gap-1.5 text-[#c86754]">
              <Thermometer className="w-4 h-4" />
              Ambient Peak Temperature
            </span>
            <span className="font-bold text-white">{params.temperatureCelsius} °C</span>
          </div>
          <input
            type="range"
            min="18"
            max="45"
            step="1"
            value={params.temperatureCelsius}
            onChange={(e) => handleSliderChange("temperatureCelsius", Number(e.target.value))}
            className="w-full accent-[#c86754] cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
            <span>18°C (Mild)</span>
            <span>45°C (Extreme Heat Dome)</span>
          </div>
        </div>

        {/* EV Fleet Adoption */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center justify-between text-zinc-300 mb-2">
            <span className="flex items-center gap-1.5 text-[#9d8ec2]">
              <Car className="w-4 h-4" />
              Evening EV Charging Multiplier
            </span>
            <span className="font-bold text-white">{params.evAdoptionFactor.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="2.2"
            step="0.05"
            value={params.evAdoptionFactor}
            onChange={(e) => handleSliderChange("evAdoptionFactor", Number(e.target.value))}
            className="w-full accent-[#9d8ec2] cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
            <span>1.0x (Baseline)</span>
            <span>2.2x (Uncoordinated Fleet Peak)</span>
          </div>
        </div>

        {/* Battery Capacity */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center justify-between text-zinc-300 mb-2">
            <span className="flex items-center gap-1.5 text-[#5a9a7c]">
              <Battery className="w-4 h-4" />
              Grid Battery Storage (BESS)
            </span>
            <span className="font-bold text-white">{(params.batteryCapacityMWh / 1000).toFixed(1)} GWh</span>
          </div>
          <input
            type="range"
            min="2000"
            max="30000"
            step="1000"
            value={params.batteryCapacityMWh}
            onChange={(e) => handleSliderChange("batteryCapacityMWh", Number(e.target.value))}
            className="w-full accent-[#5a9a7c] cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
            <span>2 GWh</span>
            <span>30 GWh (Deep Decarbonization)</span>
          </div>
        </div>
      </div>
    </BentoCard>
  );
};
