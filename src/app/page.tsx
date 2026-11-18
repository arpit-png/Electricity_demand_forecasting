import { PageTransitionWrapper } from "@/components/motion/PageTransitionWrapper";
import { HeroSection } from "@/components/motion/HeroSection";
import { ScrollFeatureGrid } from "@/components/motion/ScrollFeatureGrid";
import { ParallaxCard } from "@/components/motion/ParallaxCard";
import { QuantumVaultDashboard } from "@/components/vault/QuantumVaultDashboard";

export default function Home() {
  return (
    <PageTransitionWrapper>
      <main className="min-h-screen relative flex flex-col">
        <HeroSection />
        <ScrollFeatureGrid />
        <ParallaxCard />
        <QuantumVaultDashboard />
        
        <footer className="py-12 border-t border-white/[0.06] text-center text-xs font-mono text-zinc-500">
          ANTIGRAVITY ARCHITECTURE // HIGH FIDELITY MOTION // AES-256 AT-REST ZERO-LEAK RUNTIME
        </footer>
      </main>
    </PageTransitionWrapper>
  );
}
