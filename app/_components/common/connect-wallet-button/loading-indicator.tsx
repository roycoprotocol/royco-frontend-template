"use client";

import { RoycoLogoIcon } from "@/assets/logo/royco-logo";
import { motion } from "framer-motion";
import React from "react";

interface LoadingIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export const LoadingIndicator = React.forwardRef<
  HTMLDivElement,
  LoadingIndicatorProps
>(({ children, ...props }, ref) => {
  return (
    <div ref={ref} {...props} className="flex flex-col items-center gap-1.5">
      <motion.div
        animate={{
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <RoycoLogoIcon className="h-5 fill-gray-500" />
      </motion.div>

      <div className="h-0.5 w-full overflow-hidden rounded-md bg-gray-200">
        <motion.div
          className="h-full w-full rounded-full text-gray-500"
          initial={{ x: "-100%" }}
          animate={{
            x: "100%",
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            scale: {
              duration: 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          style={{
            background:
              "linear-gradient(90deg, transparent, currentColor, transparent)",
          }}
        />
      </div>
    </div>
  );
});
