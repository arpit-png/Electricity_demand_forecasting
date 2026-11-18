"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export const PageTransitionWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -18 }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="w-full relative"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
