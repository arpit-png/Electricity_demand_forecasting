"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SystemArchitecture } from "@/components/SystemArchitecture";
import { generate24HourForecast, DEFAULT_SCENARIOS } from "@/lib/forecasting-engine";
import {
  Layers,
  ShieldCheck,
  Zap,
  ArrowRight,
  Database,
  FileCode,
  CheckCircle,
} from "lucide-react";

export default function ArchitecturePage() {
  const forecast = useMemo(() => {
    return generate24HourForecast(DEFAULT_SCENARIOS["summer-normal"]);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar frequencyHz={50.0} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <Breadcrumbs items={[{ label: "SCADA System Architecture" }]} />

        {/* Page Header */}
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold bg-cyan-50 border-cyan-200 text-cyan-700 dark:bg-cyan-950/60 dark:border-cyan-900/60 dark:text-cyan-400">
            <Layers className="w-3.5 h-3.5 text-cyan-500" />
            <span>4-LAYER PIPELINE • END-TO-END TELEMETRY TO DISPATCH SPECIFICATION</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            System Architecture &amp; SCADA Telemetry Specifications
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            The GridForecaster platform operates across four decoupled, high-resilience tiers engineered for real-time transmission grid analytics: sub-second SCADA ingestion, net demand mathematical transformation, multi-model parallel inference, and automated peaker/BESS dispatch.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/forecast"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-md transition-all active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Inspect Live Telemetry Stream</span>
            </Link>
            <a
              href="/llms.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 transition-all shadow-sm"
            >
              <FileCode className="w-3.5 h-3.5 text-blue-500" />
              <span>Inspect Raw llms.txt Specification</span>
            </a>
          </div>
        </section>

        {/* Architecture Component with Diagrams & Data Export */}
        <section>
          <SystemArchitecture data={forecast.data} />
        </section>

        {/* Compliance and Standards Verification */}
        <section className="p-6 rounded-2xl border bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>Regulatory Standards &amp; Interconnection Standards Conformance</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60">
              <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 block mb-1">
                IEEE Standard 1547-2018
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Standard for Interconnection and Interoperability of Distributed Energy Resources with Associated Electric Power Systems Interfaces.
              </p>
            </div>

            <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60">
              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                NERC Standard BAL-003-2
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Frequency Response and Bias requirements ensuring interconnection primary frequency support during sudden loss of generation.
              </p>
            </div>

            <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60">
              <span className="font-mono text-xs font-bold text-violet-600 dark:text-violet-400 block mb-1">
                CAISO Duck Curve Framework
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Transmission grid net load trajectory modeling tracking midday solar overgeneration depressions and critical sunset ramping gradients.
              </p>
            </div>
          </div>
        </section>

        {/* Cross Navigation */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/dispatch"
            className="text-xs font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
          >
            &larr; Automated Ramp Dispatch
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <span>Return to Central Overview Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
