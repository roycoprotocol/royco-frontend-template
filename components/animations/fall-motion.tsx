"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import useMeasure from "react-use-measure";

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

export const FallMotion = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    height: string;
    duration?: number;
    className?: string;
    customKey?: string;
    delay?: number;
    containerClassName?: string;
    motionClassName?: string;
    contentClassName?: string;
    noContentWidth?: boolean;
    key?: string;
  }
>(
  (
    {
      height,
      duration,
      className,
      customKey,
      delay,
      containerClassName,
      motionClassName,
      contentClassName,
      noContentWidth,
      key,
      ...props
    },
    ref
  ) => {
    // export const FallMotion = ({
    //   height,
    //   duration,
    //   children,
    //   className,
    //   customKey,
    //   delay,
    //   containerClassName,
    //   motionClassName,
    //   contentClassName,
    //   noContentWidth,
    //   key,
    // }: {
    //   height: string;
    //   children: React.ReactNode;
    //   duration?: number;
    //   className?: string;
    //   containerClassName?: string;
    //   motionClassName?: string;
    //   contentClassName?: string;
    //   noContentWidth?: boolean;
    //   customKey?: string;
    //   delay?: number;
    //   key?: string;
    // }) => {
    const [contentWidth, setContentWidth] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);

    const [measureRef, { width }] = useMeasure();

    useEffect(() => {
      if (contentRef.current) {
        setContentWidth(contentRef.current.offsetWidth);
      }
    }, [props.children]);

    return (
      <div
        ref={ref}
        key={key}
        style={{
          height,
        }}
        className={cn(
          "hide-scrollbar relative w-auto flex-none overflow-hidden will-change-auto",
          containerClassName,
          className
        )}
        {...props}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={
              customKey
                ? customKey
                : JSON.stringify(props.children, ignoreCircularReferences())
            }
            initial={{
              y: `-${height}`,
            }}
            animate={{
              y: 0,
            }}
            exit={{
              y: `${height}`,
            }}
            transition={{
              ease: "easeOut",
              type: "spring",
              damping: 25,
              stiffness: 300,
              bounce: 0,
              duration: duration || 0.25,
              delay: delay || 0,
            }}
            className={cn("absolute inset-0", motionClassName)}
          >
            <div
              ref={measureRef}
              className={cn(
                "inline-block h-full w-full place-content-center",
                contentClassName
              )}
            >
              {props.children}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }
);
