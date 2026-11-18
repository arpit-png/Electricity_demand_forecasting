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
        "inline-flex items-center rounded-full p-1 border select-none transition-colors duration-200 shadow-sm",
        "bg-slate-100 border-slate-200 dark:bg-slate-900 dark:border-slate-800",
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
              "relative z-10 flex items-center justify-center font-medium transition-all duration-200 select-none",
              size === "sm" ? "px-3.5 py-1.5 text-xs rounded-full gap-1.5" : "px-5 py-2 text-sm rounded-full gap-2",
              isActive
                ? "text-blue-600 dark:text-blue-400 font-semibold"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            )}
          >
            {tab.icon && <span className="w-3.5 h-3.5 flex items-center justify-center">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-mono",
                  isActive
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                )}
              >
                {tab.badge}
              </span>
            )}
            {isActive && (
              <motion.div
                layoutId="activeTabPillClean"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
                className="absolute inset-0 z-[-1] rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
