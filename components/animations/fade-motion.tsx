"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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

export const FadeMotion = ({
  duration,
  children,
  className,
  customKey,
  delay,
  containerClassName,
  motionClassName,
  contentClassName,
  noContentWidth,
  blur = "0.5rem",
  scale = 1,
}: {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
  motionClassName?: string;
  contentClassName?: string;
  noContentWidth?: boolean;
  customKey?: string;
  delay?: number;
  blur?: string;
  scale?: number;
}) => {
  const [contentWidth, setContentWidth] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentWidth(contentRef.current.offsetWidth);
    }
  }, [children]);

  return (
    <div
      className={cn(
        "hide-scrollbar w-auto flex-none overflow-hidden will-change-auto",
        containerClassName
      )}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={
            customKey
              ? customKey
              : JSON.stringify(children, ignoreCircularReferences())
          }
          initial={{
            // y: `-${height}`,
            opacity: 0,
            // @todo fix
            filter: `blur(${blur})`,
            scale: scale,
          }}
          animate={{
            opacity: 1,
            filter: "blur(0rem)",
            scale: 1,
          }}
          exit={{
            opacity: 0,
            filter: `blur(${blur})`,
            // y: `${height}`,
            scale: scale,
          }}
          transition={{
            ease: "easeInOut",
            bounce: 0,
            duration: duration || 0.2,
            delay: delay || 0,
          }}
          className={cn("", motionClassName)}
        >
          <div
            // ref={ref}
            className={cn(
              "h-full w-full place-content-center",
              contentClassName
            )}
          >
            {children}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
