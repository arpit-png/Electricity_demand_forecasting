"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Sliders, Cpu, Database, Layers, ArrowUp, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkiperDockProps {
  onOpenVault: () => void;
}

export const SkiperDock: React.FC<SkiperDockProps> = ({ onOpenVault }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  const dockItems = [
    {
      id: "visualizer",
      label: "24h Duck Curve",
      icon: Activity,
      onClick: () => {
        document.getElementById("visualizer")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "sandbox",
      label: "Stress Sandbox",
      icon: Sliders,
      onClick: () => {
        document.getElementById("sandbox")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "models",
      label: "ML Benchmark",
      icon: Cpu,
      onClick: () => {
        document.getElementById("models")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "architecture",
      label: "System Specs",
      icon: Layers,
      onClick: () => {
        document.getElementById("architecture")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "vault",
      label: "Database Vault",
      icon: Database,
      onClick: onOpenVault,
      badge: "Firestore",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <div className="flex items-center gap-1.5 p-2 rounded-2xl bg-[#0b0e14]/90 border border-white/[0.12] backdrop-blur-2xl shadow-2xl transition-all">
        {dockItems.map((item, idx) => {
          const Icon = item.icon;
          const isHovered = hoveredIdx === idx;

          return (
            <motion.button
              key={item.id}
              onClick={item.onClick}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative group flex items-center justify-center w-10 h-10 rounded-xl text-slate-300 hover:text-white transition-colors",
                "bg-white/[0.04] hover:bg-white/[0.12] border border-white/5 hover:border-white/20"
              )}
            >
              <Icon className="w-4 h-4" />

              {/* Tooltip */}
              <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap px-2 py-1 rounded-md bg-slate-900/95 border border-white/10 text-[10px] font-mono text-slate-200 shadow-xl">
                {item.label}
              </div>

              {item.badge && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              )}
            </motion.button>
          );
        })}

        <div className="w-[1px] h-6 bg-white/10 mx-1" />

        {/* Scroll To Top */}
        <button
          onClick={scrollToTop}
          title="Return to top"
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.12] text-slate-400 hover:text-white border border-white/5 transition-colors"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
