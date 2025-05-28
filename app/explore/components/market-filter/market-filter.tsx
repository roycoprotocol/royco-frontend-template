"use client";

import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { ChainFilter } from "./filters/chain-filter";
import { SearchIcon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  loadableExploreMarketAtom,
  marketFiltersVerifiedAtom,
  marketSearchAtom,
} from "@/store/explore/explore-market";
import { useAtom, useAtomValue } from "jotai";
import { motion, AnimatePresence } from "framer-motion";
import { InputAssetFilter } from "./filters/input-asset-filter";
import { tagAtom } from "@/store/protector/protector";
import { PoolTypeFilter } from "./filters/pool-type-filter";
import { AppTypeFilter } from "./filters/app-type-filter";
import { HideColumnsSelector } from "./hide-columns-selector";
import { IncentiveAssetFilter } from "./filters/incentive-asset-filter";
import { Switch } from "@/components/ui/switch";
import { usePathname } from "next/navigation";

export const MarketFilter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const pathname = usePathname();
  const filterVerifiedMarketOption = useMemo(
    () => (pathname === "/explore/all" ? true : false),
    [pathname]
  );

  const [marketFiltersVerified, setMarketFiltersVerified] = useAtom(
    marketFiltersVerifiedAtom
  );

  const tag = useAtomValue(tagAtom);
  const { data: propsData } = useAtomValue(loadableExploreMarketAtom);
  const [marketSearch, setMarketSearch] = useAtom(marketSearchAtom);

  const [openSearch, setOpenSearch] = useState(false);

  return (
    <div ref={ref} {...props} className={cn("", className)}>
      <div className="flex flex-col items-start justify-between gap-2 lg:flex-row lg:items-end">
        <div>
          <PrimaryLabel className="text-2xl font-medium text-_primary_">
            Markets
          </PrimaryLabel>

          <SecondaryLabel className="mt-2 text-base font-normal text-_secondary_">
            With Royco Markets, you control allocation and negotiate incentives
            on your terms.
          </SecondaryLabel>
        </div>

        {filterVerifiedMarketOption && (
          <div className="flex items-center gap-2">
            <PrimaryLabel className="whitespace-nowrap text-sm font-medium text-_primary_">
              Show Unverified Markets
            </PrimaryLabel>

            <Switch
              checked={!marketFiltersVerified}
              onCheckedChange={() => {
                setMarketFiltersVerified(!marketFiltersVerified);
              }}
            />
          </div>
        )}
      </div>

      <div className="relative mt-6 flex flex-col items-start justify-between gap-2 lg:flex-row lg:items-center">
        <SecondaryLabel className="text-xs font-medium tracking-wide text-_secondary_">
          {propsData?.count || 0} MARKETS
        </SecondaryLabel>

        <div className="flex flex-wrap items-center gap-2">
          <InputAssetFilter />

          {(tag === "default" || tag === "dev" || tag === "testnet") && (
            <ChainFilter />
          )}

          <IncentiveAssetFilter />

          {tag === "boyco" && <PoolTypeFilter />}

          {tag === "sonic" && <AppTypeFilter />}

          <HideColumnsSelector />

          <div className={cn("flex items-center gap-2")}>
            <AnimatePresence>
              {openSearch && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="flex items-center gap-2 overflow-hidden"
                >
                  <Input
                    placeholder="Search"
                    value={marketSearch}
                    onChange={(e) => setMarketSearch(e.target.value)}
                    className="text-sm font-medium text-_primary_"
                    containerClassName="px-4 border border-_secondary_ rounded-sm bg-transparent"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              variant="none"
              onClick={() => {
                if (openSearch) {
                  setMarketSearch("");
                }
                setOpenSearch(!openSearch);
              }}
              className="flex h-fit cursor-pointer items-center justify-center rounded-sm border border-_divider_ bg-_surface_ p-2 transition-all duration-300 hover:border-_secondary_"
            >
              {openSearch ? (
                <XIcon className="h-5 w-5" />
              ) : (
                <SearchIcon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
