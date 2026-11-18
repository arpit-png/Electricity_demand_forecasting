"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Sliders, Cpu, Database, Layers, ArrowUp, BarChart3, CloudRain } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkiperDockProps {
  onOpenVault: () => void;
}

export const SkiperDock: React.FC<SkiperDockProps> = ({ onOpenVault }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const dockItems = [
    {
      id: "visualizer",
      label: "Duck Curve Analytics",
      icon: Activity,
      onClick: () => {
        document.getElementById("visualizer")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "sandbox",
      label: "Grid Scenario Sandbox",
      icon: Sliders,
      onClick: () => {
        document.getElementById("sandbox")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "models",
      label: "Vertex AI Benchmarks",
      icon: Cpu,
      onClick: () => {
        document.getElementById("models")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "architecture",
      label: "BigQuery & Dataform",
      icon: Layers,
      onClick: () => {
        document.getElementById("architecture")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "vault",
      label: "Cloud Firestore Vault",
      icon: Database,
      onClick: onOpenVault,
      badge: "Firestore",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
      <div className="flex items-center gap-2 p-2 rounded-full bg-[#202124]/95 border border-[#3c4043] backdrop-blur-2xl shadow-2xl transition-all">
        {dockItems.map((item, idx) => {
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              onClick={item.onClick}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative flex items-center justify-center w-10 h-10 rounded-full transition-colors",
                "bg-[#28292c] hover:bg-[#303134] text-[#9aa0a6] hover:text-[#8ab4f8] border border-[#3c4043]"
              )}
            >
              <Icon className="w-4 h-4" />

              {/* Tooltip */}
              {hoveredIdx === idx && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: -38 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute pointer-events-none whitespace-nowrap px-2.5 py-1 rounded-md bg-[#303134] text-[#e8eaed] text-[11px] font-sans font-medium border border-[#5f6368] shadow-lg flex items-center gap-1.5"
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-[#0d2818] text-[#81c995] font-mono border border-[#81c995]/30">
                      {item.badge}
                    </span>
                  )}
                </motion.div>
              )}
            </motion.button>
          );
        })}

        <div className="h-5 w-[1px] bg-[#3c4043] mx-1" />

        {/* Scroll To Top Action */}
        <motion.button
          onClick={scrollToTop}
          whileHover={{ scale: 1.15, y: -4 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1b2b44] hover:bg-[#25395a] text-[#8ab4f8] border border-[#8ab4f8]/40 transition-colors"
          title="Scroll to Top"
        >
          <ArrowUp className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};
