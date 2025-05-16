"use client";

import { LoadingIndicator } from "@/app/_components/common/loading-indicator";
import { SecondaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables/common-labels";
import { PrimaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables/common-labels";
import { cn } from "@/lib/utils";
import { loadableExploreVaultAtom } from "@/store/explore/explore-market";
import { useAtomValue } from "jotai";
import React from "react";
import { NotFoundWarning } from "../common/not-found-warning";
import { EnrichedVault } from "royco/api";
import { UsdcCoinIcon } from "@/app/vault/assets/usdc";
import { Button } from "@/components/ui/button";
import formatNumber from "@/utils/numbers";

interface VaultsCardProps {
  data: EnrichedVault;
}

const VaultsCard = ({ data }: VaultsCardProps) => {
  return (
    <div className="rounded-sm border border-_divider_ bg-_surface_">
      <div className="flex flex-col items-center justify-between gap-5 bg-gradient-to-bl from-[#1A6FBC0D] via-transparent to-transparent p-8 lg:flex-row lg:px-12 lg:py-16">
        <div className="flex items-center gap-3">
          <UsdcCoinIcon className="h-20 w-20" />

          <div className="flex flex-col gap-3">
            <PrimaryLabel className="text-2xl font-medium text-_primary_">
              {data.name}
            </PrimaryLabel>

            <SecondaryLabel className="text-sm font-normal text-_secondary_">
              <div className="flex items-center gap-3">
                <span>
                  {formatNumber(data.tvlUsd, {
                    type: "currency",
                  }) + " TVL"}
                </span>

                <div className="h-3 w-[1px] bg-_divider_" />

                <span className="text-[#1A6FBC]">
                  {"Up to " +
                    formatNumber(data.yieldRate, { type: "percent" }) +
                    " APY"}
                </span>
              </div>
            </SecondaryLabel>
          </div>
        </div>

        <a href={`/vault/boring/${data.chainId}/${data.vaultAddress}`}>
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-full rounded-sm border-_divider_ px-4 text-center sm:h-10"
          >
            Explore
          </Button>
        </a>
      </div>
    </div>
  );
};

export const ExploreVaultsTable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const {
    data: propsData,
    isLoading,
    isError,
  } = useAtomValue(loadableExploreVaultAtom);

  if (isLoading && !propsData) {
    return (
      <div className="flex flex-col items-center p-20">
        <LoadingIndicator />
      </div>
    );
  }

  if (isError || propsData?.count === 0) {
    return (
      <div className="w-full">
        <NotFoundWarning title="No Vaults Found." />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      {...props}
      className={cn("grid grid-cols-1 gap-3 md:grid-cols-2", className)}
    >
      {(propsData?.data || []).map((vault) => {
        return <VaultsCard key={vault.id} data={vault} />;
      })}
    </div>
  );
});
