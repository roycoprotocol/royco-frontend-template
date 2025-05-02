"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { ChainFilter } from "./filters/chain-filter";
import { SearchIcon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { exploreSearchKeyAtom } from "@/store/explore/atoms";
import { useAtom } from "jotai";
import { motion, AnimatePresence } from "framer-motion";

export const MarketFilter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [exploreSearchKey, setExploreSearchKey] = useAtom(exploreSearchKeyAtom);

  const [openSearch, setOpenSearch] = useState(false);

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "flex flex-col items-start justify-between gap-5 md:flex-row md:items-end",
        className
      )}
    >
      <div>
        <PrimaryLabel className="text-2xl font-medium text-_primary_">
          Markets
        </PrimaryLabel>

        <SecondaryLabel className="mt-2 text-base font-normal text-_secondary_">
          Maximum precision. You decide when and where to move capital.
        </SecondaryLabel>
      </div>

      <div className="relative flex w-full flex-1 items-center justify-between gap-2 md:justify-end">
        <ChainFilter />

        <div className={cn("flex items-center self-end")}>
          <AnimatePresence>
            {openSearch && (
              <motion.div
                initial={{ scale: 0, opacity: 0, x: 20 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{ scale: 0, opacity: 0, x: 20 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="absolute bottom-0 right-0 top-0 z-10 flex w-full max-w-[500px] origin-right items-center gap-2"
              >
                <Input
                  placeholder="Search"
                  value={exploreSearchKey}
                  onChange={(e) => setExploreSearchKey(e.target.value)}
                  className="w-full text-sm font-medium text-_primary_"
                  containerClassName="w-full px-4 h-10 bg-white border border-_divider_ rounded-full"
                />

                <Button
                  variant="none"
                  onClick={() => {
                    setOpenSearch(false);
                    setExploreSearchKey("");
                  }}
                  className="flex h-fit cursor-pointer items-center justify-center rounded-full border border-_divider_ bg-_surface_ p-2 transition-all duration-300 hover:border-_secondary_"
                >
                  <XIcon className="h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={false}
            animate={{ scale: openSearch ? 0 : 1 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="origin-right"
          >
            <Button
              variant="none"
              onClick={() => setOpenSearch(true)}
              className="flex h-fit cursor-pointer items-center justify-center rounded-full border border-_divider_ bg-_surface_ p-2 transition-all duration-300 hover:border-_secondary_"
            >
              <SearchIcon className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
});
