"use client";

import React from "react";
import { cn } from "@/lib/utils";

import { MarketAllocationTable } from "./market-allocation-table";
import { marketAllocationColumns } from "./market-allocation-column";

export const MarketAllocation = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={cn("overflow-hidden rounded-xl bg-white shadow-sm", className)}
    >
      <MarketAllocationTable data={[]} columns={marketAllocationColumns} />
    </div>
  );
});
