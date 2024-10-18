"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "framer-motion";

export const SlideUpWrapper = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div"> & {
    delay?: number;
    initial?: any;
  }
>(({ className, delay, initial, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      className={cn("flex flex-col", className)}
      {...props}
      initial={{
        opacity: 0,
        y: 25,
        ...initial,
      }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        transition: {
          delay: 0,
          duration: 0,
        },
      }}
      transition={{
        duration: 0.4,
        ease: "easeInOut",
        type: "spring",
        delay: delay || 0,
        bounce: 0,
        damping: 25,
        stiffness: 300,
      }}
    />
  );
});
