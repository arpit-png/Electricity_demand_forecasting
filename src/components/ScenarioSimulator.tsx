"use client";

import React from "react";
import { ScenarioParams, DEFAULT_SCENARIOS } from "@/lib/forecasting-engine";
import { BentoCard } from "./skiper-ui/skiper-bento-grid";
import { Sun, Wind, CloudRain, Thermometer, Battery, Car, RefreshCw, Sparkles } from "lucide-react";

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
      badge="VERTEX AI SCENARIO SIMULATOR"
      title="Dynamic Parameter Injection & Grid Stress Sandbox"
      subtitle="Tune renewable penetration, weather covariates, EV charging surge, and battery energy storage buffer."
      className="col-span-12 lg:col-span-8"
    >
      {/* Preset Selector */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs font-sans text-[#9aa0a6] mr-1">Simulated Scenarios:</span>
        <button
          onClick={() => setPreset("summer-normal")}
          className={`px-3 py-1.5 rounded-full text-xs font-sans transition-all border ${
            params.scenarioType === "summer-normal"
              ? "bg-[#1b2b44] text-[#8ab4f8] border-[#8ab4f8]/50 font-semibold"
              : "bg-[#202124] text-[#9aa0a6] border-[#3c4043] hover:bg-[#303134]"
          }`}
        >
          ☀️ Normal Summer
        </button>

        <button
          onClick={() => setPreset("heatwave")}
          className={`px-3 py-1.5 rounded-full text-xs font-sans transition-all border ${
            params.scenarioType === "heatwave"
              ? "bg-[#331111] text-[#f28b82] border-[#ea4335]/50 font-semibold"
              : "bg-[#202124] text-[#9aa0a6] border-[#3c4043] hover:bg-[#303134]"
          }`}
        >
          🔥 41°C Heatwave Surge
        </button>

        <button
          onClick={() => setPreset("cloud-storm")}
          className={`px-3 py-1.5 rounded-full text-xs font-sans transition-all border ${
            params.scenarioType === "cloud-storm"
              ? "bg-[#1b2b44] text-[#8ab4f8] border-[#8ab4f8]/50 font-semibold"
              : "bg-[#202124] text-[#9aa0a6] border-[#3c4043] hover:bg-[#303134]"
          }`}
        >
          ⛈️ Severe Cloud Storm
        </button>

        <button
          onClick={() => setPreset("high-renewables")}
          className={`px-3 py-1.5 rounded-full text-xs font-sans transition-all border ${
            params.scenarioType === "high-renewables"
              ? "bg-[#332800] text-[#fdd663] border-[#fbbc04]/50 font-semibold"
              : "bg-[#202124] text-[#9aa0a6] border-[#3c4043] hover:bg-[#303134]"
          }`}
        >
          ⚡ Ultra Deep Duck (24 GW Solar)
        </button>

        <button
          onClick={onReset}
          className="ml-auto p-1.5 rounded-full text-[#9aa0a6] hover:text-white bg-[#202124] hover:bg-[#303134] border border-[#3c4043] transition-colors"
          title="Reset to baseline"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
        {/* Solar Capacity */}
        <div className="p-3.5 rounded-xl bg-[#18191c] border border-[#3c4043]">
          <div className="flex items-center justify-between text-[#e8eaed] mb-2">
            <span className="flex items-center gap-1.5 text-[#fdd663] font-medium">
              <Sun className="w-4 h-4 text-[#fbbc04]" />
              Installed Solar PV Fleet
            </span>
            <span className="font-bold font-mono text-white">{(params.solarCapacityMW / 1000).toFixed(1)} GW</span>
          </div>
          <input
            type="range"
            min="4000"
            max="30000"
            step="500"
            value={params.solarCapacityMW}
            onChange={(e) => handleSliderChange("solarCapacityMW", Number(e.target.value))}
            className="w-full accent-[#fbbc04] cursor-pointer h-1.5 bg-[#303134] rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-[#9aa0a6] mt-1 font-mono">
            <span>4 GW (Legacy Grid)</span>
            <span>30 GW (High Influx)</span>
          </div>
        </div>

        {/* Wind Capacity */}
        <div className="p-3.5 rounded-xl bg-[#18191c] border border-[#3c4043]">
          <div className="flex items-center justify-between text-[#e8eaed] mb-2">
            <span className="flex items-center gap-1.5 text-[#81c995] font-medium">
              <Wind className="w-4 h-4 text-[#34a853]" />
              Installed Wind Turbine Fleet
            </span>
            <span className="font-bold font-mono text-white">{(params.windCapacityMW / 1000).toFixed(1)} GW</span>
          </div>
          <input
            type="range"
            min="1000"
            max="12000"
            step="200"
            value={params.windCapacityMW}
            onChange={(e) => handleSliderChange("windCapacityMW", Number(e.target.value))}
            className="w-full accent-[#34a853] cursor-pointer h-1.5 bg-[#303134] rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-[#9aa0a6] mt-1 font-mono">
            <span>1 GW</span>
            <span>12 GW (Offshore + Onshore)</span>
          </div>
        </div>

        {/* Cloud Cover */}
        <div className="p-3.5 rounded-xl bg-[#18191c] border border-[#3c4043]">
          <div className="flex items-center justify-between text-[#e8eaed] mb-2">
            <span className="flex items-center gap-1.5 text-[#8ab4f8] font-medium">
              <CloudRain className="w-4 h-4 text-[#4285f4]" />
              Cloud Cover Attenuation
            </span>
            <span className="font-bold font-mono text-white">{params.cloudCoverPercent}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="95"
            step="1"
            value={params.cloudCoverPercent}
            onChange={(e) => handleSliderChange("cloudCoverPercent", Number(e.target.value))}
            className="w-full accent-[#4285f4] cursor-pointer h-1.5 bg-[#303134] rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-[#9aa0a6] mt-1 font-mono">
            <span>0% (Clear Sky)</span>
            <span>95% (Dense Overcast)</span>
          </div>
        </div>

        {/* Temperature */}
        <div className="p-3.5 rounded-xl bg-[#18191c] border border-[#3c4043]">
          <div className="flex items-center justify-between text-[#e8eaed] mb-2">
            <span className="flex items-center gap-1.5 text-[#f28b82] font-medium">
              <Thermometer className="w-4 h-4 text-[#ea4335]" />
              Ambient Peak Temperature
            </span>
            <span className="font-bold font-mono text-white">{params.temperatureCelsius} °C</span>
          </div>
          <input
            type="range"
            min="18"
            max="45"
            step="1"
            value={params.temperatureCelsius}
            onChange={(e) => handleSliderChange("temperatureCelsius", Number(e.target.value))}
            className="w-full accent-[#ea4335] cursor-pointer h-1.5 bg-[#303134] rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-[#9aa0a6] mt-1 font-mono">
            <span>18°C (Mild)</span>
            <span>45°C (Extreme Heat Dome)</span>
          </div>
        </div>

        {/* EV Fleet Adoption */}
        <div className="p-3.5 rounded-xl bg-[#18191c] border border-[#3c4043]">
          <div className="flex items-center justify-between text-[#e8eaed] mb-2">
            <span className="flex items-center gap-1.5 text-[#c58af9] font-medium">
              <Car className="w-4 h-4 text-[#a142f4]" />
              Evening EV Charging Multiplier
            </span>
            <span className="font-bold font-mono text-white">{params.evAdoptionFactor.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="2.2"
            step="0.05"
            value={params.evAdoptionFactor}
            onChange={(e) => handleSliderChange("evAdoptionFactor", Number(e.target.value))}
            className="w-full accent-[#a142f4] cursor-pointer h-1.5 bg-[#303134] rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-[#9aa0a6] mt-1 font-mono">
            <span>1.0x (Baseline)</span>
            <span>2.2x (Uncoordinated Fleet Peak)</span>
          </div>
        </div>

        {/* Battery Capacity */}
        <div className="p-3.5 rounded-xl bg-[#18191c] border border-[#3c4043]">
          <div className="flex items-center justify-between text-[#e8eaed] mb-2">
            <span className="flex items-center gap-1.5 text-[#78d9ec] font-medium">
              <Battery className="w-4 h-4 text-[#78d9ec]" />
              Grid Battery Storage (BESS Buffer)
            </span>
            <span className="font-bold font-mono text-white">{(params.batteryCapacityMWh / 1000).toFixed(1)} GWh</span>
          </div>
          <input
            type="range"
            min="2000"
            max="30000"
            step="1000"
            value={params.batteryCapacityMWh}
            onChange={(e) => handleSliderChange("batteryCapacityMWh", Number(e.target.value))}
            className="w-full accent-[#78d9ec] cursor-pointer h-1.5 bg-[#303134] rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-[#9aa0a6] mt-1 font-mono">
            <span>2 GWh</span>
            <span>30 GWh (Deep Decarbonization)</span>
          </div>
        </div>
      </div>
    </BentoCard>
  );
};
