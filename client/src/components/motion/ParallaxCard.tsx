import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Lock, Sparkles, Terminal } from "lucide-react";

export const ParallaxCard: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Raw mouse coordinates normalized from -0.5 to 0.5
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // High-frequency spring physics with zero overshoot
  const mouseX = useSpring(x, { stiffness: 400, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 400, damping: 30 });

  // 3D rotation angles
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [18, -18]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-18, 18]);

  // Specular lighting reflection coordinates
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
    <div className="flex justify-center items-center py-24 px-4 [perspective:1400px]">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        className="relative w-full max-w-md h-[480px] rounded-3xl bg-zinc-950/80 border border-white/[0.12] p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl cursor-pointer overflow-hidden group select-none"
      >
        {/* Dynamic Specular Radial Glare */}
        <motion.div
          style={{
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) =>
                `radial-gradient(circle 260px at ${gx} ${gy}, rgba(255,255,255,0.15), transparent 70%)`
            )
          }}
          className="absolute inset-0 pointer-events-none rounded-3xl z-10"
        />

        {/* 3D Depth Layer 1: Header */}
        <div style={{ transform: "translateZ(45px)" }} className="flex justify-between items-start z-20">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Terminal className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-mono text-zinc-400 block tracking-wider">HARDWARE NODE</span>
              <span className="text-sm font-bold text-white tracking-wide">AG-QUANTUM-01</span>
            </div>
          </div>
          <Sparkles className="w-5 h-5 text-violet-400 animate-pulse" />
        </div>

        {/* 3D Depth Layer 2: Centerpiece */}
        <div
          style={{ transform: "translateZ(70px)" }}
          className="relative flex flex-col items-center justify-center my-auto z-20"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyan-400 via-violet-500 to-emerald-400 p-[1.5px] shadow-[0_0_60px_rgba(139,92,246,0.35)]">
            <div className="w-full h-full bg-zinc-950 rounded-3xl flex items-center justify-center">
              <Lock className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <span className="mt-6 text-[11px] font-mono uppercase tracking-widest text-zinc-400">
            Authenticated AES-GCM
          </span>
          <span className="text-xl font-black text-white mt-1">Zero-Trust Node</span>
        </div>

        {/* 3D Depth Layer 3: Telemetry Footer */}
        <div
          style={{ transform: "translateZ(35px)" }}
          className="flex justify-between items-center text-xs font-mono text-zinc-400 border-t border-white/[0.08] pt-4 z-20"
        >
          <span>KEY_LENGTH: 256-BIT</span>
          <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            INTEGRITY VERIFIED
          </span>
        </div>
      </motion.div>
    </div>
  );
};
