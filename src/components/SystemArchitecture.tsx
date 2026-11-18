"use client";

import React from "react";
import { BentoCard } from "./skiper-ui/skiper-bento-grid";
import { HourlyDataPoint } from "@/lib/forecasting-engine";
import { Download, Code2, Layers, Cpu, ShieldCheck, Database, GitBranch } from "lucide-react";

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
      "BiLSTM_Prediction_MW",
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
    link.setAttribute("download", `NetDemand_Telemetry_${Date.now()}.csv`);
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
            architecture: "Enterprise Time-Series Forecasting & Dispatch Pipeline",
            exportedAt: new Date().toISOString(),
            dataset: data,
          },
          null,
          2
        )
      );
    const link = document.createElement("a");
    link.setAttribute("href", jsonStr);
    link.setAttribute("download", `NetDemand_Telemetry.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const architectureLayers = [
    {
      title: "1. SCADA Telemetry Stream",
      desc: "Synchronous sensor ingestion: solar irradiance (W/m²), ambient heat index, wind velocity, and baseline consumer load profiles.",
      badge: "Ingestion Layer",
      icon: Database,
      color: "text-blue-500",
      badgeBg: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900/60",
    },
    {
      title: "2. Net Demand Transformation",
      desc: "Continuous physical calculation: Net Demand = Gross Demand - (Solar PV + Wind) with cloud attenuation coefficients.",
      badge: "Core Physics",
      icon: GitBranch,
      color: "text-amber-500",
      badgeBg: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-900/60",
    },
    {
      title: "3. Multi-Model Inference",
      desc: "Parallel lookahead evaluation across Bidirectional LSTM, Gradient Boosted Decision Trees, Ridge Regression, and Prophet.",
      badge: "ML Engine",
      icon: Cpu,
      color: "text-violet-500",
      badgeBg: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/60 dark:text-violet-400 dark:border-violet-900/60",
    },
    {
      title: "4. Automated Ramp Dispatch",
      desc: "Predicts 3-hour evening ramp velocity to trigger BESS battery discharge and pre-warm simple-cycle peaker gas turbines.",
      badge: "Grid Control",
      icon: ShieldCheck,
      color: "text-emerald-500",
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900/60",
    },
  ];

  return (
    <BentoCard
      glowColor="blue"
      badge="ENTERPRISE PIPELINE ARCHITECTURE"
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
              className="p-4 rounded-xl border transition-all flex flex-col justify-between bg-slate-50 border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border ${layer.badgeBg}`}>
                    {layer.badge}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${layer.color}`} />
                </div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">{layer.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{layer.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mathematical Formulation and Export Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-5 rounded-2xl border bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-xs">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-sm">
            <Layers className="w-4 h-4 text-blue-500" />
            <span>Mathematical Net Demand &amp; Ramp Formulation</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
            Decentralized variable renewable energy (VRE) fundamentally disrupts traditional load profiles. While standard dispatch pipelines forecast gross consumption alone, transmission system operators require continuous forecasting of <strong>Net Demand</strong> to prevent evening blackouts:
          </p>
          <div className="p-3 rounded-xl border font-mono text-[11px] select-all bg-white border-slate-200 text-blue-600 dark:bg-slate-950 dark:border-slate-800 dark:text-blue-400">
            NetDemand(t) = GrossDemand(t) - [ SolarPV(t) &times; &alpha;_cloud + WindGeneration(t) ]
          </div>
          <div className="p-3 rounded-xl border font-mono text-[11px] select-all bg-white border-slate-200 text-amber-600 dark:bg-slate-950 dark:border-slate-800 dark:text-amber-400">
            RampRate(t) = NetDemand(t) - NetDemand(t - 1) &nbsp;&nbsp;|&nbsp;&nbsp; 3hRamp = NetDemand(20:00) - NetDemand(17:00)
          </div>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
            When the 3-hour evening ramp rate exceeds the threshold of <strong>+9,000 MW</strong>, simple-cycle combustion turbines (SCCT) and Battery Energy Storage Systems (BESS) are dispatched automatically based on model lookahead inferences.
          </p>
        </div>

        {/* Data & Model Export Tools */}
        <div className="border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 lg:pl-6 pt-4 lg:pt-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-sm mb-3">
              <Download className="w-4 h-4 text-emerald-500" />
              <span>Dataset Export Engine</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Export the current 24-hour synthesized time-series dataset including ground truth, model predictions, ramp velocities, and dispatch logs.
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={exportCSV}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-medium transition-colors bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700 shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-blue-500" />
              <span>Export Telemetry as CSV</span>
            </button>

            <button
              onClick={exportJSON}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-medium transition-colors bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700 shadow-sm"
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Export Raw JSON Payload</span>
            </button>
          </div>
        </div>
      </div>
    </BentoCard>
  );
};
