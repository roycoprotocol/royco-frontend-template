"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";

import { MarketAllocationTable } from "./market-allocation-table";
import { marketAllocationColumns } from "./market-allocation-column";
import { vaultMetadataAtom } from "@/store/vault/vault-manager";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { ChevronRight, ChevronsRight, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const MarketAllocation = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data } = useAtomValue(vaultMetadataAtom);

  const tableRef = useRef<HTMLDivElement>(null);
  const [tableOverflow, setTableOverflow] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (tableRef.current) {
        const { scrollWidth, clientWidth } = tableRef.current;
        setTableOverflow(scrollWidth > clientWidth);
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, []);

  const onScrollRight = () => {
    if (tableRef.current) {
      tableRef.current.scrollTo({
        left: tableRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  };

  const [showWhitelistedMarkets, setShowWhitelistedMarkets] = useState(false);

  const allocatedMarkets = useMemo(() => {
    return data.allocations.filter((item) => item.type !== "whitelisted");
  }, [showWhitelistedMarkets]);

  const whitelistedMarkets = useMemo(() => {
    return data.allocations.filter((item) => item.type === "whitelisted");
  }, [data.allocations]);

  const allocations = useMemo(() => {
    if (showWhitelistedMarkets) {
      return [...allocatedMarkets, ...whitelistedMarkets];
    }

    return allocatedMarkets;
  }, [showWhitelistedMarkets, allocatedMarkets, whitelistedMarkets]);

  return (
    <div ref={ref} {...props} className={cn("", className)}>
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

      <div className="relative mt-6">
        <div ref={tableRef} className="hide-scrollbar overflow-x-auto">
          <MarketAllocationTable
            data={allocations}
            columns={marketAllocationColumns}
          />
        </div>

        {tableOverflow && (
          <motion.div
            className="absolute -right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-_surface_tertiary p-2"
            animate={{
              x: [0, 5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            onClick={onScrollRight}
          >
            <ChevronsRight className="h-4 w-4" />
          </motion.div>
        )}
      </div>

      <Button
        variant="link"
        className={cn(
          "mt-6 cursor-pointer text-sm font-medium text-_secondary_ outline-none disabled:opacity-50",
          whitelistedMarkets.length === 0 && "opacity-50 hover:no-underline"
        )}
        disabled={whitelistedMarkets.length === 0}
        onClick={() => setShowWhitelistedMarkets(!showWhitelistedMarkets)}
      >
        <div className="flex items-center gap-2">
          <span>Show Whitelisted Markets</span>

          <ChevronsUpDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              showWhitelistedMarkets ? "rotate-180" : "rotate-0"
            )}
          />
        </div>
      </Button>
    </div>
  );
});
