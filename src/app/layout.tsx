import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Antigravity | Unified Motion & Security Stack",
  description: "Next.js App Router with Framer Motion, GSAP, and AES-256 Encrypted Backend"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-background text-foreground antialiased selection:bg-accent-cyan selection:text-black">
        {children}
      </body>
    </html>
  );
}
