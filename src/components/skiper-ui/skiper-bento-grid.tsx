"use client";

import React, { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "gold" | "steel" | "terracotta" | "sage" | "cyan" | "amber" | "rose" | "purple" | "emerald";
  badge?: string;
  title?: string;
  subtitle?: string;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  className,
  glowColor = "gold",
  badge,
  title,
  subtitle,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Muted luxury spotlights
  const glowStyles = {
    gold: "rgba(212, 175, 55, 0.08)",
    amber: "rgba(212, 175, 55, 0.08)",
    steel: "rgba(120, 140, 160, 0.08)",
    cyan: "rgba(120, 140, 160, 0.08)",
    terracotta: "rgba(200, 103, 84, 0.08)",
    rose: "rgba(200, 103, 84, 0.08)",
    sage: "rgba(90, 154, 124, 0.08)",
    emerald: "rgba(90, 154, 124, 0.08)",
    purple: "rgba(157, 142, 194, 0.08)",
  }[glowColor];

  const borderHoverStyles = {
    gold: "hover:border-[#d4af37]/30",
    amber: "hover:border-[#d4af37]/30",
    steel: "hover:border-[#788ca0]/30",
    cyan: "hover:border-[#788ca0]/30",
    terracotta: "hover:border-[#c86754]/30",
    rose: "hover:border-[#c86754]/30",
    sage: "hover:border-[#5a9a7c]/30",
    emerald: "hover:border-[#5a9a7c]/30",
    purple: "hover:border-[#9d8ec2]/30",
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
        "group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0d11]/80 backdrop-blur-2xl p-6 transition-all duration-300",
        borderHoverStyles,
        className
      )}
    >
      {/* Subdued radial specular light */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-100"
          style={{
            background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, ${glowStyles}, transparent 70%)`,
          }}
        />
      )}

      {/* Hairline top subtle rim light */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent group-hover:via-white/[0.14] transition-all" />

      {/* Header if badge/title provided */}
      {(badge || title) && (
        <div className="relative z-10 mb-4 flex items-start justify-between gap-2">
          <div>
            {badge && (
              <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-[#d4af37] bg-[#221e14] border border-[#d4af37]/25 px-2 py-0.5 rounded-full mb-1.5">
                {badge}
              </span>
            )}
            {title && (
              <h3 className="text-base font-semibold text-zinc-100 tracking-tight flex items-center gap-2">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
