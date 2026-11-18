"use client";

import React, { useEffect, useRef } from "react";

interface SkiperFluidCanvasProps {
  mode?: "normal" | "solar" | "ramp" | "battery";
  intensity?: number;
}

export const SkiperFluidCanvas: React.FC<SkiperFluidCanvasProps> = ({
  mode = "normal",
  intensity = 0.8,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

    // Mouse velocity tracker
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

    // Google 4-Color Ambient Fluid Particles
    const PARTICLE_COUNT = 24;
    const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      // Rotate through Google colors: Blue, Red, Yellow, Green
      const googleColors = [
        "rgba(66, 133, 244,",  // Google Blue
        "rgba(234, 67, 53,",   // Google Red
        "rgba(251, 188, 4,",   // Google Yellow
        "rgba(52, 168, 83,",   // Google Green
      ];
      const baseColor = googleColors[i % 4];

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        baseRadius: Math.random() * 120 + 80,
        radius: Math.random() * 120 + 80,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        baseColor,
        alpha: Math.random() * 0.045 + 0.015,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        angle: Math.random() * Math.PI * 2,
      };
    });

    let time = 0;

    const render = () => {
      time += 0.01;

      // Smooth mouse interpolation
      mouse.vx = (mouse.targetX - mouse.x) * 0.05;
      mouse.vy = (mouse.targetY - mouse.y) * 0.05;
      mouse.x += mouse.vx;
      mouse.y += mouse.vy;

      // Google Dark Canvas Clear
      ctx.fillStyle = "#131314";
      ctx.fillRect(0, 0, width, height);

      // Render each soft fluid light node
      particles.forEach((p, idx) => {
        p.angle += p.pulseSpeed;
        p.radius = p.baseRadius + Math.sin(p.angle) * 20;

        // Influence by mode
        let colorPrefix = p.baseColor;
        let modeAlphaMultiplier = 1.0;

        if (mode === "solar") {
          // Solar noon: enhance Google Yellow / Amber
          if (idx % 2 === 0) colorPrefix = "rgba(251, 188, 4,";
          modeAlphaMultiplier = 1.3;
        } else if (mode === "ramp") {
          // Critical evening duck ramp: enhance Google Red
          if (idx % 2 === 0) colorPrefix = "rgba(234, 67, 53,";
          modeAlphaMultiplier = 1.4;
        } else if (mode === "battery") {
          // Battery storage dispatch: enhance Google Green
          if (idx % 2 === 0) colorPrefix = "rgba(52, 168, 83,";
          modeAlphaMultiplier = 1.2;
        }

        // Slight drift towards mouse
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 400) {
          const force = (400 - dist) / 400;
          p.x += (dx / dist) * force * 0.6;
          p.y += (dy / dist) * force * 0.6;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around bounds smoothly
        if (p.x < -p.radius) p.x = width + p.radius;
        if (p.x > width + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = height + p.radius;
        if (p.y > height + p.radius) p.y = -p.radius;

        // Draw radial chromatic light
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
  }, [mode, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-80 transition-opacity duration-1000"
    />
  );
};
