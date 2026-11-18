"use client";

import React from "react";
import { BentoCard } from "./skiper-ui/skiper-bento-grid";
import { HourlyDataPoint } from "@/lib/forecasting-engine";
import { FileText, Download, Code2, Layers, Cpu, ShieldCheck, Database, GitBranch } from "lucide-react";
import { SkiperMagneticButton } from "./skiper-ui/skiper-magnetic-button";

interface SystemArchitectureProps {
  data: HourlyDataPoint[];
}

export const SystemArchitecture: React.FC<SystemArchitectureProps> = ({ data }) => {
  const exportCSV = () => {
    const headers = [
      "Hour",
      "Time",
      "GrossDemand_MW",
      "SolarGen_MW",
      "WindGen_MW",
      "NetDemand_MW",
      "LSTMPrediction_MW",
      "GradientBoosting_MW",
      "RidgeRegression_MW",
      "Prophet_MW",
      "BatteryDispatch_MW",
      "PeakerGasDispatch_MW",
      "RampRate_MW_per_h",
      "AlertLevel",
    ];

    const rows = data.map((d) => [
      d.hour,
      d.timeLabel,
      d.grossDemand,
      d.solarGen,
      d.windGen,
      d.netDemand,
      d.lstmPrediction,
      d.gradientBoostingPrediction,
      d.ridgeRegressionPrediction,
      d.prophetPrediction,
      d.batteryDispatch,
      d.peakerGasDispatch,
      d.rampRate,
      d.alertLevel,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Net_Demand_Forecast_Telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    const jsonStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify(
          {
            system: "Net Demand Electricity Forecasting & Duck Curve Dispatch Engine",
            standard: "IEEE 1547 / NERC Reliability Standard Compliant",
            exportedAt: new Date().toISOString(),
            dataset: data,
          },
          null,
          2
        )
      );
    const link = document.createElement("a");
    link.setAttribute("href", jsonStr);
    link.setAttribute("download", `Net_Demand_Telemetry.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const architectureLayers = [
    {
      title: "1. Ingestion & Covariates",
      desc: "High-resolution telemetry stream: solar irradiance (W/m²), ambient heat index, wind velocity, and baseline consumer load profiles.",
      badge: "Data Layer",
      icon: Database,
    },
    {
      title: "2. Net Demand Transformation",
      desc: "Continuous calculation of Net Demand = Gross Demand - (Solar PV + Wind) with cloud attenuation coefficients.",
      badge: "Core Physics",
      icon: GitBranch,
    },
    {
      title: "3. Multi-Model Inference",
      desc: "Parallel evaluation across Bidirectional LSTM, Gradient Boosted Decision Trees, Ridge Polynomial Regression, and Prophet.",
      badge: "ML Engine",
      icon: Cpu,
    },
    {
      title: "4. Automated Ramp Dispatch",
      desc: "Predicts 3-hour evening ramp velocity to trigger BESS battery discharge and pre-warm simple-cycle peaker gas turbines.",
      badge: "Grid Control",
      icon: ShieldCheck,
    },
  ];

  return (
    <BentoCard
      glowColor="cyan"
      badge="SYSTEM ARCHITECTURE & GOVERNANCE"
      title="Transmission Grid Net Demand Pipeline Specification"
      subtitle="Production time-series machine learning system engineered for rapid-ramp detection and proactive reserve synchronization."
      className="col-span-12"
    >
      {/* 4 Pipeline Stages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {architectureLayers.map((layer, i) => {
          const Icon = layer.icon;
          return (
            <div
              key={i}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-blue-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-blue-300 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                    {layer.badge}
                  </span>
                  <Icon className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <h4 className="text-sm font-bold text-white tracking-tight">{layer.title}</h4>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{layer.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mathematical Formulation and Export Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>Mathematical Net Demand & Ramp Formulation</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            Decentralized variable renewable energy (VRE) fundamentally disrupts traditional load profiles. While standard dispatch pipelines forecast gross consumption alone, transmission system operators require continuous forecasting of <strong>Net Demand</strong> to prevent evening blackouts:
          </p>
          <div className="p-3 rounded-xl bg-slate-950/90 border border-blue-500/30 text-blue-300 font-mono text-[11px] select-all">
            NetDemand(t) = GrossDemand(t) - [ SolarPV(t) &times; &alpha;_cloud + WindGeneration(t) ]
          </div>
          <div className="p-3 rounded-xl bg-slate-950/90 border border-amber-500/30 text-amber-300 font-mono text-[11px] select-all">
            RampRate(t) = NetDemand(t) - NetDemand(t - 1) &nbsp;&nbsp;|&nbsp;&nbsp; 3hRamp = NetDemand(20:00) - NetDemand(17:00)
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            When the 3-hour evening ramp rate exceeds the threshold of <strong>+9,000 MW</strong>, simple-cycle combustion turbines (SCCT) and Battery Energy Storage Systems (BESS) are dispatched automatically based on model lookahead inferences.
          </p>
        </div>

        {/* Data & Model Export Tools */}
        <div className="border-t lg:border-t-0 lg:border-l border-white/[0.08] lg:pl-6 pt-4 lg:pt-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-white font-semibold text-sm mb-3">
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Telemetry Data Export</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
              Export the current 24-hour synthesized time-series dataset including ground truth, model predictions, ramp velocities, and dispatch logs.
            </p>
          </div>

          <div className="space-y-2">
            <SkiperMagneticButton
              onClick={exportCSV}
              variant="secondary"
              size="sm"
              className="w-full justify-center"
              icon={<Download className="w-3.5 h-3.5 text-blue-400" />}
            >
              Export Telemetry as CSV
            </SkiperMagneticButton>

            <SkiperMagneticButton
              onClick={exportJSON}
              variant="secondary"
              size="sm"
              className="w-full justify-center"
              icon={<Code2 className="w-3.5 h-3.5 text-emerald-400" />}
            >
              Export Raw JSON Payload
            </SkiperMagneticButton>
          </div>
        </div>
      </div>
    </BentoCard>
  );
};
