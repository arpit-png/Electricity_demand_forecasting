"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, AlertTriangle, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkiperStatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: "up" | "down" | "neutral" | "warning";
  trendLabel?: string;
  icon?: React.ReactNode;
  variant?: "default" | "critical" | "warning" | "success" | "blue" | "purple";
  badge?: string;
}

export const SkiperStatCard: React.FC<SkiperStatCardProps> = ({
  label,
  value,
  subValue,
  trend,
  trendLabel,
  icon,
  variant = "default",
  badge,
}) => {
  const variantStyles = {
    default: {
      border: "border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500",
      accent: "text-blue-600 dark:text-blue-400",
      badge: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    },
    blue: {
      border: "border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400",
      accent: "text-blue-600 dark:text-blue-400",
      badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800",
    },
    critical: {
      border: "border-rose-200 dark:border-rose-900/60 hover:border-rose-500",
      accent: "text-rose-600 dark:text-rose-400",
      badge: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800",
    },
    warning: {
      border: "border-amber-200 dark:border-amber-900/60 hover:border-amber-500",
      accent: "text-amber-600 dark:text-amber-400",
      badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800",
    },
    success: {
      border: "border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-500",
      accent: "text-emerald-600 dark:text-emerald-400",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800",
    },
    purple: {
      border: "border-violet-200 dark:border-violet-900/60 hover:border-violet-500",
      accent: "text-violet-600 dark:text-violet-400",
      badge: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/60 dark:text-violet-400 dark:border-violet-800",
    },
  }[variant];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-200",
        "bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100",
        variantStyles.border
      )}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-tight">
          {label}
        </span>
        {icon && (
          <span className={cn("p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800", variantStyles.accent)}>
            {icon}
          </span>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="flex items-baseline gap-2 mb-1.5">
        <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
          {value}
        </span>
        {subValue && (
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {subValue}
          </span>
        )}
      </div>

      {/* Bottom Trend / Badge Row */}
      <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs">
        {trendLabel && (
          <div className="flex items-center gap-1">
            {trend === "up" && <TrendingUp className="w-3.5 h-3.5 text-rose-500" />}
            {trend === "down" && <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />}
            {trend === "warning" && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
            {trend === "neutral" && <Activity className="w-3.5 h-3.5 text-blue-500" />}
            <span className="text-[11px] text-slate-500 dark:text-slate-400">{trendLabel}</span>
          </div>
        )}

        {badge && (
          <span className={cn("ml-auto px-2 py-0.5 rounded-full text-[10px] font-mono border", variantStyles.badge)}>
            {badge}
          </span>
        )}
      </div>
    </motion.div>
  );
};
