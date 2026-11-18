import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, scale: 0.8, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.85 }
      )
        .fromTo(
          ".hero-char",
          { opacity: 0, y: 70, rotateX: -75, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: "blur(0px)",
            duration: 1.1,
            stagger: 0.025
          },
          "-=0.4"
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.6"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const splitTextToSpans = (text: string) => {
    return text.split("").map((char, index) => (
      <span
        key={index}
        className="hero-char inline-block will-change-transform"
        style={{ whiteSpace: char === " " ? "pre" : "normal" }}
      >
        {char}
      </span>
    ));
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden pt-24"
    >
      {/* Ambient background volumetric glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-cyan-500/15 via-violet-600/20 to-emerald-500/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Security Status Pill */}
      <div
        ref={badgeRef}
        className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl mb-8 text-xs font-mono text-zinc-300"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <Lock className="w-3.5 h-3.5 text-cyan-400" />
        <span>AES-256-GCM / POSTGRES POOL / HTTP-ONLY CREDENTIALS</span>
      </div>

      {/* GSAP Split Text Headline */}
      <h1
        ref={headlineRef}
        className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white mb-6 [perspective:1200px]"
      >
        <span className="block text-zinc-100">{splitTextToSpans("AESTHETIC MOTION")}</span>
        <span className="bg-gradient-to-r from-cyan-400 via-violet-500 to-emerald-400 bg-clip-text text-transparent block">
          {splitTextToSpans("QUANTUM SECURITY")}
        </span>
      </h1>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        className="max-w-2xl text-lg sm:text-xl text-zinc-400 font-light leading-relaxed mb-10"
      >
        Engineered with Awwwards-caliber interaction physics and zero-leak cryptographic defense.
        PostgreSQL connection pooling, Argon2 key derivation, and field-level authenticated seals.
      </p>

      {/* Magnetic Spring CTA Button */}
      <motion.a
        href="#vault-terminal"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-zinc-950 font-semibold text-sm shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:shadow-[0_0_40px_rgba(6,182,212,0.45)] transition-shadow duration-300 overflow-hidden"
      >
        <span className="relative z-10">Access Encrypted Terminal</span>
        <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-violet-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.a>
    </section>
  );
};
