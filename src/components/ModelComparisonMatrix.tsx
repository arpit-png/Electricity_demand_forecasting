"use client";

import React, { useState } from "react";
import { ModelMetrics } from "@/lib/forecasting-engine";
import { BentoCard } from "./skiper-ui/skiper-bento-grid";
import { SkiperTabs } from "./skiper-ui/skiper-tabs";
import { Cpu, CheckCircle2, Clock, Layers, Award, Terminal } from "lucide-react";

interface ModelComparisonMatrixProps {
  metrics: ModelMetrics[];
}

export const ModelComparisonMatrix: React.FC<ModelComparisonMatrixProps> = ({ metrics }) => {
  const [activeModelIndex, setActiveModelIndex] = useState(0);

  const modelTabs = metrics.map((m, idx) => ({
    id: String(idx),
    label: m.name.includes("LSTM")
      ? "Bidirectional LSTM"
      : m.name.includes("Boosting")
      ? "Gradient Boosting (XGB)"
      : m.name.includes("Regression")
      ? "Ridge Regression"
      : "Prophet Baseline",
    badge: `R² ${m.r2}`,
  }));

  const activeModel = metrics[activeModelIndex];

  return (
    <BentoCard
      glowColor="violet"
      badge="MACHINE LEARNING BENCHMARK MATRIX"
      title="Comparative Time-Series Model Architecture Matrix"
      subtitle="Benchmarking Bidirectional LSTM, Gradient Boosted Decision Trees, Regularized Ridge Regression, and Additive Seasonality."
      className="col-span-12"
    >
      {/* Tabs to select active model */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pt-1 border-b border-slate-200 dark:border-slate-800 pb-4">
        <SkiperTabs
          tabs={modelTabs}
          activeId={String(activeModelIndex)}
          onChange={(id) => setActiveModelIndex(Number(id))}
        />
        <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 border border-blue-200 dark:text-blue-400 dark:bg-blue-950/60 dark:border-blue-900/60 px-3 py-1 rounded-full">
          <Award className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Optimal Ramp Fidelity: Bidirectional LSTM (93.6% Ramp Accuracy)</span>
        </div>
      </div>

      {/* Grid of Key Evaluation Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div className="p-3.5 rounded-xl border bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 flex flex-col">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-medium">RMSE</span>
          <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">{activeModel.rmse} MW</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Root Mean Sq Error</span>
        </div>

        <div className="p-3.5 rounded-xl border bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 flex flex-col">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-medium">MAE</span>
          <span className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">{activeModel.mae} MW</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Mean Absolute Error</span>
        </div>

        <div className="p-3.5 rounded-xl border bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 flex flex-col">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-medium">MAPE</span>
          <span className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">{activeModel.mape}%</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Mean Abs % Error</span>
        </div>

        <div className="p-3.5 rounded-xl border bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 flex flex-col">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-medium">R² Score</span>
          <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">{activeModel.r2}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Goodness of Fit</span>
        </div>

        <div className="p-3.5 rounded-xl border bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 flex flex-col">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-medium">Ramp Accuracy</span>
          <span className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">{activeModel.rampAccuracy}%</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">17:00-20:00 Ramp</span>
        </div>

        <div className="p-3.5 rounded-xl border bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 flex flex-col">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-medium">Latency</span>
          <span className="text-xl font-bold font-mono text-violet-600 dark:text-violet-400 mt-1">{activeModel.latencyMs} ms</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Inference SLA</span>
        </div>
      </div>

      {/* Model Deep-Dive Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl border bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h4 className="text-base font-semibold text-slate-900 dark:text-white">{activeModel.name}</h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            {activeModel.architecture}
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>{activeModel.strengths}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Training Convergence Time: <strong className="text-slate-800 dark:text-slate-200 font-mono">{activeModel.trainingTime}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-blue-700 bg-blue-100/60 dark:text-blue-300 dark:bg-blue-950/60 p-2 rounded-lg border border-blue-200 dark:border-blue-900 font-mono text-[11px]">
              <Terminal className="w-3.5 h-3.5 text-blue-500" />
              <span>Inference Pipeline: 24h lag-sequence with multi-head self-attention</span>
            </div>
          </div>
        </div>

        {/* Feature Importance & Covariate Breakdown */}
        <div className="border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 md:pl-6 pt-4 md:pt-0">
          <h5 className="text-xs uppercase text-slate-500 dark:text-slate-400 font-medium tracking-wider mb-3 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Top Feature Drivers &amp; Lag Covariates
          </h5>

          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                <span>Solar Irradiance (GHI W/m²)</span>
                <span className="text-amber-600 dark:text-amber-400 font-mono font-medium">34.8%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5">
                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "34.8%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                <span>Autoregressive Net Demand Lags (t-1, t-24)</span>
                <span className="text-blue-600 dark:text-blue-400 font-mono font-medium">28.4%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: "28.4%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                <span>Ambient Heat Index (°C Cooling Sens.)</span>
                <span className="text-rose-600 dark:text-rose-400 font-mono font-medium">19.2%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5">
                <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: "19.2%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                <span>EV Fleet Coincident Charging Demand</span>
                <span className="text-violet-600 dark:text-violet-400 font-mono font-medium">11.6%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5">
                <div className="bg-violet-500 h-1.5 rounded-full" style={{ width: "11.6%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                <span>Diurnal Fourier Harmonizer (sin/cos cycles)</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-medium">6.0%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "6.0%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </BentoCard>
  );
};
