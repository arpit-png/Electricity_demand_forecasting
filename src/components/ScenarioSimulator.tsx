"use client";

import React from "react";
import { ScenarioParams, DEFAULT_SCENARIOS } from "@/lib/forecasting-engine";
import { BentoCard } from "./skiper-ui/skiper-bento-grid";
import { Sun, Wind, CloudRain, Thermometer, Battery, Car, RefreshCw, Zap } from "lucide-react";

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
      glowColor="cyan"
      badge="LIVE GRID SCENARIO GENERATOR"
      title="Dynamic Parameter Injection & Stress Test Sandbox"
      subtitle="Tune renewable penetration, weather covariates, EV charging surge, and battery energy storage buffer."
      className="col-span-12 lg:col-span-8"
    >
      {/* Preset Selector */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs font-mono text-slate-400 mr-2">Preset Stress Tests:</span>
        <button
          onClick={() => setPreset("summer-normal")}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
            params.scenarioType === "summer-normal"
              ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold shadow-[0_0_10px_rgba(245,158,11,0.2)]"
              : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10"
          }`}
        >
          ☀️ Normal Summer
        </button>

        <button
          onClick={() => setPreset("heatwave")}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
            params.scenarioType === "heatwave"
              ? "bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold shadow-[0_0_10px_rgba(244,63,94,0.2)]"
              : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10"
          }`}
        >
          🔥 41°C Heatwave Surge
        </button>

        <button
          onClick={() => setPreset("cloud-storm")}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
            params.scenarioType === "cloud-storm"
              ? "bg-sky-500/20 text-sky-300 border-sky-500/40 font-bold shadow-[0_0_10px_rgba(56,189,248,0.2)]"
              : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10"
          }`}
        >
          ⛈️ Severe Cloud Storm
        </button>

        <button
          onClick={() => setPreset("high-renewables")}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
            params.scenarioType === "high-renewables"
              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]"
              : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10"
          }`}
        >
          ⚡ Ultra Deep Duck (24 GW Solar)
        </button>

        <button
          onClick={onReset}
          className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          title="Reset to default"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-mono">
        {/* Solar Capacity */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center justify-between text-slate-300 mb-2">
            <span className="flex items-center gap-1.5 text-amber-400">
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
            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>4 GW (Legacy Grid)</span>
            <span>30 GW (Decentralized Boom)</span>
          </div>
        </div>

        {/* Wind Capacity */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center justify-between text-slate-300 mb-2">
            <span className="flex items-center gap-1.5 text-sky-400">
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
            className="w-full accent-sky-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>1 GW</span>
            <span>12 GW (Offshore + Onshore)</span>
          </div>
        </div>

        {/* Cloud Cover */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center justify-between text-slate-300 mb-2">
            <span className="flex items-center gap-1.5 text-slate-300">
              <CloudRain className="w-4 h-4 text-cyan-400" />
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
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>0% (Clear Sky)</span>
            <span>95% (Dense Overcast)</span>
          </div>
        </div>

        {/* Temperature */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center justify-between text-slate-300 mb-2">
            <span className="flex items-center gap-1.5 text-rose-400">
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
            className="w-full accent-rose-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>18°C (Mild)</span>
            <span>45°C (Extreme Heat Dome)</span>
          </div>
        </div>

        {/* EV Fleet Adoption */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center justify-between text-slate-300 mb-2">
            <span className="flex items-center gap-1.5 text-purple-400">
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
            className="w-full accent-purple-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>1.0x (Baseline)</span>
            <span>2.2x (Uncoordinated Fleet Peak)</span>
          </div>
        </div>

        {/* Battery Capacity */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center justify-between text-slate-300 mb-2">
            <span className="flex items-center gap-1.5 text-emerald-400">
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
            className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>2 GWh</span>
            <span>30 GWh (Deep Decarbonization)</span>
          </div>
        </div>
      </div>
    </BentoCard>
  );
};
