import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface MotionProviderProps {
  children: React.ReactNode;
  routeKey?: string;
}

export const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
    filter: "blur(6px)"
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier spring curve
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    filter: "blur(6px)",
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const MotionProvider: React.FC<MotionProviderProps> = ({ children, routeKey = "default" }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey}
        variants={pageTransitionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full relative min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
