"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const RoyaltyFormWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "absolute left-0 top-0 z-20 flex h-full w-full flex-col items-center bg-black bg-opacity-50 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <div className="sticky left-0 top-24 z-30 flex h-96 w-96 flex-col items-center bg-red-500 p-5 backdrop-blur-sm"></div>
    </div>
  );
});

RoyaltyFormWrapper.displayName = "RoyaltyFormWrapper";
