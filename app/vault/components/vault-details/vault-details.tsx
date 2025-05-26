"use client";

import React, { useMemo } from "react";
import { useAtomValue } from "jotai";
import { SupportedChainMap } from "royco/constants";
import { cn } from "@/lib/utils";
import {
  SecondaryLabel,
  PrimaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import formatNumber from "@/utils/numbers";
import { vaultMetadataAtom } from "@/store/vault/vault-manager";
import { UsdcCoinIcon } from "../../../../assets/icons/usdc";
import { CustomProgress } from "../../common/custom-progress";
import { formatLockupTime } from "@/utils/lockup-time";
import { LockupIcon } from "@/assets/icons/lockup";

export const VaultDetails = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data } = useAtomValue(vaultMetadataAtom);

  const chain = useMemo(() => {
    return SupportedChainMap[data.chainId];
  }, [data.chainId]);

  return (
    <div ref={ref} {...props} className={cn(className)}>
      {/**
       * Header
       */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <UsdcCoinIcon className="h-24 w-24" />

        <div>
          <PrimaryLabel className="font-shippori text-[40px] font-normal leading-relaxed -tracking-[1.6px] text-_primary_">
            {data.name}
          </PrimaryLabel>

          <SecondaryLabel className="mt-1 text-sm font-normal text-_secondary_">
            {data.description}
          </SecondaryLabel>

          <div className="mt-4 flex items-center divide-x divide-_divider_">
            {data.managers &&
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
              })}

            {data.chainId && (
              <div className="flex items-center gap-1 px-3">
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

            {data.maxLockup && (
              <div className="flex items-center gap-1 px-3">
                <LockupIcon className="h-4 w-4" />

                <SecondaryLabel className="text-xs font-medium tracking-wide text-_secondary_">
                  {`${formatLockupTime(data.maxLockup).toUpperCase()} LOCK, FORFEIT TO EXIT EARLY`}
                </SecondaryLabel>
              </div>
            )}
          </div>
        </div>
      </div>

      {/**
       * Vault Capacity
       */}
      <div className="mt-6">
        <CustomProgress value={data.capacity.ratio * 100} />

        <div className="mt-2 flex items-center justify-between">
          <SecondaryLabel className="text-xs font-normal text-_secondary_">
            <div className="flex items-center gap-1">
              <span>
                {formatNumber(data.capacity.currentUsd, {
                  type: "currency",
                })}
              </span>
              <span>TVL</span>
            </div>
          </SecondaryLabel>

          <SecondaryLabel className="text-xs font-normal text-_secondary_">
            <div className="flex items-center gap-1">
              <span>
                {formatNumber(1 - data.capacity.ratio, {
                  type: "percent",
                })}
              </span>
              <span>Remaining</span>
            </div>
          </SecondaryLabel>
        </div>
      </div>
    </div>
  );
});
