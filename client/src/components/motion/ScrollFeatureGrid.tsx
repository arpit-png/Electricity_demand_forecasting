import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck, Key, Lock, Cpu } from "lucide-react";

export const ScrollFeatureGrid: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".feature-card");

      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 80,
            scale: 0.92,
            filter: "blur(6px)"
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "bottom 65%",
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
      icon: <Lock className="w-6 h-6 text-cyan-400" />,
      title: "AES-256-GCM Field Sealing",
      desc: "Zero cleartext reaches PostgreSQL storage. Sensitive data payloads are authenticated with 96-bit random nonces and 128-bit authentication tags."
    },
    {
      icon: <Key className="w-6 h-6 text-violet-400" />,
      title: "Stateless HttpOnly Cookie Vault",
      desc: "JWT sessions dispatched strictly within SameSite=Strict and Secure HTTP-only cookies, preventing XSS-based session interception."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: "Multi-Tiered DDoS Throttling",
      desc: "Dual-tier express rate limiters defend the system boundary against credential stuffing, brute-force loops, and endpoint exhaustion."
    },
    {
      icon: <Cpu className="w-6 h-6 text-indigo-400" />,
      title: "PostgreSQL Pooling & Health",
      desc: "Industrial-grade node-pg connection pooling with automated schema migration, healthchecks, and graceful SIGTERM shutdown hooks."
    }
  ];

  return (
    <section ref={containerRef} className="py-28 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Cryptographic Telemetry
        </h2>
        <p className="text-zinc-400 mt-3 text-base sm:text-lg">
          Scroll-orchestrated dynamic specifications verified against production standards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feat, idx) => (
          <div
            key={idx}
            className="feature-card relative group p-8 rounded-3xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-xl hover:border-white/[0.2] transition-colors duration-500 overflow-hidden"
          >
            <div className="absolute -inset-px bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="mb-5 inline-flex p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
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
