import React from "react";
import Link from "next/link";
import { Zap, ShieldCheck, FileText, Database, GitBranch, ArrowUpRight } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-24 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400 text-xs transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Column 1: Organization & Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <span>GridForecaster</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              Transmission Systems &amp; Analytics Laboratory. Real-time net electricity demand forecasting pipeline mitigating duck curve volatility and high-gradient evening ramps.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>IEEE 1547 &amp; NERC BAL-003 Compliant</span>
            </div>
          </div>

          {/* Column 2: Clean Platform Slugs */}
          <div>
            <span className="block font-semibold uppercase tracking-wider text-[11px] text-slate-900 dark:text-white mb-3">
              Telemetry Pages
            </span>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Central Overview Hub
                </Link>
              </li>
              <li>
                <Link href="/forecast" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  24h Duck Curve Forecast
                </Link>
              </li>
              <li>
                <Link href="/models" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Machine Learning Models
                </Link>
              </li>
              <li>
                <Link href="/scenarios" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Grid Scenario Simulator
                </Link>
              </li>
              <li>
                <Link href="/dispatch" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Automated Ramp Dispatch
                </Link>
              </li>
              <li>
                <Link href="/architecture" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  SCADA System Architecture
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Machine Learning & Engineering */}
          <div>
            <span className="block font-semibold uppercase tracking-wider text-[11px] text-slate-900 dark:text-white mb-3">
              Model Architectures
            </span>
            <ul className="space-y-2 text-[11px]">
              <li className="flex items-center justify-between">
                <span>Bidirectional LSTM + Attention</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">1.82% MAPE</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Gradient Boosted XGBoost</span>
                <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">2.05% MAPE</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Multivariate Ridge Regression</span>
                <span className="font-mono text-amber-600 dark:text-amber-400 font-semibold">4.12% MAPE</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Prophet Additive Decomposition</span>
                <span className="font-mono text-violet-600 dark:text-violet-400 font-semibold">2.75% MAPE</span>
              </li>
              <li className="pt-1 border-t border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Forecasting Horizon: 24h Synchronous</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Standards, APIs & Meta */}
          <div>
            <span className="block font-semibold uppercase tracking-wider text-[11px] text-slate-900 dark:text-white mb-3">
              Developer &amp; Standards
            </span>
            <ul className="space-y-2">
              <li>
                <a
                  href="/api/forecast"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Database className="w-3 h-3" />
                  <span>REST Telemetry API (JSON)</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="/llms.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <FileText className="w-3 h-3" />
                  <span>llms.txt Context Documentation</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span>sitemap.xml Index</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/arpit-png/Electricity_demand_forecasting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <GitBranch className="w-3 h-3" />
                  <span>GitHub Repository</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Baseline Bar */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-slate-400">
          <div>
            &copy; 2026 Transmission Systems &amp; Energy Analytics Group. Distributed under MIT License.
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono">50.00 Hz Primary Frequency Control</span>
            <span>•</span>
            <span className="font-mono">Canonical: grid-demand-forecast.vercel.app</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
