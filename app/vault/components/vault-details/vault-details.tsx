"use client";

import React, { useMemo } from "react";
import { useAtomValue } from "jotai";
import { SupportedChainMap } from "royco/constants";

import { cn } from "@/lib/utils";
import {
  SecondaryLabel,
  PrimaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { CustomBadge } from "../../common/custom-badge";
import formatNumber from "@/utils/numbers";
import { Progress } from "@/components/ui/progress";
import { vaultMetadataAtom } from "@/store/vault/vault-metadata";
import { TokenDisplayer } from "@/components/common";

export const VaultDetails = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data } = useAtomValue(vaultMetadataAtom);

  const chain = useMemo(() => {
    return SupportedChainMap[data.chainId];
  }, [data.chainId]);

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "rounded-2xl border border-divider bg-white p-6",
        className
      )}
    >
      <div>
        <PrimaryLabel className="text-[40px] font-medium">
          {data.name} Vault
        </PrimaryLabel>

        <div className="mt-3 flex items-center gap-1">
          {data.managers.map((manager) => {
            return (
              <CustomBadge
                key={manager.id}
                icon={manager.image}
                label={manager.name}
              />
            );
          })}

          <CustomBadge icon={chain.image} label={chain.name} />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-8 sm:flex-row">
        <div className="shrink-0">
          <SecondaryLabel className="text-xs font-medium">
            Deposit
          </SecondaryLabel>

          <PrimaryLabel className="mt-2 text-2xl font-normal">
            <TokenDisplayer
              size={6}
              tokens={data.depositTokens}
              symbols={true}
              symbolClassName="font-normal text-primary text-2xl leading-7"
            />
          </PrimaryLabel>
        </div>

        <div className="shrink-0">
          <SecondaryLabel className="text-xs font-medium">
            Est. APY
          </SecondaryLabel>

          <PrimaryLabel className="mt-2 text-2xl font-normal">
            <div className="flex items-center gap-1">
              <span className="leading-7 text-primary">
                {formatNumber(data.yieldRate, {
                  type: "percent",
                })}
              </span>

              <TokenDisplayer
                size={6}
                tokens={data.incentiveTokens}
                symbols={false}
              />
            </div>
          </PrimaryLabel>
        </div>

        <div className="shrink-0">
          <SecondaryLabel className="text-xs font-medium">
            Max Lockup
          </SecondaryLabel>

          <PrimaryLabel className="mt-2 text-2xl font-normal">
            {data.maxLockup !== "0"
              ? (() => {
                  const seconds = Number(data.maxLockup);
                  if (seconds < 3600) {
                    return `${seconds}sec`;
                  }
                  const hours = Math.ceil(seconds / 3600);
                  if (seconds < 86400) {
                    return `${hours}hr`;
                  }
                  const days = Math.ceil(seconds / 86400);
                  return `${days}d`;
                })()
              : "None"}
          </PrimaryLabel>
        </div>
      </div>

      <div className="mt-6">
        <Progress
          value={data.capacity.ratio * 100}
          className="h-2 bg-z2"
          indicatorClassName="bg-warning"
        />

        <div className="mt-2 flex items-center justify-between">
          <SecondaryLabel className="text-xs font-medium">
            <div className="flex items-center gap-1">
              <span>
                {formatNumber(data.capacity.currentUsd, {
                  type: "currency",
                })}
              </span>
              <span>TVL</span>
            </div>
          </SecondaryLabel>

          <SecondaryLabel className="text-xs font-medium">
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
