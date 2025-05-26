"use client";

import React, { useMemo } from "react";
import { useAtomValue } from "jotai";

import { cn } from "@/lib/utils";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import formatNumber from "@/utils/numbers";
import {
  vaultManagerAtom,
  vaultMetadataAtom,
} from "@/store/vault/vault-manager";

export const Balance = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const vault = useAtomValue(vaultManagerAtom);
  const { data } = useAtomValue(vaultMetadataAtom);

  const token = useMemo(() => {
    return data?.depositTokens[0];
  }, [data]);

  const principle = useMemo(() => {
    return {
      tokenAmount: vault?.account.sharesInBaseAsset || 0,
      tokenAmountUsd: vault?.account.sharesInUsd || 0,
    };
  }, [vault]);

  return (
    <div ref={ref} {...props} className={cn(className)}>
      {/**t
       * Total Deposits
       */}
      <SecondaryLabel className="text-xs font-medium tracking-wide text-_secondary_">
        YOUR POSITION
      </SecondaryLabel>

      <div className="flex items-end gap-2">
        <PrimaryLabel className="font mt-2 font-fragmentMono text-2xl font-normal">
          <div className="flex items-center gap-2">
            <span>
              {formatNumber(principle.tokenAmount, {
                type: "number",
              })}
            </span>

            <span>{token?.symbol}</span>
          </div>
        </PrimaryLabel>

        <SecondaryLabel className="mb-px text-sm font-normal text-_secondary_">
          <span>
            {formatNumber(principle.tokenAmountUsd, {
              type: "currency",
            })}
          </span>
        </SecondaryLabel>
      </div>
    </div>
  );
});
