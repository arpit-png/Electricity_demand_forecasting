"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkiperTiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "amber" | "crimson" | "cobalt" | "emerald";
  badge?: string;
  title?: string;
  subtitle?: string;
}

export const SkiperTiltCard: React.FC<SkiperTiltCardProps> = ({
  children,
  className,
  glowColor = "cobalt",
  badge,
  title,
  subtitle,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200, mass: 0.2 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const borderStyles = {
    cobalt: "hover:border-blue-500/40 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.12)]",
    amber: "hover:border-amber-500/40 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.12)]",
    crimson: "hover:border-rose-500/40 group-hover:shadow-[0_0_30px_rgba(244,63,94,0.14)]",
    emerald: "hover:border-emerald-500/40 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.12)]",
  }[glowColor];

  const badgeStyles = {
    cobalt: "text-blue-300 bg-blue-950/60 border-blue-800/40",
    amber: "text-amber-300 bg-amber-950/60 border-amber-800/40",
    crimson: "text-rose-300 bg-rose-950/60 border-rose-800/40",
    emerald: "text-emerald-300 bg-emerald-950/60 border-emerald-800/40",
  }[glowColor];

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0c0e15]/90 backdrop-blur-xl p-6 transition-colors duration-300",
        borderStyles,
        className
      )}
    >
      {/* Glare specular reflection */}
      <div
        className={cn(
          "pointer-events-none absolute -inset-full opacity-0 transition-opacity duration-500 group-hover:opacity-100",
          "bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent"
        )}
      />

      {/* Hairline subtle top light */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

      {/* Header if badge/title provided */}
      {(badge || title) && (
        <div className="relative z-10 mb-4 flex items-start justify-between gap-2">
          <div>
            {badge && (
              <span className={cn("inline-block text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full mb-1.5 border", badgeStyles)}>
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

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
