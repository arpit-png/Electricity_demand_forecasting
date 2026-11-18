"use client";

import React, { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "blue" | "green" | "amber" | "rose" | "violet" | "cyan" | "gold" | "steel" | "terracotta" | "sage" | "purple" | "yellow" | "red";
  badge?: string;
  title?: string;
  subtitle?: string;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  className,
  glowColor = "blue",
  badge,
  title,
  subtitle,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Modern subtle radial glows
  const glowStyles = {
    blue: "rgba(37, 99, 235, 0.08)",
    steel: "rgba(37, 99, 235, 0.08)",
    amber: "rgba(217, 119, 6, 0.08)",
    yellow: "rgba(217, 119, 6, 0.08)",
    gold: "rgba(217, 119, 6, 0.08)",
    green: "rgba(5, 150, 105, 0.08)",
    sage: "rgba(5, 150, 105, 0.08)",
    rose: "rgba(225, 29, 72, 0.08)",
    red: "rgba(225, 29, 72, 0.08)",
    terracotta: "rgba(225, 29, 72, 0.08)",
    violet: "rgba(124, 58, 237, 0.08)",
    purple: "rgba(124, 58, 237, 0.08)",
    cyan: "rgba(8, 145, 178, 0.08)",
  }[glowColor];

  const borderHoverStyles = {
    blue: "hover:border-blue-500/40 dark:hover:border-blue-400/40",
    steel: "hover:border-blue-500/40 dark:hover:border-blue-400/40",
    amber: "hover:border-amber-500/40 dark:hover:border-amber-400/40",
    yellow: "hover:border-amber-500/40 dark:hover:border-amber-400/40",
    gold: "hover:border-amber-500/40 dark:hover:border-amber-400/40",
    green: "hover:border-emerald-500/40 dark:hover:border-emerald-400/40",
    sage: "hover:border-emerald-500/40 dark:hover:border-emerald-400/40",
    rose: "hover:border-rose-500/40 dark:hover:border-rose-400/40",
    red: "hover:border-rose-500/40 dark:hover:border-rose-400/40",
    terracotta: "hover:border-rose-500/40 dark:hover:border-rose-400/40",
    violet: "hover:border-violet-500/40 dark:hover:border-violet-400/40",
    purple: "hover:border-violet-500/40 dark:hover:border-violet-400/40",
    cyan: "hover:border-cyan-500/40 dark:hover:border-cyan-400/40",
  }[glowColor];

  const badgeColorStyles = {
    blue: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800/60",
    steel: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800/60",
    amber: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/60",
    yellow: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/60",
    gold: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/60",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/60",
    sage: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/60",
    rose: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800/60",
    red: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800/60",
    terracotta: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800/60",
    violet: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/60 dark:text-violet-400 dark:border-violet-800/60",
    purple: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/60 dark:text-violet-400 dark:border-violet-800/60",
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-400 dark:border-cyan-800/60",
  }[glowColor];

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 shadow-sm",
        "bg-white border-slate-200 text-slate-900 dark:bg-[#111827] dark:border-slate-800 dark:text-slate-100",
        borderHoverStyles,
        className
      )}
    >
      {/* Specular spotlight on hover */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-100"
          style={{
            background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, ${glowStyles}, transparent 70%)`,
          }}
        />
      )}

      {/* Header if badge/title provided */}
      {(badge || title) && (
        <div className="relative z-10 mb-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            {badge && (
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide uppercase border",
                  badgeColorStyles
                )}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                {badge}
              </span>
            )}
          </div>
          {title && (
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
};

export const BentoGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-12 gap-6", className)}>
      {children}
    </div>
  );
};
