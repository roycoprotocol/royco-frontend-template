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
import { AlertIndicator, TokenDisplayer } from "@/components/common";
import { InfoTip } from "@/app/_components/common/info-tip";
import { marketMetadataAtom } from "@/store/market/market";
import { GradientText } from "@/app/vault/common/gradient-text";

export const Rewards = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data } = useAtomValue(marketMetadataAtom);

  return (
    <div ref={ref} {...props} className={cn(className)}>
      <PrimaryLabel className="text-2xl font-medium text-_primary_">
        Rewards
      </PrimaryLabel>

      <div className="mt-4">
        <SecondaryLabel className="text-xs font-medium tracking-wide text-_secondary_">
          ESTIMATED APY
        </SecondaryLabel>

        <PrimaryLabel className="mt-2 text-2xl font-normal">
          <GradientText>
            {formatNumber(data.yieldRate, {
              type: "percent",
            })}
          </GradientText>
        </PrimaryLabel>
      </div>

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
                  </div>
                </div>

                <PrimaryLabel className="text-sm font-normal text-success">
                  <div className="flex items-center gap-1">
                    <GradientText>
                      {formatNumber(reward.yieldRate || 0, {
                        type: "percent",
                      })}
                    </GradientText>

                    <InfoTip>
                      {`${formatNumber(reward.yieldRate || 0, {
                        type: "percent",
                      })} estimated APY is calculated on base assumption of
                        ${formatNumber(reward.fdv, {
                          type: "currency",
                        })} FDV`}
                    </InfoTip>
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
