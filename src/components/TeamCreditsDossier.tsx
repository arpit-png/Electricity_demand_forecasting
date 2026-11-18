"use client";

import React, { useState } from "react";
import { BentoCard } from "./skiper-ui/skiper-bento-grid";
import { HourlyDataPoint } from "@/lib/forecasting-engine";
import { Users, FileText, Download, Code2, GraduationCap, CheckCircle2, Sparkles, BookOpen } from "lucide-react";
import { SkiperMagneticButton } from "./skiper-ui/skiper-magnetic-button";

interface TeamCreditsDossierProps {
  data: HourlyDataPoint[];
}

export const TeamCreditsDossier: React.FC<TeamCreditsDossierProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const teamMembers = [
    {
      role: "Lead Machine Learning & Full-Stack Architecture",
      name: "ARPIT SHUKLA",
      specialty: "Net Demand formulation, Vercel edge deployment, LSTM sequence design & Skiper UI integration.",
      badge: "Lead Engineer",
    },
    {
      role: "Neural Modeling & Time-Series Architecture",
      name: "RISHIKANT SHARMA",
      specialty: "Recurrent LSTM state management, diurnal attention weights, and gradient clipping optimization.",
      badge: "Deep Learning",
    },
    {
      role: "Feature Engineering & Covariate Pipeline",
      name: "SACHIN SENGAR",
      specialty: "Weather attenuation ingestion, solar irradiance indices, and temperature sensitivity coefficients.",
      badge: "Data Engineering",
    },
    {
      role: "Duck Curve Dynamics & Ramp Analysis",
      name: "NIHAD KHAN",
      specialty: "Duck belly overgeneration thresholds, BESS storage dispatch curves, and 3-hour ramp velocity.",
      badge: "Grid Systems",
    },
    {
      role: "Model Evaluation & Baseline Benchmarking",
      name: "AYUSH SINGH BHADAURIA",
      specialty: "Multivariate Polynomial/Ridge regression, ARIMA baseline comparative validation, and RMSE / MAPE profiling.",
      badge: "Validation & Metrics",
    },
  ];

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
    link.setAttribute("download", `Electricity_Demand_Forecast_Team08_${Date.now()}.csv`);
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
            project: "Electricity Demand Forecasting Using Machine Learning",
            team: "Team 08",
            members: teamMembers.map((m) => m.name),
            exportedAt: new Date().toISOString(),
            dataset: data,
          },
          null,
          2
        )
      );
    const link = document.createElement("a");
    link.setAttribute("href", jsonStr);
    link.setAttribute("download", `Electricity_Demand_Forecast_Team08.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <BentoCard
      glowColor="purple"
      badge="ACADEMIC CREDITS & PROJECT SPECIFICATION"
      title="Team 08 • Electricity Demand Forecasting Engineering Dossier"
      subtitle="5th Semester Data Science Capstone Project investigating Decentralized Renewables and the Universal Duck Curve Challenge."
      className="col-span-12"
    >
      {/* Team Roster Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {teamMembers.map((member, i) => (
          <div
            key={i}
            className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-purple-500/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-800/40">
                  {member.badge}
                </span>
                <span className="text-[10px] font-mono text-slate-500">#{i + 1}</span>
              </div>
              <h4 className="text-sm font-bold text-white tracking-tight">{member.name}</h4>
              <p className="text-[11px] text-cyan-400 font-mono mt-0.5">{member.role}</p>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{member.specialty}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Abstract and Methodology Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Abstract & Scientific Problem Statement</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            The widespread adoption of grid-tied decentralized solar photovoltaic (PV) and wind generation introduces non-linear supply volatility known as the <strong>Duck Curve</strong>. While traditional grid operations focus solely on predicting total gross consumption, modern energy transition grids necessitate high-resolution forecasting of <strong>Net Demand</strong>:
          </p>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] select-all">
            NetDemand(t) = GrossDemand(t) - [ SolarPV(t) &times; &alpha;_cloud + WindGeneration(t) ]
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            By comparing <strong>Multivariate Ridge Regression</strong>, <strong>Gradient Boosted Decision Trees</strong>, and <strong>Deep Bidirectional LSTM Neural Networks</strong>, this project demonstrates how machine learning models can accurately predict the 3-hour evening ramp (typically exceeding +9,000 MW in under 180 minutes), providing transmission system operators (TSOs) with crucial lead time to spool up fast-reacting natural gas peaker plants and command Battery Energy Storage Systems (BESS) before frequency collapse occurs.
          </p>
        </div>

        {/* Data & Model Export Tools */}
        <div className="border-t lg:border-t-0 lg:border-l border-white/[0.08] lg:pl-6 pt-4 lg:pt-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-white font-semibold text-sm mb-3">
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export Telemetry & Models</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
              Download the 24-hour synthesized time-series dataset including ground truth, model predictions, ramp velocities, and dispatch logs.
            </p>
          </div>

          <div className="space-y-2">
            <SkiperMagneticButton
              onClick={exportCSV}
              variant="secondary"
              size="sm"
              className="w-full justify-center"
              icon={<Download className="w-3.5 h-3.5 text-cyan-400" />}
            >
              Export Dataset as CSV
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
