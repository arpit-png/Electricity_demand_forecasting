"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "cyan" | "amber" | "rose" | "purple" | "emerald";
  badge?: string;
  title?: string;
  subtitle?: string;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  className,
  glowColor = "cyan",
  badge,
  title,
  subtitle,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const glowStyles = {
    cyan: "rgba(6, 182, 212, 0.15)",
    amber: "rgba(245, 158, 11, 0.15)",
    rose: "rgba(244, 63, 94, 0.18)",
    purple: "rgba(168, 85, 247, 0.16)",
    emerald: "rgba(16, 185, 129, 0.15)",
  }[glowColor];

  const borderStyles = {
    cyan: "group-hover:border-cyan-500/40",
    amber: "group-hover:border-amber-500/40",
    rose: "group-hover:border-rose-500/40",
    purple: "group-hover:border-purple-500/40",
    emerald: "group-hover:border-emerald-500/40",
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
        "group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1017]/85 backdrop-blur-xl p-6 transition-all duration-300",
        borderStyles,
        className
      )}
    >
      {/* Radial Spotlight Effect */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-100"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${glowStyles}, transparent 75%)`,
          }}
        />
      )}

      {/* Subtle top subtle rim line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-white/20 transition-all" />

      {/* Header if badge/title provided */}
      {(badge || title) && (
        <div className="relative z-10 mb-4 flex items-start justify-between gap-2">
          <div>
            {badge && (
              <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded-full mb-1.5">
                {badge}
              </span>
            )}
            {title && (
              <h3 className="text-base font-semibold text-slate-100 tracking-tight flex items-center gap-2">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
