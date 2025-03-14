"use client";

import React from "react";
import { cn } from "@/lib/utils";

import { VaultAllocationTable } from "./vault-allocation-table";
import { vaultAllocationColumns } from "./vault-allocation-column";

export const VaultAllocation = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={cn("overflow-hidden rounded-xl bg-white shadow-sm", className)}
    >
      <VaultAllocationTable data={[]} columns={vaultAllocationColumns} />
    </div>
  );
});
