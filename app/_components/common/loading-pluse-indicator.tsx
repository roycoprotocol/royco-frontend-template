"use client";

import { RoycoLogoIcon } from "@/assets/logo/royco-logo";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

interface LoadingPluseIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  isLoading: boolean;
}

export const LoadingPluseIndicator = React.forwardRef<
  HTMLDivElement,
  LoadingPluseIndicatorProps
>(({ children, className, isLoading, ...props }, ref) => {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <div
          ref={ref}
          className={cn("animate-pulse rounded bg-gray-200", className)}
          {...props}
        />
      ) : (
        <>{children}</>
      )}
    </AnimatePresence>
  );
});
