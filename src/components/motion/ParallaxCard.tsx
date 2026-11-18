"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Lock, Sparkles, Terminal } from "lucide-react";

export const ParallaxCard = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 350, damping: 25 });
  const mouseY = useSpring(y, { stiffness: 350, damping: 25 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [16, -16]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-16, 16]);

  const glareX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mousePosX = e.clientX - rect.left;
    const mousePosY = e.clientY - rect.top;

    x.set(mousePosX / width - 0.5);
    y.set(mousePosY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="flex justify-center items-center py-20 px-4 [perspective:1200px]">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        className="relative w-full max-w-md h-[460px] rounded-3xl bg-zinc-900/70 border border-white/[0.12] p-8 flex flex-col justify-between shadow-2xl backdrop-blur-xl cursor-pointer overflow-hidden group select-none"
      >
        <motion.div
          style={{
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) =>
                `radial-gradient(circle 240px at ${gx} ${gy}, rgba(255,255,255,0.12), transparent)`
            )
          }}
          className="absolute inset-0 pointer-events-none rounded-3xl z-10"
        />

        <div style={{ transform: "translateZ(40px)" }} className="flex justify-between items-start z-20">
          <div className="flex items-center gap-2">
            <span className="p-2.5 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan">
              <Terminal className="w-5 h-5" />
            </span>
            <div>
              <span className="text-xs font-mono text-zinc-400 block">DEVICE SEC_ID</span>
              <span className="text-sm font-bold text-white tracking-wide">AG-908-PRO</span>
            </div>
          </div>
          <Sparkles className="w-5 h-5 text-accent-violet animate-pulse" />
        </div>

        <div
          style={{ transform: "translateZ(60px)" }}
          className="relative flex flex-col items-center justify-center my-auto z-20"
        >
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-accent-cyan via-accent-violet to-accent-emerald p-[1px] shadow-[0_0_50px_rgba(139,92,246,0.3)]">
            <div className="w-full h-full bg-zinc-950 rounded-2xl flex items-center justify-center">
              <Lock className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <span className="mt-5 text-xs font-mono uppercase tracking-widest text-zinc-400">
            Quantum Encrypted Storage
          </span>
          <span className="text-lg font-bold text-white mt-1">Tamper-Proof Node</span>
        </div>

        <div
          style={{ transform: "translateZ(30px)" }}
          className="flex justify-between items-center text-xs font-mono text-zinc-400 border-t border-white/[0.08] pt-4 z-20"
        >
          <span>STATUS: ARMED</span>
          <span className="text-accent-emerald flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-ping" />
            ENCRYPTION ACTIVE
          </span>
        </div>
      </motion.div>
    </div>
  );
};
