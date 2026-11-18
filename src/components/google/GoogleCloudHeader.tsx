"use client";

import React, { useState } from "react";
import { Search, Bell, Terminal, HelpCircle, ChevronDown, Check, ShieldCheck, Database, Cloud } from "lucide-react";

interface GoogleCloudHeaderProps {
  onOpenHistory?: () => void;
  frequencyHz?: number;
}

export const GoogleCloudHeader: React.FC<GoogleCloudHeaderProps> = ({
  onOpenHistory,
  frequencyHz = 50.0,
}) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <header className="sticky top-0 z-50 w-full bg-[#131314]/95 backdrop-blur-xl border-b border-[#3c4043] shadow-md select-none">
      {/* Signature Google 4-Color Strip */}
      <div className="h-[3.5px] w-full google-brand-bar" />

      {/* Main Bar */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left: Google Cloud Identity & Project Selector */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Google Cloud Hexagon SVG in 4 Colors */}
          <div className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity">
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none">
              <path
                d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"
                fill="#4285F4"
              />
              <path
                d="M12 4c1.17 0 2.26.33 3.2.91L12.5 7.5 9 10.5 7.5 9C8.6 6 10.1 4 12 4z"
                fill="#EA4335"
              />
              <path
                d="M19 15c0 2.76-2.24 5-5 5h-2l1.5-3.5 3-1.5L19 15z"
                fill="#34A853"
              />
              <path
                d="M7 16l-3 4H2c-.6 0-1-.4-1-1 0-.6.4-1 1-1l3-2h2z"
                fill="#FBBC04"
              />
            </svg>
            <div className="flex items-center gap-1.5 text-sm">
              <span className="font-bold text-[#e8eaed] tracking-tight text-base font-sans">Google Cloud</span>
              <span className="text-[#5f6368] font-light">|</span>
              <span className="text-[#8ab4f8] font-medium text-xs sm:text-sm tracking-tight">Energy Intelligence Core</span>
            </div>
          </div>

          {/* Project Picker Dropdown */}
          <div className="hidden lg:flex items-center gap-2 ml-3 px-2.5 py-1 rounded-md bg-[#202124] hover:bg-[#303134] border border-[#3c4043] cursor-pointer text-xs transition-colors">
            <div className="w-2 h-2 rounded-full bg-[#81c995]" />
            <span className="font-mono text-[#e8eaed] font-medium">caiso-grid-forecaster-prod</span>
            <span className="text-[#9aa0a6] text-[11px] font-mono">[us-west1]</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#9aa0a6]" />
          </div>
        </div>

        {/* Center: Google Search Pill */}
        <div className="hidden md:flex items-center flex-1 max-w-xl mx-4">
          <div
            className={`w-full flex items-center gap-3 px-3.5 py-1.5 rounded-full border transition-all ${
              searchFocused
                ? "bg-[#303134] border-[#8ab4f8] shadow-[0_0_0_2px_rgba(138,180,248,0.2)]"
                : "bg-[#202124] border-[#3c4043] hover:bg-[#28292c]"
            }`}
          >
            <Search className="w-4 h-4 text-[#9aa0a6] shrink-0" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search models, duck curve metrics, BigQuery features, or API endpoints..."
              className="w-full bg-transparent border-none outline-none text-xs text-[#e8eaed] placeholder-[#9aa0a6] font-sans"
            />
            <div className="flex items-center gap-1 shrink-0">
              <kbd className="px-1.5 py-0.5 rounded bg-[#131314] text-[10px] text-[#9aa0a6] font-mono border border-[#3c4043]">Ctrl</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-[#131314] text-[10px] text-[#9aa0a6] font-mono border border-[#3c4043]">K</kbd>
            </div>
          </div>
        </div>

        {/* Right: Operational Status & Google Account Elements */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Live Frequency Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#18191c] border border-[#3c4043] text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-[#81c995] animate-pulse" />
            <span className="text-[#9aa0a6]">GRID:</span>
            <span className="text-[#81c995] font-semibold">{frequencyHz.toFixed(2)} Hz</span>
          </div>

          {/* Vertex AI SLA Chip */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1b2b44] border border-[#8ab4f8]/30 text-[11px] text-[#8ab4f8] font-sans">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8ab4f8]" />
            <span>Vertex AI 99.99% SLA</span>
          </div>

          {/* Database History / Firestore Button */}
          {onOpenHistory && (
            <button
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#202124] hover:bg-[#303134] border border-[#3c4043] text-xs font-mono text-[#e8eaed] transition-colors"
              title="View Cloud Firestore Simulation Vault"
            >
              <Database className="w-3.5 h-3.5 text-[#fbbc04]" />
              <span className="hidden md:inline">Firestore Vault</span>
            </button>
          )}

          {/* Cloud Shell Icon Button */}
          <button
            onClick={() => {
              window.open("https://github.com/arpit-png/Electricity_demand_forecasting", "_blank");
            }}
            className="p-1.5 rounded-full hover:bg-[#303134] text-[#9aa0a6] hover:text-[#e8eaed] transition-colors"
            title="Open Cloud Repository (GitHub)"
          >
            <Terminal className="w-4 h-4 text-[#8ab4f8]" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              className="p-1.5 rounded-full hover:bg-[#303134] text-[#9aa0a6] hover:text-[#e8eaed] transition-colors"
              title="System Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ea4335]" />
            </button>
          </div>

          {/* Google Account Avatar with 4-Color Perimeter Ring */}
          <div className="p-0.5 rounded-full google-brand-gradient-smooth animate-google-bar cursor-pointer" title="Google Cloud Enterprise Identity">
            <div className="w-7 h-7 rounded-full bg-[#202124] flex items-center justify-center text-xs font-bold font-sans text-[#8ab4f8]">
              G
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
