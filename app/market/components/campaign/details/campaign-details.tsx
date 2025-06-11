"use client";

import React, { useMemo } from "react";
import { useAtomValue } from "jotai";
import { cn } from "@/lib/utils";
import {
  SecondaryLabel,
  PrimaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { marketMetadataAtom } from "@/store/market/market";
import { SupportedChainMap } from "royco/constants";

export const CampaignDetails = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data } = useAtomValue(marketMetadataAtom);

  const chain = useMemo(() => {
    return SupportedChainMap[data.chainId];
  }, [data.chainId]);

  return (
    <div ref={ref} {...props} className={cn(className)}>
      {/**
       * Header
       */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div>
          <PrimaryLabel className="font-shippori text-[40px] font-normal leading-relaxed -tracking-[1.6px] text-_primary_">
            {data.name}
          </PrimaryLabel>

          <SecondaryLabel className="mt-1 text-sm font-normal text-_secondary_">
            {data.description}
          </SecondaryLabel>

          <div className="mt-4 flex items-center divide-x divide-_divider_">
            {/* {data.managers &&
              data.managers.length > 0 &&
              data.managers.map((manager, index) => {
                return (
                  <div
                    className={cn(
                      "flex items-center gap-1 px-3",
                      !index && "pl-0"
                    )}
                  >
                    <img
                      src={manager.image}
                      alt={manager.name}
                      width={16}
                      height={16}
                      className="rounded-full"
                    />
                    <SecondaryLabel className="text-xs font-medium tracking-wide text-_secondary_">
                      {manager.name.toUpperCase()}
                    </SecondaryLabel>
                  </div>
                );
              })} */}

            {data.chainId && (
              <div className="flex items-center gap-1">
                {/* px-3 */}
                <img
                  src={chain.image}
                  alt={chain.name}
                  width={16}
                  height={16}
                  className="rounded-full"
                />
                <SecondaryLabel className="text-xs font-medium tracking-wide text-_secondary_">
                  {chain.name.toUpperCase()}
                </SecondaryLabel>
              </div>
            )}

            {/* {data.maxLockup && (
              <div className="flex items-center gap-1 px-3">
                <LockupIcon className="h-4 w-4" />

                <SecondaryLabel className="text-xs font-medium tracking-wide text-_secondary_">
                  {`${formatLockupTimeSingular(data.maxLockup).toUpperCase()} LOCK, FORFEIT TO EXIT EARLY`}
                </SecondaryLabel>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
});
