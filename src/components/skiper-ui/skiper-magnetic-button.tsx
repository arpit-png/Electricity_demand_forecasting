"use client";

import React, { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkiperMagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "amber";
  size?: "sm" | "md" | "lg";
  className?: string;
  icon?: React.ReactNode;
}

export const SkiperMagneticButton: React.FC<SkiperMagneticButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className,
  icon,
  onClick,
  ...props
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const springConfig = { damping: 18, stiffness: 180, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.22);
    y.set(middleY * 0.22);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  // Luxury understated styling
  const variantStyles = {
    primary: "bg-[#f4f4f6] hover:bg-white text-[#09090c] font-semibold shadow-[0_2px_12px_rgba(255,255,255,0.08)] border border-white/20",
    secondary: "bg-[#141419]/90 hover:bg-[#1a1a21] text-zinc-300 hover:text-white border border-white/[0.09] hover:border-white/[0.18]",
    danger: "bg-[#251515] hover:bg-[#321c1c] text-[#e07563] border border-[#c86754]/30 hover:border-[#c86754]/50 font-medium",
    amber: "bg-[#211d13] hover:bg-[#2b2518] text-[#e5c268] border border-[#d4af37]/30 hover:border-[#d4af37]/50 font-medium",
  }[variant];

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
    md: "px-4 py-2 text-sm rounded-xl gap-2",
    lg: "px-5 py-2.5 text-sm rounded-xl gap-2.5",
  }[size];

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "relative inline-flex items-center justify-center font-medium transition-all duration-200 select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#d4af37]/50",
        variantStyles,
        sizeStyles,
        className
      )}
      {...(props as any)}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
};
