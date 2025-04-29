"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const LoadingCircle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: number;
    strokeWidth?: number;
    ringClassName?: string;
    dashClassName?: string;
  }
>(
  (
    {
      ringClassName,
      dashClassName,
      className,
      size = 24,
      strokeWidth = 4,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg
          className="animate-spin"
          style={{ animationDuration: "0.7s" }}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background circle */}
          <rect
            className={cn("stroke-[#cfceca]", ringClassName)}
            x={strokeWidth / 2}
            y={strokeWidth / 2}
            width={24 - strokeWidth}
            height={24 - strokeWidth}
            rx={(24 - strokeWidth) / 2}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Rotating dash */}
          <rect
            className={cn("stroke-[#21201c]", dashClassName)}
            x={strokeWidth / 2}
            y={strokeWidth / 2}
            width={24 - strokeWidth}
            height={24 - strokeWidth}
            rx={(24 - strokeWidth) / 2}
            strokeWidth={strokeWidth}
            strokeDasharray="15 100"
          />
        </svg>
      </div>
    );
  }
);
