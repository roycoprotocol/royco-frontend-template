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
import { GradientText } from "../../../common/gradient-text";
import { InfoTip } from "@/app/_components/common/info-tip";
import { AnnualYieldAssumption } from "@/app/vault/common/annual-yield-assumption";

export const Rewards = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data } = useAtomValue(vaultMetadataAtom);

  return (
    <div ref={ref} {...props} className={cn(className)}>
      <PrimaryLabel className="text-2xl font-medium text-_primary_">
        Rewards
      </PrimaryLabel>

      {/**
       * Estimated APY
       */}
      <div className="mt-4">
        <SecondaryLabel className="text-xs font-medium text-_secondary_">
          ESTIMATED APY
        </SecondaryLabel>

        <PrimaryLabel className="mt-2 text-2xl font-normal">
          <GradientText>
            {formatNumber(data.yieldRate, {
              type: "percent",
            })}
          </GradientText>
        </PrimaryLabel>

        <SecondaryLabel className="mt-2 text-xs font-medium text-_secondary_">
          <div className="flex items-center gap-1">
            <span className="flex gap-1">
              Estimated from
              <span className="border-b-2 border-dotted border-current">
                Current
              </span>
              APY
            </span>

            <InfoTip contentClassName="max-w-[400px]">
              APY is a snapshot based on current token prices and market
              allocations. It excludes compounding, duration, and changes in
              token value. Vault curators may adjust allocations at any time.
              Actual rewards will vary.
            </InfoTip>
          </div>
        </SecondaryLabel>
      </div>

      {/**
       * Rewards
       */}
      <div className="mt-4 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
        {data.incentiveTokens && data.incentiveTokens.length > 0 ? (
          data.incentiveTokens.map((reward, index) => (
            <SlideUpWrapper key={index} delay={0.2 + index * 0.01}>
              <div className="flex items-center justify-between border-b border-_divider_ py-4">
                <div className="flex items-center gap-3">
                  <TokenDisplayer size={6} tokens={[reward]} symbols={false} />

                  <div>
                    <PrimaryLabel className="text-base font-normal text-_primary_">
                      {reward.label || reward.name}
                    </PrimaryLabel>
                    {/* <SecondaryLabel className="mt-1 text-xs font-normal text-_secondary_">
                      {reward.unlockTimestamp
                        ? `Until ${formatDate(Number(reward.unlockTimestamp) * 1000, "MMM d")}`
                        : "N/A"}
                    </SecondaryLabel> */}
                  </div>
                </div>

                <PrimaryLabel className="text-sm font-normal text-success">
                  <div className="flex items-center gap-1">
                    <GradientText>
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
                    </GradientText>

                    {reward.yieldRate ? (
                      <InfoTip>
                        {`${formatNumber(data.yieldRate, {
                          type: "percent",
                        })} estimated APY is calculated on base assumption of
                        ${formatNumber(reward.fdv, {
                          type: "currency",
                        })} FDV`}
                      </InfoTip>
                    ) : null}
                  </div>
                </PrimaryLabel>
              </div>
            </SlideUpWrapper>
          ))
        ) : (
          <AlertIndicator className="col-span-full rounded-sm border border-_divider_ py-10">
            <span className="text-base">No rewards available</span>
          </AlertIndicator>
        )}
      </div>
    </div>
  );
});
