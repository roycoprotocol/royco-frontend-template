"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const fadeAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
};

const pathAnimation = {
  initial: { pathLength: 0, pathOffset: -1 },
  animate: { pathLength: 1, pathOffset: 0 },
  exit: { pathLength: 0, pathOffset: -1 },
  transition: { duration: 1, ease: "easeInOut" },
};

export const MarketNotFound = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} {...props} className={cn("", className)}>
      <AnimatePresence mode="sync">
        <motion.div
          {...fadeAnimation}
          className="flex h-80 flex-col place-content-center items-center gap-2 rounded-sm border border-_divider_ p-5"
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-badge-alert h-14 w-14 text-_secondary_"
            initial={{ opacity: 0, filter: "blur(5px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(5px)" }}
            transition={{ duration: 1 }}
          >
            <motion.path
              {...pathAnimation}
              d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
            />
            <motion.line {...pathAnimation} x1="12" x2="12" y1="8" y2="12" />
            <motion.line
              {...pathAnimation}
              x1="12"
              x2="12.01"
              y1="16"
              y2="16"
            />
          </motion.svg>

          <motion.div
            {...fadeAnimation}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="mt-2 text-center font-ortica text-2xl text-_secondary_"
          >
            No Markets Found.
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
});
