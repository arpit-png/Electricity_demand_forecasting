"use client";

import React from "react";
import { Zap, Moon, Sun, Database, GitBranch, Activity, ShieldCheck, ChevronRight } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

interface NavbarProps {
  onOpenHistory?: () => void;
  frequencyHz?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenHistory,
  frequencyHz = 50.0,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl border-b transition-colors duration-300 bg-white/80 dark:bg-[#090d16]/85 border-slate-200 dark:border-slate-800 shadow-sm select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
                GridForecaster
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60">
                v2.4 Production
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              Electricity Net Demand &amp; Duck Curve Intelligence Engine
            </p>
          </div>
        </div>

        {/* Center/Right: Live Telemetry & Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Synchronous Grid Frequency Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400">FREQ:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{frequencyHz.toFixed(2)} Hz</span>
          </div>

          {/* Compliance Chip */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>IEEE 1547 Compliant</span>
          </div>

          {/* Database History Vault Button */}
          {onOpenHistory && (
            <button
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800"
              title="Open Simulation Vault"
            >
              <Database className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Scenario Vault</span>
            </button>
          )}

          {/* Source Repository Link */}
          <button
            onClick={() => {
              window.open("https://github.com/arpit-png/Electricity_demand_forecasting", "_blank");
            }}
            className="p-2 rounded-full transition-colors bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
            title="View GitHub Repository"
          >
            <GitBranch className="w-4 h-4" />
          </button>

          {/* Smooth Dark/Light Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Dark and Light Mode"
            className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-amber-400 border border-slate-200 dark:border-slate-800 shadow-sm"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 hover:rotate-45 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 transition-transform duration-300 -rotate-12 hover:rotate-0 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
