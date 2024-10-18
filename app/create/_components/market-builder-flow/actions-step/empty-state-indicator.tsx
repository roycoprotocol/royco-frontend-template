"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { AlertIndicator } from "@/components/common";

export const NoActionsIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    stateLength: number;
  }
>(({ className, stateLength, ...props }, ref) => {
  return (
    <div ref={ref} className="contents">
      <AnimatePresence mode="popLayout">
        {stateLength === 0 && (
          <AlertIndicator className="h-full">No actions added</AlertIndicator>
        )}
      </AnimatePresence>
    </div>
  );
});

export const NoInputsIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    stateLength: number;
  }
>(({ className, stateLength, ...props }, ref) => {
  return (
    <div ref={ref} className="contents">
      <AnimatePresence mode="popLayout">
        {stateLength === 0 && (
          <AlertIndicator type="success" className="h-24 bg-z2 py-0">
            No inputs required
          </AlertIndicator>
        )}
      </AnimatePresence>
    </div>
  );
});

export const NoOutputsIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    stateLength: number;
  }
>(({ className, stateLength, ...props }, ref) => {
  return (
    <div ref={ref} className="contents">
      <AnimatePresence mode="popLayout">
        {(stateLength === 0 || stateLength > 1) && (
          <AlertIndicator className="h-20 bg-z2 py-0">
            {stateLength === 0
              ? "No outputs available"
              : "Multiple outputs not supported"}
          </AlertIndicator>
        )}
      </AnimatePresence>
    </div>
  );
});
