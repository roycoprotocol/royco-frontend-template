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

export const Deposits = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const vault = useAtomValue(vaultManagerAtom);
  const { data } = useAtomValue(vaultMetadataAtom);

  const token = useMemo(() => {
    return data?.depositTokens[0];
  }, [data]);

  const principle = useMemo(() => {
    return vault?.account.sharesInBaseAsset || 0;
  }, [vault]);

  return (
    <div ref={ref} {...props} className={cn(className)}>
      <PrimaryLabel className="text-2xl font-medium text-_primary_">
        Deposits
      </PrimaryLabel>

      {/**
       * Total Deposits
       */}
      <div className="mt-4">
        <SecondaryLabel className="text-xs font-medium text-_secondary_">
          TOTAL DEPOSITS
        </SecondaryLabel>

        <PrimaryLabel className="mt-2 text-2xl font-normal ">
          <div className="flex items-center gap-2">
            <span>
              {formatNumber(principle, {
                type: "number",
              })}
            </span>

            <span>{token?.symbol}</span>
          </div>
        </PrimaryLabel>
      </div>
    </div>
  );
});
