"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Sliders, Cpu, Database, Layers, ArrowUp, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme-context";

interface SkiperDockProps {
  onOpenVault: () => void;
}

export const SkiperDock: React.FC<SkiperDockProps> = ({ onOpenVault }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const { theme, toggleTheme } = useTheme();

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
      label: "Grid Stress Sandbox",
      icon: Sliders,
      onClick: () => {
        document.getElementById("sandbox")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "models",
      label: "ML Model Benchmarks",
      icon: Cpu,
      onClick: () => {
        document.getElementById("models")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "architecture",
      label: "System Architecture",
      icon: Layers,
      onClick: () => {
        document.getElementById("architecture")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "vault",
      label: "Simulation Database",
      icon: Database,
      onClick: onOpenVault,
      badge: "Sync",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
      <div className="flex items-center gap-2 p-2 rounded-full backdrop-blur-2xl transition-all duration-300 shadow-xl border bg-white/90 border-slate-200 dark:bg-[#111827]/90 dark:border-slate-800">
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
                "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-blue-600 border border-slate-200",
                "dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-blue-400 dark:border-slate-700"
              )}
            >
              <Icon className="w-4 h-4" />

              {/* Tooltip */}
              {hoveredIdx === idx && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: -38 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute pointer-events-none whitespace-nowrap px-2.5 py-1 rounded-md text-[11px] font-medium border shadow-lg flex items-center gap-1.5 bg-slate-900 text-white border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600"
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-500/20 text-emerald-400 font-mono">
                      {item.badge}
                    </span>
                  )}
                </motion.div>
              )}
            </motion.button>
          );
        })}

        <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* Theme Toggle Button */}
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.15, y: -4 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-amber-400 border border-slate-200 dark:border-slate-700 transition-colors"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </motion.button>

        {/* Scroll To Top Action */}
        <motion.button
          onClick={scrollToTop}
          whileHover={{ scale: 1.15, y: -4 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors"
          title="Scroll to Top"
        >
          <ArrowUp className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};
