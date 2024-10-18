"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "framer-motion";

export const BuilderSectionWrapperProps = {
  initial: {
    opacity: 0,
  },
  animate: { opacity: 1, y: 0 },
  exit: {
    opacity: 0,
    transition: {
      delay: 0,
      duration: 0,
    },
  },
  transition: {
    duration: 0.4,
    ease: "easeInOut",
    type: "spring",
    damping: 25,
    stiffness: 300,
    bounce: 0,
  },
};

export const BuilderSectionWrapper = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div"> & {
    delay?: number;
  }
>(({ className, delay, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      className={cn("flex flex-col", className)}
      {...props}
      // {...BuilderSectionWrapperProps}
      initial={{
        opacity: 0,
        y: 100,
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
