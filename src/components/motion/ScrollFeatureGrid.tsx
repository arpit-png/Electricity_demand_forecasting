"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield, KeyRound, Cpu, Layers } from "lucide-react";

export const ScrollFeatureGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".feature-card");

      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "bottom 60%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: <KeyRound className="w-6 h-6 text-accent-cyan" />,
      title: "AES-256-GCM Cryptographic Seal",
      desc: "All client payloads encrypted at the field level with authenticated data-at-rest protection. Nonce generation avoids replay vulnerabilities."
    },
    {
      icon: <Shield className="w-6 h-6 text-accent-violet" />,
      title: "Stateless JOSE / JWT Pipeline",
      desc: "Session tokens are cryptographically signed with HS256 and locked inside strict SameSite, Http-Only, and Secure cookie containers."
    },
    {
      icon: <Cpu className="w-6 h-6 text-accent-emerald" />,
      title: "Dynamic Rate-Limiting Engine",
      desc: "Built-in sliding-window algorithm throttling malicious credential-stuffing loops before request payloads touch the ORM boundary."
    },
    {
      icon: <Layers className="w-6 h-6 text-cyan-400" />,
      title: "Zero-Latency Unified Runtime",
      desc: "Integrated Next.js App Router eliminating microservice handshake overhead. Single command initialization with automated SQLite provisioning."
    }
  ];

  return (
    <section ref={containerRef} className="py-24 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          System Specifications
        </h2>
        <p className="text-zinc-400 mt-3 text-base">
          Scroll-orchestrated dynamic telemetry verified at runtime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feat, idx) => (
          <div
            key={idx}
            className="feature-card relative group p-8 rounded-2xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-md hover:border-white/[0.2] transition-colors duration-500 overflow-hidden"
          >
            <div className="absolute -inset-px bg-gradient-to-r from-accent-cyan/10 to-accent-violet/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="mb-4 inline-flex p-3 rounded-xl bg-white/[0.05] border border-white/[0.05]">
              {feat.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{feat.title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
