"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";

export const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8 }
      )
        .fromTo(
          ".hero-char",
          { opacity: 0, y: 50, rotateX: -60 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1,
            stagger: 0.02
          },
          "-=0.4"
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.6"
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const renderSplitText = (text: string) => {
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
      ref={heroRef}
      className="relative min-h-[85vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden pt-20"
    >
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-accent-cyan/15 via-accent-violet/20 to-transparent blur-[120px] pointer-events-none rounded-full" />

      <div
        ref={badgeRef}
        className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-8 text-xs font-mono text-zinc-300"
      >
        <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
        <Lock className="w-3.5 h-3.5 text-accent-cyan" />
        <span>AES-256-GCM / JOSE SECURED / HTTP-ONLY RUNTIME</span>
      </div>

      <h1
        ref={headlineRef}
        className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white mb-6 [perspective:1000px]"
      >
        <span className="block text-zinc-100">{renderSplitText("ANTIGRAVITY")}</span>
        <span className="bg-gradient-to-r from-accent-cyan via-accent-violet to-accent-emerald bg-clip-text text-transparent block">
          {renderSplitText("QUANTUM SECURE")}
        </span>
      </h1>

      <p
        ref={subtitleRef}
        className="max-w-2xl text-lg sm:text-xl text-zinc-400 font-light leading-relaxed mb-10"
      >
        A unified full-stack architecture combining high-fidelity interactive physics with
        aerospace-grade cryptographic defense. Instant single-trigger execution.
      </p>

      <motion.a
        href="#vault-demo"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-zinc-950 font-semibold text-sm shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-shadow duration-300 overflow-hidden"
      >
        <span className="relative z-10">Access Vault Terminal</span>
        <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
        <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/20 to-accent-violet/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.a>
    </section>
  );
};
