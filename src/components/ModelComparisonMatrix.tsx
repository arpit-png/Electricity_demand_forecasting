"use client";

import React, { useState } from "react";
import { ModelMetrics } from "@/lib/forecasting-engine";
import { BentoCard } from "./skiper-ui/skiper-bento-grid";
import { SkiperTabs } from "./skiper-ui/skiper-tabs";
import { Cpu, CheckCircle2, TrendingUp, Zap, Clock, Layers, Award } from "lucide-react";

interface ModelComparisonMatrixProps {
  metrics: ModelMetrics[];
}

export const ModelComparisonMatrix: React.FC<ModelComparisonMatrixProps> = ({ metrics }) => {
  const [activeModelIndex, setActiveModelIndex] = useState(0);

  const modelTabs = metrics.map((m, idx) => ({
    id: String(idx),
    label: m.name.split(" ")[0] + (m.name.includes("LSTM") ? " (LSTM)" : m.name.includes("Boosting") ? " (XGB)" : ""),
    badge: `R² ${m.r2}`,
  }));

  const activeModel = metrics[activeModelIndex];

  return (
    <BentoCard
      glowColor="purple"
      badge="MACHINE LEARNING BENCHMARK"
      title="Comparative Machine Learning Architecture Matrix"
      subtitle="Comprehensive benchmarking of Time-Series Forecasting, Regression, Gradient Boosting, and LSTM Neural Networks for Net Demand prediction."
      className="col-span-12"
    >
      {/* Tabs to select active model */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pt-2 border-b border-white/[0.06] pb-4">
        <SkiperTabs
          tabs={modelTabs}
          activeId={String(activeModelIndex)}
          onChange={(id) => setActiveModelIndex(Number(id))}
        />
        <div className="flex items-center gap-2 text-xs font-mono text-purple-300 bg-purple-950/40 border border-purple-500/30 px-3 py-1 rounded-full">
          <Award className="w-3.5 h-3.5 text-purple-400" />
          <span>Top Ramp Predictor: Deep LSTM (94.2% Ramp Accuracy)</span>
        </div>
      </div>

      {/* Grid of Key Error Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col">
          <span className="text-slate-400 text-[10px] uppercase font-mono">RMSE</span>
          <span className="text-xl font-bold font-mono text-white mt-1">{activeModel.rmse} MW</span>
          <span className="text-[10px] text-slate-500 mt-0.5">Root Mean Sq Error</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col">
          <span className="text-slate-400 text-[10px] uppercase font-mono">MAE</span>
          <span className="text-xl font-bold font-mono text-cyan-300 mt-1">{activeModel.mae} MW</span>
          <span className="text-[10px] text-slate-500 mt-0.5">Mean Absolute Error</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col">
          <span className="text-slate-400 text-[10px] uppercase font-mono">MAPE</span>
          <span className="text-xl font-bold font-mono text-amber-300 mt-1">{activeModel.mape}%</span>
          <span className="text-[10px] text-slate-500 mt-0.5">Mean Abs % Error</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col">
          <span className="text-slate-400 text-[10px] uppercase font-mono">R² Score</span>
          <span className="text-xl font-bold font-mono text-emerald-300 mt-1">{activeModel.r2}</span>
          <span className="text-[10px] text-slate-500 mt-0.5">Goodness of Fit</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col">
          <span className="text-slate-400 text-[10px] uppercase font-mono">Ramp Accuracy</span>
          <span className="text-xl font-bold font-mono text-rose-300 mt-1">{activeModel.rampAccuracy}%</span>
          <span className="text-[10px] text-slate-500 mt-0.5">17:00-20:00 Ramp</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col">
          <span className="text-slate-400 text-[10px] uppercase font-mono">Inference Latency</span>
          <span className="text-xl font-bold font-mono text-purple-300 mt-1">{activeModel.latencyMs} ms</span>
          <span className="text-[10px] text-slate-500 mt-0.5">Edge dispatch speed</span>
        </div>
      </div>

      {/* Model Deep-Dive Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <h4 className="text-base font-semibold text-white">{activeModel.name}</h4>
          </div>
          <p className="text-xs text-slate-400 font-mono leading-relaxed mb-4">
            {activeModel.architecture}
          </p>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{activeModel.strengths}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 font-mono">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Training Convergence Time: <strong className="text-slate-200">{activeModel.trainingTime}</strong></span>
            </div>
          </div>
        </div>

        {/* Feature Importance & Covariate Breakdown */}
        <div className="border-t md:border-t-0 md:border-l border-white/[0.08] md:pl-6 pt-4 md:pt-0">
          <h5 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Top Feature Drivers & Lag Covariates
          </h5>

          <div className="space-y-2.5 text-xs font-mono">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Solar Irradiance (W/m²)</span>
                <span className="text-amber-400 font-bold">34.8%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: "34.8%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Autoregressive Lag (t-1, t-24)</span>
                <span className="text-cyan-400 font-bold">28.4%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div className="bg-cyan-400 h-1.5 rounded-full" style={{ width: "28.4%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Temperature Index (°C Heat Sens.)</span>
                <span className="text-rose-400 font-bold">19.2%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div className="bg-rose-400 h-1.5 rounded-full" style={{ width: "19.2%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>EV Fleet Charging Coincidence</span>
                <span className="text-purple-400 font-bold">11.6%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div className="bg-purple-400 h-1.5 rounded-full" style={{ width: "11.6%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Diurnal Hour Harmonizer (sin/cos)</span>
                <span className="text-emerald-400 font-bold">6.0%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: "6.0%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </BentoCard>
  );
};
