"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SkiperStatCardProps {
  label: string;
  value: string;
  unit?: string;
  change?: string;
  changeType?: "positive" | "negative" | "warning" | "neutral";
  icon?: React.ReactNode;
  description?: string;
  className?: string;
  highlightColor?: "cyan" | "amber" | "rose" | "purple" | "emerald";
}

export const SkiperStatCard: React.FC<SkiperStatCardProps> = ({
  label,
  value,
  unit,
  change,
  changeType = "neutral",
  icon,
  description,
  className,
  highlightColor = "cyan",
}) => {
  const badgeColors = {
    positive: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    negative: "bg-rose-500/15 text-rose-400 border-rose-500/20",
    warning: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    neutral: "bg-white/10 text-slate-300 border-white/10",
  }[changeType];

  const valueGlow = {
    cyan: "text-cyan-400",
    amber: "text-amber-400",
    rose: "text-rose-400",
    purple: "text-purple-400",
    emerald: "text-emerald-400",
  }[highlightColor];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-md transition-all hover:border-white/20",
        className
      )}
    >
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
        <span className="uppercase tracking-wider">{label}</span>
        {icon && <span className="text-slate-300">{icon}</span>}
      </div>

      <div className="flex items-baseline gap-1.5 my-1">
        <span className={cn("text-2xl font-bold font-mono tracking-tight text-white", valueGlow)}>
          {value}
        </span>
        {unit && <span className="text-xs font-mono text-slate-400">{unit}</span>}
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px]">
        {change && (
          <span className={cn("px-1.5 py-0.5 rounded border text-[10px] font-mono", badgeColors)}>
            {change}
          </span>
        )}
        {description && <span className="text-slate-400 text-[10px]">{description}</span>}
      </div>
    </div>
  );
};
