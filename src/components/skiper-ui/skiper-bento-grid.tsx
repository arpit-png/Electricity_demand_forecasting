"use client";

import React, { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "blue" | "green" | "yellow" | "red" | "purple" | "gold" | "steel" | "terracotta" | "sage";
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

  // Google Material 3 Tonal Spotlights
  const glowStyles = {
    blue: "rgba(66, 133, 244, 0.12)",
    gold: "rgba(251, 188, 4, 0.12)",
    yellow: "rgba(251, 188, 4, 0.12)",
    green: "rgba(52, 168, 83, 0.12)",
    sage: "rgba(52, 168, 83, 0.12)",
    red: "rgba(234, 67, 53, 0.12)",
    terracotta: "rgba(234, 67, 53, 0.12)",
    purple: "rgba(161, 66, 244, 0.12)",
    steel: "rgba(138, 180, 248, 0.12)",
  }[glowColor];

  const borderHoverStyles = {
    blue: "hover:border-[#8ab4f8]/50",
    gold: "hover:border-[#fdd663]/50",
    yellow: "hover:border-[#fdd663]/50",
    green: "hover:border-[#81c995]/50",
    sage: "hover:border-[#81c995]/50",
    red: "hover:border-[#f28b82]/50",
    terracotta: "hover:border-[#f28b82]/50",
    purple: "hover:border-[#c58af9]/50",
    steel: "hover:border-[#8ab4f8]/50",
  }[glowColor];

  const badgeColorStyles = {
    blue: "bg-[#1b2b44] text-[#8ab4f8] border-[#8ab4f8]/30",
    gold: "bg-[#332800] text-[#fdd663] border-[#fdd663]/30",
    yellow: "bg-[#332800] text-[#fdd663] border-[#fdd663]/30",
    green: "bg-[#0d2818] text-[#81c995] border-[#81c995]/30",
    sage: "bg-[#0d2818] text-[#81c995] border-[#81c995]/30",
    red: "bg-[#331111] text-[#f28b82] border-[#f28b82]/30",
    terracotta: "bg-[#331111] text-[#f28b82] border-[#f28b82]/30",
    purple: "bg-[#281438] text-[#c58af9] border-[#c58af9]/30",
    steel: "bg-[#1b2b44] text-[#8ab4f8] border-[#8ab4f8]/30",
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
        "group relative overflow-hidden rounded-2xl border border-[#3c4043] bg-[#202124] p-6 transition-all duration-300 shadow-md",
        borderHoverStyles,
        className
      )}
    >
      {/* Specular Google spotlight on hover */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-100"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${glowStyles}, transparent 70%)`,
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
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-sans font-medium tracking-wide uppercase border",
                  badgeColorStyles
                )}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                {badge}
              </span>
            )}
          </div>
          {title && (
            <h3 className="text-lg sm:text-xl font-bold font-sans tracking-tight text-[#e8eaed]">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#9aa0a6] mt-1 font-sans">
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
