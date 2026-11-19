"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ModelComparisonMatrix } from "@/components/ModelComparisonMatrix";
import { generate24HourForecast, DEFAULT_SCENARIOS } from "@/lib/forecasting-engine";
import {
  Cpu,
  CheckCircle,
  Network,
  Zap,
  TrendingUp,
  Sliders,
  BatteryCharging,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export default function ModelsPage() {
  const forecast = useMemo(() => {
    return generate24HourForecast(DEFAULT_SCENARIOS["summer-normal"]);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar frequencyHz={50.0} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <Breadcrumbs items={[{ label: "ML Model Benchmarks" }]} />

        {/* Header */}
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold bg-violet-50 border-violet-200 text-violet-700 dark:bg-violet-950/60 dark:border-violet-900/60 dark:text-violet-400">
            <Cpu className="w-3.5 h-3.5 text-violet-500" />
            <span>TIME-SERIES ML BENCHMARK • 4 ARCHITECTURES EVALUATED</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Machine Learning Model Benchmarks &amp; Mathematical Rigor
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            Rigorous empirical comparison of four distinct modeling paradigms trained on historical synchronous transmission telemetry: Bidirectional LSTM with temporal attention, Gradient Boosted Trees (XGBoost), Multivariate L2 Ridge Regression, and Prophet Additive Decomposition.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/scenarios"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-md transition-all active:scale-95"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Test Models in Scenario Simulator</span>
            </Link>
            <Link
              href="/dispatch"
              className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 transition-all shadow-sm"
            >
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
              <span>Connect to Automated Ramp Dispatch</span>
            </Link>
          </div>
        </section>

        {/* Model Comparison Matrix Table & Visuals */}
        <section>
          <ModelComparisonMatrix metrics={forecast.metrics} />
        </section>

        {/* Architectural Deep-Dive Grid */}
        <section className="space-y-6">
          <div>
            <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wide">
              ARCHITECTURE SPECIFICATIONS
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Model Topologies, Hyperparameters &amp; Training Dynamics
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Model 1: Bi-LSTM */}
            <div className="p-6 rounded-2xl border bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                    <Network className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      Bidirectional LSTM with Temporal Attention
                    </h3>
                    <span className="text-[11px] text-violet-600 dark:text-violet-400 font-semibold">
                      Primary Production Model
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  1.82% MAPE
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Processes synchronous sequences across forward and backward temporal passes. Multi-head scaled dot-product attention automatically computes dynamic weights over historical diurnal lag signatures (168-hour lookback).
              </p>

              <div className="space-y-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Layers / Hidden Units:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">2 Layers (128 units/dir)</span>
                </div>
                <div className="flex justify-between">
                  <span>Dropout / Recurrent Dropout:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">0.20 / 0.15</span>
                </div>
                <div className="flex justify-between">
                  <span>Lookback Horizon:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">168 Hours (7 Days)</span>
                </div>
                <div className="flex justify-between">
                  <span>Optimizer / Loss:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Adam (lr=0.001) / Huber Loss</span>
                </div>
              </div>
            </div>

            {/* Model 2: XGBoost */}
            <div className="p-6 rounded-2xl border bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      Gradient Boosted Decision Trees (XGBoost)
                    </h3>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                      Fast Non-Linear Regressor
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  2.05% MAPE
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Assembles shallow gradient-boosted decision trees. Exhibits superior handling of non-linear meteorological shocks, cloud cover fronts, and rapid temperature changes during heatwave surges.
              </p>

              <div className="space-y-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Estimators / Max Depth:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">350 Trees / Depth 6</span>
                </div>
                <div className="flex justify-between">
                  <span>Learning Rate (eta):</span>
                  <span className="font-semibold text-slate-900 dark:text-white">0.05</span>
                </div>
                <div className="flex justify-between">
                  <span>Subsample / Colsample:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">0.85 / 0.80</span>
                </div>
                <div className="flex justify-between">
                  <span>Objective Function:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">reg:squarederror</span>
                </div>
              </div>
            </div>

            {/* Model 3: Ridge Regression */}
            <div className="p-6 rounded-2xl border bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      Multivariate L2 Ridge Regression
                    </h3>
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                      Interpretable Regulatory Baseline
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  4.12% MAPE
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Deterministic linear model with L2 Tikhonov regularization. Provides auditable coefficient attribution required by certain regulatory bodies under NERC reliability filing guidelines.
              </p>

              <div className="space-y-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Regularization Parameter (alpha):</span>
                  <span className="font-semibold text-slate-900 dark:text-white">10.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Solver:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Cholesky Decomposition</span>
                </div>
                <div className="flex justify-between">
                  <span>Inference Latency:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">&lt; 1 ms</span>
                </div>
              </div>
            </div>

            {/* Model 4: Prophet */}
            <div className="p-6 rounded-2xl border bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      Prophet Additive Decomposition
                    </h3>
                    <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
                      Bayesian Seasonality Decomposer
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                  2.75% MAPE
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Decomposes load curves into piecewise linear growth trends, hourly daily Fourier modes, and weekly patterns with temperature covariates. Handles missing telemetry frames gracefully.
              </p>

              <div className="space-y-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Seasonality Mode:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Additive (Fourier Order 8)</span>
                </div>
                <div className="flex justify-between">
                  <span>Changepoint Prior Scale:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">0.05</span>
                </div>
                <div className="flex justify-between">
                  <span>Uncertainty Intervals:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">95% Credible Interval</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cross Navigation */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/forecast"
            className="text-xs font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
          >
            &larr; 24h Duck Curve Forecast
          </Link>
          <Link
            href="/scenarios"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <span>Proceed to Grid Scenario Sandbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
