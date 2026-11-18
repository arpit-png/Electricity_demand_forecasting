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
        "inline-flex items-center rounded-full bg-[#18191c] p-1 border border-[#3c4043] select-none shadow-sm",
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
              "relative z-10 flex items-center justify-center font-sans font-medium transition-all duration-200 select-none",
              size === "sm" ? "px-3.5 py-1.5 text-xs rounded-full gap-1.5" : "px-5 py-2 text-sm rounded-full gap-2",
              isActive ? "text-[#8ab4f8] font-semibold" : "text-[#9aa0a6] hover:text-[#e8eaed] hover:bg-white/[0.04]"
            )}
          >
            {tab.icon && <span className="w-3.5 h-3.5 flex items-center justify-center">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-mono",
                  isActive
                    ? "bg-[#1b2b44] text-[#8ab4f8] border border-[#8ab4f8]/40"
                    : "bg-[#28292c] text-[#9aa0a6]"
                )}
              >
                {tab.badge}
              </span>
            )}
            {isActive && (
              <motion.div
                layoutId="activeGoogleM3TabPill"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
                className="absolute inset-0 z-[-1] rounded-full bg-[#283244] border border-[#8ab4f8]/40 shadow-sm"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
