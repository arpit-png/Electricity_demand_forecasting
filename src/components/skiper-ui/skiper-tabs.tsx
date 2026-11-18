"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
  icon?: React.ReactNode;
}

interface SkiperTabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  size?: "sm" | "md";
}

export const SkiperTabs: React.FC<SkiperTabsProps> = ({
  tabs,
  activeId,
  onChange,
  className,
  size = "md",
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xl bg-white/[0.04] p-1 border border-white/[0.08] backdrop-blur-md",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative z-10 flex items-center justify-center font-medium transition-colors select-none",
              size === "sm" ? "px-3 py-1.5 text-xs rounded-lg gap-1.5" : "px-4 py-2 text-sm rounded-lg gap-2",
              isActive ? "text-white font-semibold" : "text-slate-400 hover:text-slate-200"
            )}
          >
            {tab.icon && <span className="w-3.5 h-3.5 flex items-center justify-center">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px] font-mono",
                  isActive ? "bg-cyan-500/20 text-cyan-300" : "bg-white/10 text-slate-400"
                )}
              >
                {tab.badge}
              </span>
            )}
            {isActive && (
              <motion.div
                layoutId="activeSkiperTabPill"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
                className="absolute inset-0 z-[-1] rounded-lg bg-white/[0.12] border border-white/20 shadow-sm"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
