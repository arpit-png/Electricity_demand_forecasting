"use client";

import React, { useState } from "react";
import { ModelMetrics } from "@/lib/forecasting-engine";
import { BentoCard } from "./skiper-ui/skiper-bento-grid";
import { SkiperTabs } from "./skiper-ui/skiper-tabs";
import { Cpu, CheckCircle2, Clock, Layers, Award, Sparkles, ShieldCheck, Terminal } from "lucide-react";

interface ModelComparisonMatrixProps {
  metrics: ModelMetrics[];
}

export const ModelComparisonMatrix: React.FC<ModelComparisonMatrixProps> = ({ metrics }) => {
  const [activeModelIndex, setActiveModelIndex] = useState(0);

  const modelTabs = metrics.map((m, idx) => ({
    id: String(idx),
    label: m.name.includes("LSTM")
      ? "DeepMind Bi-LSTM"
      : m.name.includes("Boosting")
      ? "Vertex AI XGBoost"
      : m.name.includes("Regression")
      ? "TensorFlow Ridge"
      : "Prophet Baseline",
    badge: `R² ${m.r2}`,
  }));

  const activeModel = metrics[activeModelIndex];

  return (
    <BentoCard
      glowColor="purple"
      badge="GOOGLE VERTEX AI MODEL EVALUATION"
      title="Comparative Machine Learning Architecture Matrix"
      subtitle="Benchmarking DeepMind Bidirectional LSTM, Vertex AI Boosted Trees, TensorFlow Ridge Regression, and Prophet."
      className="col-span-12"
    >
      {/* Tabs to select active model */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pt-1 border-b border-[#3c4043] pb-4">
        <SkiperTabs
          tabs={modelTabs}
          activeId={String(activeModelIndex)}
          onChange={(id) => setActiveModelIndex(Number(id))}
        />
        <div className="flex items-center gap-2 text-xs font-sans text-[#8ab4f8] bg-[#1b2b44] border border-[#8ab4f8]/30 px-3 py-1 rounded-full">
          <Award className="w-3.5 h-3.5 text-[#8ab4f8]" />
          <span>Optimal Duck Ramp Fidelity: DeepMind Bi-LSTM (93.6% Ramp Accuracy)</span>
        </div>
      </div>

      {/* Grid of Key Vertex AI Evaluation Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div className="p-3.5 rounded-xl bg-[#18191c] border border-[#3c4043] flex flex-col">
          <span className="text-[#9aa0a6] text-[10px] uppercase font-sans font-medium">RMSE</span>
          <span className="text-xl font-bold font-mono text-[#e8eaed] mt-1">{activeModel.rmse} MW</span>
          <span className="text-[10px] text-[#9aa0a6] mt-0.5">Root Mean Sq Error</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#18191c] border border-[#3c4043] flex flex-col">
          <span className="text-[#9aa0a6] text-[10px] uppercase font-sans font-medium">MAE</span>
          <span className="text-xl font-bold font-mono text-[#8ab4f8] mt-1">{activeModel.mae} MW</span>
          <span className="text-[10px] text-[#9aa0a6] mt-0.5">Mean Absolute Error</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#18191c] border border-[#3c4043] flex flex-col">
          <span className="text-[#9aa0a6] text-[10px] uppercase font-sans font-medium">MAPE</span>
          <span className="text-xl font-bold font-mono text-[#fdd663] mt-1">{activeModel.mape}%</span>
          <span className="text-[10px] text-[#9aa0a6] mt-0.5">Mean Abs % Error</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#18191c] border border-[#3c4043] flex flex-col">
          <span className="text-[#9aa0a6] text-[10px] uppercase font-sans font-medium">R² Score</span>
          <span className="text-xl font-bold font-mono text-[#81c995] mt-1">{activeModel.r2}</span>
          <span className="text-[10px] text-[#9aa0a6] mt-0.5">Goodness of Fit</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#18191c] border border-[#3c4043] flex flex-col">
          <span className="text-[#9aa0a6] text-[10px] uppercase font-sans font-medium">Ramp Accuracy</span>
          <span className="text-xl font-bold font-mono text-[#f28b82] mt-1">{activeModel.rampAccuracy}%</span>
          <span className="text-[10px] text-[#9aa0a6] mt-0.5">17:00-20:00 Ramp</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#18191c] border border-[#3c4043] flex flex-col">
          <span className="text-[#9aa0a6] text-[10px] uppercase font-sans font-medium">Latency</span>
          <span className="text-xl font-bold font-mono text-[#c58af9] mt-1">{activeModel.latencyMs} ms</span>
          <span className="text-[10px] text-[#9aa0a6] mt-0.5">Vertex Endpoint SLA</span>
        </div>
      </div>

      {/* Model Deep-Dive Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl bg-[#18191c] border border-[#3c4043]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-[#8ab4f8]" />
            <h4 className="text-base font-semibold font-sans text-[#e8eaed]">{activeModel.name}</h4>
          </div>
          <p className="text-xs text-[#9aa0a6] font-sans leading-relaxed mb-4">
            {activeModel.architecture}
          </p>

          <div className="space-y-2.5 text-xs font-sans">
            <div className="flex items-start gap-2 text-[#e8eaed]">
              <CheckCircle2 className="w-4 h-4 text-[#81c995] flex-shrink-0 mt-0.5" />
              <span>{activeModel.strengths}</span>
            </div>
            <div className="flex items-center gap-2 text-[#9aa0a6]">
              <Clock className="w-3.5 h-3.5 text-[#fdd663]" />
              <span>Vertex Custom Job Convergence: <strong className="text-[#e8eaed] font-mono">{activeModel.trainingTime}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-[#8ab4f8] bg-[#1b2b44] p-2 rounded-lg border border-[#8ab4f8]/30 font-mono text-[11px]">
              <Terminal className="w-3.5 h-3.5 text-[#8ab4f8]" />
              <span>Endpoint: projects/caiso-energy/locations/us-west1/endpoints/duckcurve-v2</span>
            </div>
          </div>
        </div>

        {/* Feature Importance & Covariate Breakdown */}
        <div className="border-t md:border-t-0 md:border-l border-[#3c4043] md:pl-6 pt-4 md:pt-0">
          <h5 className="text-xs font-sans uppercase text-[#9aa0a6] font-medium tracking-wider mb-3 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#8ab4f8]" />
            Vertex AI Feature Importance & Attribution
          </h5>

          <div className="space-y-2.5 text-xs font-sans">
            <div>
              <div className="flex justify-between text-[#e8eaed] mb-1">
                <span>Solar Irradiance (GHI W/m²)</span>
                <span className="text-[#fdd663] font-mono font-medium">34.8%</span>
              </div>
              <div className="w-full bg-[#28292c] rounded-full h-1.5">
                <div className="bg-[#fbbc04] h-1.5 rounded-full" style={{ width: "34.8%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#e8eaed] mb-1">
                <span>Autoregressive Net Demand Lags (t-1, t-24)</span>
                <span className="text-[#8ab4f8] font-mono font-medium">28.4%</span>
              </div>
              <div className="w-full bg-[#28292c] rounded-full h-1.5">
                <div className="bg-[#4285f4] h-1.5 rounded-full" style={{ width: "28.4%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#e8eaed] mb-1">
                <span>Ambient Heat Index (°C Cooling Sens.)</span>
                <span className="text-[#f28b82] font-mono font-medium">19.2%</span>
              </div>
              <div className="w-full bg-[#28292c] rounded-full h-1.5">
                <div className="bg-[#ea4335] h-1.5 rounded-full" style={{ width: "19.2%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#e8eaed] mb-1">
                <span>EV Fleet Coincident Charging Demand</span>
                <span className="text-[#c58af9] font-mono font-medium">11.6%</span>
              </div>
              <div className="w-full bg-[#28292c] rounded-full h-1.5">
                <div className="bg-[#a142f4] h-1.5 rounded-full" style={{ width: "11.6%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#e8eaed] mb-1">
                <span>Diurnal Fourier Harmonizer (sin/cos cycles)</span>
                <span className="text-[#81c995] font-mono font-medium">6.0%</span>
              </div>
              <div className="w-full bg-[#28292c] rounded-full h-1.5">
                <div className="bg-[#34a853] h-1.5 rounded-full" style={{ width: "6.0%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </BentoCard>
  );
};
