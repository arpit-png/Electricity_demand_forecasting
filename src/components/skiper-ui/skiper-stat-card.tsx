"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, AlertTriangle, ShieldCheck, Activity, Zap } from "lucide-react";
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
      border: "border-[#3c4043] hover:border-[#8ab4f8]/50",
      accent: "text-[#8ab4f8]",
      badge: "bg-[#18191c] text-[#9aa0a6] border-[#3c4043]",
    },
    blue: {
      border: "border-[#3c4043] hover:border-[#8ab4f8]/70",
      accent: "text-[#8ab4f8]",
      badge: "bg-[#1b2b44] text-[#8ab4f8] border-[#8ab4f8]/30",
    },
    critical: {
      border: "border-[#ea4335]/40 hover:border-[#ea4335]/70",
      accent: "text-[#f28b82]",
      badge: "bg-[#331111] text-[#f28b82] border-[#f28b82]/40",
    },
    warning: {
      border: "border-[#fbbc04]/40 hover:border-[#fbbc04]/70",
      accent: "text-[#fdd663]",
      badge: "bg-[#332800] text-[#fdd663] border-[#fdd663]/40",
    },
    success: {
      border: "border-[#34a853]/40 hover:border-[#34a853]/70",
      accent: "text-[#81c995]",
      badge: "bg-[#0d2818] text-[#81c995] border-[#81c995]/40",
    },
    purple: {
      border: "border-[#a142f4]/40 hover:border-[#a142f4]/70",
      accent: "text-[#c58af9]",
      badge: "bg-[#281438] text-[#c58af9] border-[#c58af9]/40",
    },
  }[variant];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-[#202124] border p-5 shadow-sm transition-all duration-200",
        variantStyles.border
      )}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-sans text-[#9aa0a6] font-medium tracking-tight">
          {label}
        </span>
        {icon && (
          <span className={cn("p-1.5 rounded-lg bg-[#28292c]", variantStyles.accent)}>
            {icon}
          </span>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="flex items-baseline gap-2 mb-1.5">
        <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[#e8eaed]">
          {value}
        </span>
        {subValue && (
          <span className="text-xs text-[#9aa0a6] font-mono">
            {subValue}
          </span>
        )}
      </div>

      {/* Bottom Trend / Badge Row */}
      <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-[#3c4043]/60 text-xs">
        {trendLabel && (
          <div className="flex items-center gap-1">
            {trend === "up" && <TrendingUp className="w-3.5 h-3.5 text-[#f28b82]" />}
            {trend === "down" && <TrendingDown className="w-3.5 h-3.5 text-[#81c995]" />}
            {trend === "warning" && <AlertTriangle className="w-3.5 h-3.5 text-[#fdd663]" />}
            {trend === "neutral" && <Activity className="w-3.5 h-3.5 text-[#8ab4f8]" />}
            <span className="text-[11px] font-sans text-[#9aa0a6]">{trendLabel}</span>
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
