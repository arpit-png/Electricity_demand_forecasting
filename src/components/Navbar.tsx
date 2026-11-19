"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap,
  Moon,
  Sun,
  Database,
  GitBranch,
  ShieldCheck,
  Menu,
  X,
  LineChart,
  Cpu,
  Sliders,
  BatteryCharging,
  Layers,
} from "lucide-react";
import { useTheme } from "@/lib/theme-context";

interface NavbarProps {
  onOpenHistory?: () => void;
  frequencyHz?: number;
}

const NAV_LINKS = [
  { href: "/", label: "Overview", icon: Zap },
  { href: "/forecast", label: "24h Duck Curve", icon: LineChart },
  { href: "/models", label: "ML Benchmark", icon: Cpu },
  { href: "/scenarios", label: "Simulator", icon: Sliders },
  { href: "/dispatch", label: "Ramp Dispatch", icon: BatteryCharging },
  { href: "/architecture", label: "Architecture", icon: Layers },
];

export const Navbar: React.FC<NavbarProps> = ({
  onOpenHistory,
  frequencyHz = 50.0,
}) => {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl border-b transition-colors duration-300 bg-white/85 dark:bg-[#090d16]/85 border-slate-200 dark:border-slate-800 shadow-sm select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
                  GridForecaster
                </span>
                <span className="hidden xl:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60">
                  IEEE 1547
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Net Demand &amp; Duck Curve Intelligence
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Clean URL Slug Navigation Links */}
        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Live Telemetry & Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Synchronous Grid Frequency Indicator */}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-mono bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400">FREQ:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{frequencyHz.toFixed(2)} Hz</span>
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
          <a
            href="https://github.com/arpit-png/Electricity_demand_forecasting"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            className="p-2 rounded-full transition-colors bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
            title="View GitHub Repository"
          >
            <GitBranch className="w-4 h-4" />
          </a>

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

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#090d16]/95 backdrop-blur-xl px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold dark:bg-blue-950/60 dark:text-blue-400"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4 text-blue-500" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
