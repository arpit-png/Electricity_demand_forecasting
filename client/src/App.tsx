import React from "react";
import { MotionProvider } from "./components/motion/MotionProvider";
import { HeroSection } from "./components/motion/HeroSection";
import { ScrollFeatureGrid } from "./components/motion/ScrollFeatureGrid";
import { ParallaxCard } from "./components/motion/ParallaxCard";
import { VaultTerminal } from "./components/VaultTerminal";

export const App: React.FC = () => {
  return (
    <MotionProvider>
      <main className="min-h-screen bg-[#09090b] text-[#f4f4f5] antialiased selection:bg-cyan-400 selection:text-black flex flex-col">
        <HeroSection />
        <ScrollFeatureGrid />
        <ParallaxCard />
        <VaultTerminal />

        <footer className="py-14 border-t border-white/[0.06] text-center text-xs font-mono text-zinc-500">
          ANTIGRAVITY // INDUSTRIAL DEFENSE & MOTION SYSTEM // 256-BIT CRYPTOGRAPHIC PIPELINE
        </footer>
      </main>
    </MotionProvider>
  );
};
