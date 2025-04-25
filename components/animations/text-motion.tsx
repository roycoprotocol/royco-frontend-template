"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextMotionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: string;
  duration?: number;
  delay?: number;
  staggerDelay?: number;
  customKey?: string;
}

export const TextMotion = React.forwardRef<HTMLDivElement, TextMotionProps>(
  (
    {
      children,
      duration = 0.3,
      delay = 0,
      staggerDelay = 0.05,
      customKey,
      className,
      ...props
    },
    ref
  ) => {
    const key = customKey || children;

    return (
      <div
        ref={ref}
        className={cn("relative inline-block", className)}
        {...props}
      >
        <AnimatePresence mode="popLayout">
          {children.split("").map((char, index) => (
            <motion.span
              key={`${key}-${index}`}
              initial={{
                y: 10,
                opacity: 0,
                filter: "blur(4px)",
              }}
              animate={{
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
              }}
              exit={{
                y: -10,
                opacity: 0,
                filter: "blur(4px)",
              }}
              transition={{
                duration,
                delay: delay + index * staggerDelay,
                type: "spring",
                stiffness: 300,
                damping: 25,
                bounce: 0,
              }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    );
  }
);

TextMotion.displayName = "TextMotion";
