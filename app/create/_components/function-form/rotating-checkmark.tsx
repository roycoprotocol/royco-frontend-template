"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export const RotatingCheckmark = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    display: boolean;
  }
>(({ display, className, ...props }, ref) => {
  return (
    <AnimatePresence mode="popLayout">
      {display === true && (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-badge-check relative inset-0 h-5 w-5 stroke-success drop-shadow-sm"
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{
            opacity: 0,
            scale: 0,
            transition: {
              duration: 0.2,
            },
          }}
          transition={{
            duration: 0.2,
            type: "spring",
            damping: 25,
            stiffness: 300,
            bounce: 0,
          }}
        >
          <motion.path
            animate={{
              rotate: 360,
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              },
            }}
            className="fill-success"
            d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
          />
          <motion.path
            animate={{
              rotate: 0,
              transformOrigin: "center",
            }}
            className="absolute inset-0 stroke-white"
            d="m9 12 2 2 4-4"
          />
        </motion.svg>
      )}
    </AnimatePresence>
  );
});
