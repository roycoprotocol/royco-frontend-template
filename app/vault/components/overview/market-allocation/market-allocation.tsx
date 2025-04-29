"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";

import { MarketAllocationTable } from "./market-allocation-table";
import { marketAllocationColumns } from "./market-allocation-column";
import { vaultMetadataAtom } from "@/store/vault/vault-manager";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { ChevronRight, ChevronsUpDown } from "lucide-react";

export const MarketAllocation = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data } = useAtomValue(vaultMetadataAtom);

  return (
    <div
      ref={ref}
      {...props}
      className={cn("hide-scrollbar overflow-x-auto", className)}
    >
      <PrimaryLabel className="text-2xl font-medium text-_primary_">
        Allocation
      </PrimaryLabel>

      <SecondaryLabel className="mt-1 flex items-center gap-2 text-sm font-normal text-_secondary_">
        <span>Curated By</span>

        {data.managers &&
          data.managers.length > 0 &&
          data.managers.map((manager) => {
            return (
              <a
                rel="noopener noreferrer"
                target="_blank"
                href={manager.link}
                key={manager.id}
                className="group"
              >
                <PrimaryLabel className="text-sm font-medium text-_primary_">
                  <div className="flex items-center gap-1">
                    <img
                      src={manager.image}
                      alt={manager.name}
                      className="h-4 w-4 rounded-full"
                    />
                    <span className="underline-offset-2 group-hover:underline">
                      {manager.name}
                    </span>

                    <ChevronRight className="h-4 w-4 transition-transform duration-200 ease-in-out group-hover:translate-x-px" />
                  </div>
                </PrimaryLabel>
              </a>
            );
          })}
      </SecondaryLabel>

      <div className="mt-6">
        <MarketAllocationTable
          data={data.allocations}
          columns={marketAllocationColumns}
        />
      </div>

      <SecondaryLabel className="mt-6 cursor-pointer text-sm font-medium text-_secondary_">
        <div className="flex items-center gap-2">
          <span>Show Whitelisted Markets</span>
          <ChevronsUpDown className="h-4 w-4" />
        </div>
      </SecondaryLabel>
    </div>
  );
});
