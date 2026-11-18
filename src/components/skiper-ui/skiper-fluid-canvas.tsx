"use client";

import React, { useEffect, useRef } from "react";

interface SkiperFluidCanvasProps {
  mode?: "normal" | "ramp" | "solar" | "battery";
  intensity?: number;
}

export const SkiperFluidCanvas: React.FC<SkiperFluidCanvasProps> = ({
  mode = "normal",
  intensity = 0.8,
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

    // Quiet luxury palette: brushed champagne, smoked steel slate, muted copper terracotta, celadon sage
    const palette = {
      normal: {
        glow1: "rgba(120, 140, 160, 0.045)", // Smoked Steel Slate
        glow2: "rgba(212, 175, 55, 0.035)",  // Brushed Champagne Gold
        accent: "rgba(90, 154, 124, 0.025)", // Celadon Sage
      },
      ramp: {
        glow1: "rgba(200, 103, 84, 0.06)",   // Smoked Terracotta / Muted Copper
        glow2: "rgba(212, 175, 55, 0.04)",   // Champagne Gold
        accent: "rgba(160, 70, 60, 0.03)",
      },
      solar: {
        glow1: "rgba(212, 175, 55, 0.06)",   // Brushed Champagne Gold
        glow2: "rgba(230, 204, 160, 0.035)", // Pale Warm Ochre
        accent: "rgba(120, 140, 160, 0.025)",
      },
      battery: {
        glow1: "rgba(90, 154, 124, 0.05)",   // Celadon Sage
        glow2: "rgba(120, 140, 160, 0.04)",  // Smoked Slate
        accent: "rgba(100, 160, 135, 0.025)",
      },
    }[mode];

    let t = 0;
    const render = () => {
      t += 0.005 * intensity;

      // Smooth mouse damping
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      ctx.clearRect(0, 0, width, height);

      // Primary fluid orb
      const orb1X = width * 0.4 + Math.sin(t * 0.6) * 140 + (mouse.x - width * 0.5) * 0.1;
      const orb1Y = height * 0.35 + Math.cos(t * 0.5) * 90 + (mouse.y - height * 0.5) * 0.1;
      const grad1 = ctx.createRadialGradient(orb1X, orb1Y, 50, orb1X, orb1Y, width * 0.55);
      grad1.addColorStop(0, palette.glow1);
      grad1.addColorStop(0.5, palette.accent);
      grad1.addColorStop(1, "transparent");

      ctx.fillStyle = grad1;
      ctx.beginPath();
      ctx.arc(orb1X, orb1Y, width * 0.55, 0, Math.PI * 2);
      ctx.fill();

      // Secondary fluid orb
      const orb2X = width * 0.65 + Math.cos(t * 0.55) * 120 - (mouse.x - width * 0.5) * 0.08;
      const orb2Y = height * 0.6 + Math.sin(t * 0.7) * 100 - (mouse.y - height * 0.5) * 0.08;
      const grad2 = ctx.createRadialGradient(orb2X, orb2Y, 40, orb2X, orb2Y, width * 0.5);
      grad2.addColorStop(0, palette.glow2);
      grad2.addColorStop(0.6, palette.glow1);
      grad2.addColorStop(1, "transparent");

      ctx.fillStyle = grad2;
      ctx.beginPath();
      ctx.arc(orb2X, orb2Y, width * 0.5, 0, Math.PI * 2);
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
      className="pointer-events-none fixed inset-0 z-0 opacity-80 transition-opacity duration-1000"
    />
  );
};
