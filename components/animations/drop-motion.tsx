"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * @description Replacer function to JSON.stringify that ignores
 * circular references and internal React properties.
 * @see {@link https://github.com/facebook/react/issues/8669#issuecomment-531515508}
 */
const ignoreCircularReferences = () => {
  const seen = new WeakSet();
  return (key: any, value: any) => {
    if (key.startsWith("_")) return; // Don't compare React's internal props.
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return;
      seen.add(value);
    }
    return value;
  };
};

export const DropMotion = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    duration?: number;
    delay?: number;
    customKey?: string;
  }
>(
  (
    { children, duration = 0.3, delay = 0, customKey, className, ...props },
    ref
  ) => {
    const contentRef = useRef<HTMLDivElement>(null);

    const key = customKey
      ? customKey
      : JSON.stringify(children, ignoreCircularReferences());

    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={key}
            initial={{
              y: 20,
              opacity: 0,
              filter: "blur(4px)",
            }}
            animate={{
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
            }}
            exit={{
              y: -20,
              opacity: 0,
              filter: "blur(4px)",
            }}
            transition={{
              duration,
              delay,
              type: "spring",
              stiffness: 300,
              damping: 25,
              bounce: 0,
            }}
            ref={contentRef}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }
);

DropMotion.displayName = "DropMotion";
