"use client";

import React from "react";
import { useAtomValue } from "jotai";

import { cn } from "@/lib/utils";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import formatNumber from "@/utils/numbers";
import { SlideUpWrapper } from "@/components/animations";

import { vaultMetadataAtom } from "@/store/vault/vault-manager";
import { AlertIndicator, TokenDisplayer } from "@/components/common";
import { formatDate } from "date-fns";

export const Rewards = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data } = useAtomValue(vaultMetadataAtom);

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "rounded-2xl border border-divider bg-white p-6",
        className
      )}
    >
      <PrimaryLabel className="mb-4 text-base">Rewards</PrimaryLabel>

      {/**
       * Rewards
       */}
      <div className="mt-4 space-y-6">
        {data.incentiveTokens && data.incentiveTokens.length > 0 ? (
          data.incentiveTokens.map((reward, index) => (
            <SlideUpWrapper key={index} delay={index * 0.1}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <TokenDisplayer size={6} tokens={[reward]} symbols={false} />

                  <div>
                    <PrimaryLabel className="text-sm font-medium">
                      {reward.name}
                    </PrimaryLabel>
                    <SecondaryLabel className="mt-px">
                      {reward.unlockTimestamp
                        ? `Until ${formatDate(Number(reward.unlockTimestamp) * 1000, "MMM d")}`
                        : "N/A"}
                    </SecondaryLabel>
                  </div>
                </div>

                <PrimaryLabel className="text-sm text-success">
                  {(() => {
                    if (reward.yieldRate) {
                      return formatNumber(reward.yieldRate, {
                        type: "percent",
                      });
                    }

                    if (reward.yieldRate === 0 && reward.tokenAmount) {
                      return `${formatNumber(reward.tokenAmount, {
                        type: "number",
                      })} ${reward.symbol}`;
                    }

                    if (reward.yieldText) {
                      return reward.yieldText;
                    }

                    return;
                  })()}
                </PrimaryLabel>
              </div>
            </SlideUpWrapper>
          ))
        ) : (
          <AlertIndicator className="py-10">
            No rewards available
          </AlertIndicator>
        )}
      </div>
    </div>
  );
});
