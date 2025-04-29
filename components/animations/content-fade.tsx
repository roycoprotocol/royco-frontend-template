"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, MotionProps } from "motion/react";

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

type AnimationProps = {
  y?: number;
  opacity?: number;
  filter?: string;
  [key: string]: any;
};

export const ContentFade = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    customKey?: string;
    motionProps?: MotionProps;
  }
>(({ children, customKey, className, motionProps, ...props }, ref) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const key = customKey
    ? customKey
    : JSON.stringify(children, ignoreCircularReferences());

  const defaultMotionProps: MotionProps = {
    initial: {
      opacity: 0,
      scale: 0.3,
    },
    animate: {
      opacity: 1,
      scale: 1,
    },
    exit: {
      opacity: 0,
      scale: 0.3,
    },
    transition: {
      duration: 1,
      type: "spring",
      stiffness: 300,
      damping: 25,
      bounce: 0.25,
    },
  };

  const mergedMotionProps = {
    ...defaultMotionProps,
    ...motionProps,
    initial: {
      ...(defaultMotionProps.initial as AnimationProps),
      ...((motionProps?.initial as AnimationProps) || {}),
    },
    animate: {
      ...(defaultMotionProps.animate as AnimationProps),
      ...((motionProps?.animate as AnimationProps) || {}),
    },
    exit: {
      ...(defaultMotionProps.exit as AnimationProps),
      ...((motionProps?.exit as AnimationProps) || {}),
    },
    transition: {
      ...defaultMotionProps.transition,
      ...((motionProps?.transition as MotionProps["transition"]) || {}),
    },
  };

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <AnimatePresence mode="popLayout">
        <motion.div key={key} {...mergedMotionProps} ref={contentRef}>
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

ContentFade.displayName = "ContentFade";
