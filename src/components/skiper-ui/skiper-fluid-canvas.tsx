"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "@/lib/theme-context";

interface SkiperFluidCanvasProps {
  mode?: "normal" | "solar" | "ramp" | "battery";
  intensity?: number;
}

export const SkiperFluidCanvas: React.FC<SkiperFluidCanvasProps> = ({
  mode = "normal",
  intensity = 0.7,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      vx: 0,
      vy: 0,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const isDark = theme === "dark";

    // Clean modern color nodes
    const PARTICLE_COUNT = 18;
    const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const darkColors = [
        "rgba(37, 99, 235,",   // Blue
        "rgba(225, 29, 72,",   // Rose
        "rgba(217, 119, 6,",   // Amber
        "rgba(5, 150, 105,",   // Emerald
      ];
      const lightColors = [
        "rgba(59, 130, 246,",  // Soft Blue
        "rgba(244, 63, 94,",   // Soft Rose
        "rgba(245, 158, 11,",  // Soft Amber
        "rgba(16, 185, 129,",  // Soft Emerald
      ];
      const baseColor = (isDark ? darkColors : lightColors)[i % 4];

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        baseRadius: Math.random() * 110 + 70,
        radius: Math.random() * 110 + 70,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        baseColor,
        alpha: isDark ? Math.random() * 0.04 + 0.015 : Math.random() * 0.035 + 0.01,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        angle: Math.random() * Math.PI * 2,
      };
    });

    const render = () => {
      mouse.vx = (mouse.targetX - mouse.x) * 0.05;
      mouse.vy = (mouse.targetY - mouse.y) * 0.05;
      mouse.x += mouse.vx;
      mouse.y += mouse.vy;

      // Background clear
      ctx.fillStyle = isDark ? "#090d16" : "#f8fafc";
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p, idx) => {
        p.angle += p.pulseSpeed;
        p.radius = p.baseRadius + Math.sin(p.angle) * 18;

        let colorPrefix = p.baseColor;
        let modeAlphaMultiplier = 1.0;

        if (mode === "solar") {
          if (idx % 2 === 0) colorPrefix = "rgba(217, 119, 6,";
          modeAlphaMultiplier = 1.25;
        } else if (mode === "ramp") {
          if (idx % 2 === 0) colorPrefix = "rgba(225, 29, 72,";
          modeAlphaMultiplier = 1.35;
        } else if (mode === "battery") {
          if (idx % 2 === 0) colorPrefix = "rgba(5, 150, 105,";
          modeAlphaMultiplier = 1.2;
        }

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 350) {
          const force = (350 - dist) / 350;
          p.x += (dx / dist) * force * 0.5;
          p.y += (dy / dist) * force * 0.5;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -p.radius) p.x = width + p.radius;
        if (p.x > width + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = height + p.radius;
        if (p.y > height + p.radius) p.y = -p.radius;

        const effectiveAlpha = p.alpha * intensity * modeAlphaMultiplier;
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, `${colorPrefix}${effectiveAlpha})`);
        gradient.addColorStop(0.5, `${colorPrefix}${effectiveAlpha * 0.4})`);
        gradient.addColorStop(1, `${colorPrefix}0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode, intensity, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-70 transition-opacity duration-1000"
    />
  );
};
