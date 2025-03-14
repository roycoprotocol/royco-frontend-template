"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const VaultAllocation = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={cn("rounded-xl bg-white shadow-sm", className)}
    >
      Market Allocation
    </div>
  );
});
