"use client";

import React, { useEffect, useRef } from "react";

interface SkiperFluidCanvasProps {
  mode?: "normal" | "ramp" | "solar" | "battery";
  intensity?: number;
}

export const SkiperFluidCanvas: React.FC<SkiperFluidCanvasProps> = ({
  mode = "normal",
  intensity = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Mouse tracking for fluid ripples
    let mouse = { x: width * 0.5, y: height * 0.4, targetX: width * 0.5, targetY: height * 0.4 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Color pallets by grid status
    const palette = {
      normal: {
        glow1: "rgba(59, 130, 246, 0.08)", // Electric Tungsten Blue
        glow2: "rgba(245, 158, 11, 0.05)", // Warm Amber
        accent: "rgba(16, 185, 129, 0.04)",
      },
      ramp: {
        glow1: "rgba(244, 63, 94, 0.12)",  // Magma Crimson
        glow2: "rgba(245, 158, 11, 0.09)", // Warning Amber
        accent: "rgba(225, 29, 72, 0.06)",
      },
      solar: {
        glow1: "rgba(245, 158, 11, 0.12)", // Sodium Solar Gold
        glow2: "rgba(251, 191, 36, 0.08)",
        accent: "rgba(59, 130, 246, 0.04)",
      },
      battery: {
        glow1: "rgba(16, 185, 129, 0.10)", // Hyper-Kinetic Mint/Emerald
        glow2: "rgba(6, 182, 212, 0.08)",
        accent: "rgba(52, 211, 153, 0.05)",
      },
    }[mode];

    let t = 0;
    const render = () => {
      t += 0.008 * intensity;

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Primary fluid orb 1
      const orb1X = width * 0.35 + Math.sin(t * 0.7) * 180 + (mouse.x - width * 0.5) * 0.15;
      const orb1Y = height * 0.3 + Math.cos(t * 0.5) * 120 + (mouse.y - height * 0.5) * 0.15;
      const grad1 = ctx.createRadialGradient(orb1X, orb1Y, 40, orb1X, orb1Y, width * 0.55);
      grad1.addColorStop(0, palette.glow1);
      grad1.addColorStop(0.5, palette.accent);
      grad1.addColorStop(1, "transparent");

      ctx.fillStyle = grad1;
      ctx.beginPath();
      ctx.arc(orb1X, orb1Y, width * 0.55, 0, Math.PI * 2);
      ctx.fill();

      // Secondary fluid orb 2
      const orb2X = width * 0.7 + Math.cos(t * 0.6) * 160 - (mouse.x - width * 0.5) * 0.12;
      const orb2Y = height * 0.65 + Math.sin(t * 0.8) * 140 - (mouse.y - height * 0.5) * 0.12;
      const grad2 = ctx.createRadialGradient(orb2X, orb2Y, 30, orb2X, orb2Y, width * 0.5);
      grad2.addColorStop(0, palette.glow2);
      grad2.addColorStop(0.6, palette.glow1);
      grad2.addColorStop(1, "transparent");

      ctx.fillStyle = grad2;
      ctx.beginPath();
      ctx.arc(orb2X, orb2Y, width * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Interactive cursor ripple
      const cursorGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 280);
      cursorGrad.addColorStop(0, palette.glow1);
      cursorGrad.addColorStop(1, "transparent");
      ctx.fillStyle = cursorGrad;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 280, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-70 transition-opacity duration-1000"
    />
  );
};
