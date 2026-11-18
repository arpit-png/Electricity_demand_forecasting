"use client";

import React from "react";
import { BentoCard } from "./skiper-ui/skiper-bento-grid";
import { HourlyDataPoint } from "@/lib/forecasting-engine";
import { Download, Code2, Layers, Cpu, ShieldCheck, Database, GitBranch, Cloud, Terminal } from "lucide-react";

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
      "DeepMind_LSTM_MW",
      "Vertex_XGBoost_MW",
      "TensorFlow_Ridge_MW",
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
    link.setAttribute("download", `GoogleCloud_NetDemand_Telemetry_${Date.now()}.csv`);
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
            system: "Google Cloud | Net Demand Electricity Forecasting & Duck Curve Dispatch Engine",
            standard: "IEEE 1547 / NERC Reliability Standard Compliant",
            platform: "Google Cloud Platform (BigQuery + Vertex AI + Cloud Firestore)",
            exportedAt: new Date().toISOString(),
            dataset: data,
          },
          null,
          2
        )
      );
    const link = document.createElement("a");
    link.setAttribute("href", jsonStr);
    link.setAttribute("download", `GoogleCloud_NetDemand_Telemetry.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const architectureLayers = [
    {
      title: "1. Google Cloud BigQuery",
      desc: "Petabyte-scale SCADA & smart meter ingestion: solar irradiance (W/m²), heat index, wind velocity, and consumer demand.",
      badge: "BigQuery Ingestion",
      icon: Database,
      color: "text-[#8ab4f8]",
      badgeBg: "bg-[#1b2b44] text-[#8ab4f8] border-[#8ab4f8]/30",
    },
    {
      title: "2. Google Cloud Dataform",
      desc: "Declarative SQLX pipeline calculating Net Demand = Gross Demand - (Solar PV + Wind) with cloud attenuation coefficients.",
      badge: "Dataform SQLX",
      icon: GitBranch,
      color: "text-[#fdd663]",
      badgeBg: "bg-[#332800] text-[#fdd663] border-[#fbbc04]/30",
    },
    {
      title: "3. Vertex AI & DeepMind Models",
      desc: "Parallel inference across DeepMind Bidirectional LSTM, Vertex AI Boosted Trees, TensorFlow Ridge, and Prophet.",
      badge: "Vertex AI",
      icon: Cpu,
      color: "text-[#c58af9]",
      badgeBg: "bg-[#281438] text-[#c58af9] border-[#c58af9]/30",
    },
    {
      title: "4. Cloud Firestore & Dispatch",
      desc: "Real-time dispatch synchronization triggering BESS battery storage discharge and gas turbine pre-warming ahead of the evening ramp.",
      badge: "Cloud Firestore",
      icon: ShieldCheck,
      color: "text-[#81c995]",
      badgeBg: "bg-[#0d2818] text-[#81c995] border-[#81c995]/30",
    },
  ];

  return (
    <BentoCard
      glowColor="blue"
      badge="GOOGLE CLOUD REFERENCE ARCHITECTURE"
      title="Enterprise Transmission Grid Net Demand Pipeline Specification"
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
              className="p-4 rounded-xl bg-[#18191c] border border-[#3c4043] hover:border-[#8ab4f8]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-sans font-medium px-2 py-0.5 rounded-full border ${layer.badgeBg}`}>
                    {layer.badge}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${layer.color}`} />
                </div>
                <h4 className="text-sm font-semibold font-sans text-[#e8eaed] tracking-tight">{layer.title}</h4>
                <p className="text-[11px] font-sans text-[#9aa0a6] mt-2 leading-relaxed">{layer.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mathematical Formulation and Export Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-5 rounded-2xl bg-[#18191c] border border-[#3c4043] text-xs font-sans">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2 text-[#e8eaed] font-semibold text-sm">
            <Layers className="w-4 h-4 text-[#8ab4f8]" />
            <span>Mathematical Net Demand & Ramp Formulation</span>
          </div>
          <p className="text-[#9aa0a6] leading-relaxed text-[11px] font-sans">
            Decentralized variable renewable energy (VRE) fundamentally disrupts traditional load profiles. While standard dispatch pipelines forecast gross consumption alone, transmission system operators require continuous forecasting of <strong>Net Demand</strong> to prevent evening blackouts:
          </p>
          <div className="p-3 rounded-xl bg-[#131314] border border-[#3c4043] text-[#8ab4f8] font-mono text-[11px] select-all">
            NetDemand(t) = GrossDemand(t) - [ SolarPV(t) &times; &alpha;_cloud + WindGeneration(t) ]
          </div>
          <div className="p-3 rounded-xl bg-[#131314] border border-[#3c4043] text-[#fdd663] font-mono text-[11px] select-all">
            RampRate(t) = NetDemand(t) - NetDemand(t - 1) &nbsp;&nbsp;|&nbsp;&nbsp; 3hRamp = NetDemand(20:00) - NetDemand(17:00)
          </div>
          <p className="text-[#9aa0a6] leading-relaxed text-[11px] font-sans">
            When the 3-hour evening ramp rate exceeds the threshold of <strong>+9,000 MW</strong>, simple-cycle combustion turbines (SCCT) and Battery Energy Storage Systems (BESS) are dispatched automatically based on Vertex AI model lookahead inferences.
          </p>
        </div>

        {/* Data & Model Export Tools */}
        <div className="border-t lg:border-t-0 lg:border-l border-[#3c4043] lg:pl-6 pt-4 lg:pt-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#e8eaed] font-semibold text-sm mb-3">
              <Download className="w-4 h-4 text-[#81c995]" />
              <span>BigQuery Dataset Export</span>
            </div>
            <p className="text-[11px] text-[#9aa0a6] leading-relaxed mb-4">
              Export the current 24-hour synthesized time-series dataset including ground truth, model predictions, ramp velocities, and dispatch logs.
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={exportCSV}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-sans text-xs bg-[#202124] hover:bg-[#303134] text-[#e8eaed] border border-[#3c4043] transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#8ab4f8]" />
              <span>Export Telemetry as CSV</span>
            </button>

            <button
              onClick={exportJSON}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-sans text-xs bg-[#202124] hover:bg-[#303134] text-[#e8eaed] border border-[#3c4043] transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-[#81c995]" />
              <span>Export Raw JSON Payload</span>
            </button>
          </div>
        </div>
      </div>
    </BentoCard>
  );
};
