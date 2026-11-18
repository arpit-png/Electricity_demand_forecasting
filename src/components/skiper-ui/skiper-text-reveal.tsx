"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkiperTextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  highlightWords?: string[];
  highlightClass?: string;
}

export const SkiperTextReveal: React.FC<SkiperTextRevealProps> = ({
  text,
  className,
  delay = 0,
  highlightWords = [],
  highlightClass = "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-amber-300 to-rose-400",
}) => {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: delay * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 18,
        stiffness: 120,
      },
    },
    hidden: {
      opacity: 0,
      y: 16,
      transition: {
        type: "spring",
        damping: 18,
        stiffness: 120,
      },
    },
  };

  return (
    <motion.span
      variants={container}
      initial="hidden"
      animate="visible"
      className={cn("inline-flex flex-wrap gap-x-[0.28em] gap-y-1", className)}
    >
      {words.map((word, index) => {
        const clean = word.replace(/[^a-zA-Z0-9-]/g, "");
        const isHighlight = highlightWords.some(
          (hw) => hw.toLowerCase() === clean.toLowerCase()
        );

        return (
          <motion.span
            variants={child}
            key={index}
            className={cn(
              "inline-block font-inherit",
              isHighlight && highlightClass
            )}
          >
            {word}
          </motion.span>
        );
      })}
    </motion.span>
  );
};
