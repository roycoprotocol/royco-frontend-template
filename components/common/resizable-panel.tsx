"use client";

import useMeasure from "react-use-measure";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

export type MotionProps = {
  key?: string;
  direction?: number;
  opacity?: boolean;
  consecutive?: boolean;
  blur?: string;
};

type TypedMotionProps = MotionProps & {
  width: number;
  duration: number;
};

const variants = {
  initial: (motionProps: TypedMotionProps) => {
    return {
      x: motionProps.direction ? motionProps.width * motionProps.direction : 0,
      opacity: motionProps.opacity === true ? 0 : 1,
      filter: motionProps.blur ? `blur(${motionProps.blur})` : "none",
      bounce: 0,
    };
  },
  animate: (motionProps: TypedMotionProps) => {
    return {
      x: 0,
      opacity: 1,
      transition: {
        duration: motionProps.consecutive
          ? motionProps.duration
          : motionProps.duration / 2,
        delay: motionProps.consecutive ? 0 : motionProps.duration / 2,
        bounce: 0,
      },
      filter: motionProps.blur ? `blur(0)` : "none",
    };
  },
  exit: (motionProps: TypedMotionProps) => {
    return {
      x: motionProps.direction
        ? -1 * motionProps.width * motionProps.direction
        : 0,

      opacity: motionProps.opacity === true ? 0 : 1,
      transition: {
        duration: motionProps.consecutive
          ? motionProps.duration
          : motionProps.duration / 2,
        bounce: 0,
      },
      filter: motionProps.blur ? `blur(${motionProps.blur})` : "none",
    };
  },
};

/**
 * @description A panel that resizes its height based on its content.
 * @see {@link https://www.youtube.com/watch?v=G3OyF-lRAWo}
 */
export const ResizablePanel = ({
  children,
  duration = 0.2,
  motionProps = {},
  className,
}: {
  children: React.ReactNode;
  duration?: number;
  motionProps?: MotionProps;
  className?: string;
}) => {
  let [ref, { width, height }] = useMeasure();
  const [prevHeight, setPrevHeight] = useState(0);
  const [renderNumber, setRenderNumber] = useState(0);

  useEffect(() => {
    if (renderNumber < 2 && prevHeight !== height) {
      setPrevHeight(height);
      setRenderNumber(renderNumber + 1);
    }
  }, [height]);

  return (
    <motion.div
      custom={{
        ...motionProps,
        duration,
        width,
      }}
      initial={false}
      animate={{ height: height || "auto" }}
      transition={{ duration, bounce: 0, ease: "easeOut" }}
      className={cn("relative overflow-hidden", className)}
    >
      <AnimatePresence
        initial={false}
        // mode="wait"
        custom={{
          ...motionProps,
          duration,
          width,
        }}
      >
        <motion.div
          key={
            // motionProps.key ||
            JSON.stringify(children, ignoreCircularReferences())
          }
          custom={{
            ...motionProps,
            duration,
            width,
          }}
          transition={{
            bounce: 0,
          }}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div
            ref={ref}
            className={cn(renderNumber > 1 ? "absolute" : "relative", "w-full")}
          >
            {children}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

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
