"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";

import { MarketAllocationTable } from "./market-allocation-table";
import { marketAllocationColumns } from "./market-allocation-column";
import { vaultMetadataAtom } from "@/store/vault/vault-metadata";

export const MarketAllocation = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data } = useAtomValue(vaultMetadataAtom);

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "hide-scrollbar overflow-x-auto rounded-2xl border border-divider bg-white pt-3",
        className
      )}
    >
      <MarketAllocationTable
        data={data.allocations}
        columns={marketAllocationColumns}
      />
    </div>
  );
});
