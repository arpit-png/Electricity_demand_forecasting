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
  highlightColor = "amber",
}) => {
  const badgeColors = {
    positive: "bg-[#141d18] text-[#5a9a7c] border-[#5a9a7c]/25",
    negative: "bg-[#251715] text-[#e07563] border-[#c86754]/25",
    warning: "bg-[#211d14] text-[#e5c268] border-[#d4af37]/25",
    neutral: "bg-white/[0.04] text-zinc-400 border-white/[0.08]",
  }[changeType];

  const valueGlow = {
    amber: "text-[#e5c268]",
    cyan: "text-[#8fa8c0]",
    rose: "text-[#e07563]",
    purple: "text-[#9d8ec2]",
    emerald: "text-[#6aa88a]",
  }[highlightColor];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/[0.07] bg-[#0d0d12]/80 p-4 backdrop-blur-xl transition-all duration-300 hover:border-white/[0.14]",
        className
      )}
    >
      <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-2">
        <span className="uppercase tracking-wider text-[10px] text-zinc-400">{label}</span>
        {icon && <span className="text-zinc-400">{icon}</span>}
      </div>

      <div className="flex items-baseline gap-1.5 my-1">
        <span className={cn("text-2xl font-bold font-mono tracking-tight", valueGlow)}>
          {value}
        </span>
        {unit && <span className="text-xs font-mono text-zinc-400">{unit}</span>}
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px]">
        {change && (
          <span className={cn("px-1.5 py-0.5 rounded border text-[10px] font-mono", badgeColors)}>
            {change}
          </span>
        )}
        {description && <span className="text-zinc-500 text-[10px]">{description}</span>}
      </div>
    </div>
  );
};
