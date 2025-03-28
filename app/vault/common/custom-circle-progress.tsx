import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CustomCircleProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  maxValue?: number;
  size?: number;
  stroke?: number;
  direction?: "clockwise" | "counterclockwise";
  color?: string;
  track?: string;
  animate?: boolean;
}

export const CustomCircleProgress = React.forwardRef<
  HTMLDivElement,
  CustomCircleProgressProps
>(
  (
    {
      value,
      maxValue = 100,
      size = 24,
      stroke = 2,
      direction = "clockwise",
      color = "#2a2a27",
      track = "#f3f4f6",
      animate = true,
      className,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, (value / maxValue) * 100);

    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        style={{ width: size, height: size }}
        {...props}
      >
        {/* Background circle */}
        <svg
          className="absolute"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle
            style={{ stroke: track }}
            className={track}
            fill="none"
            strokeWidth={stroke - 0.5}
            cx={size / 2}
            cy={size / 2}
            r={radius}
          />
        </svg>

        {/* Progress circle */}
        <motion.svg
          className={cn(
            "absolute transform",
            direction === "clockwise" ? "-rotate-90" : "rotate-90 scale-x-[-1]"
          )}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          <motion.circle
            fill="none"
            strokeWidth={stroke}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            style={{ strokeDasharray: circumference, stroke: color }}
            transition={
              animate ? { duration: 0.5, ease: "easeOut" } : undefined
            }
          />
        </motion.svg>
      </div>
    );
  }
);

CustomCircleProgress.displayName = "CustomCircleProgress";
