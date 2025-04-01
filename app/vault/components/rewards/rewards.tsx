"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import formatNumber from "@/utils/numbers";
import { SlideUpWrapper } from "@/components/animations";

export const Rewards = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  // TODO: Implement Hook
  const rewards = [
    { type: "percent", value: 0.0507, label: "GHO", expires: "Until Mar 31" },
    {
      type: "string",
      value: "5X Points",
      label: "VEDA Points",
      expires: "Until Mar 3",
    },
    {
      type: "string",
      value: "5X Points",
      label: "stkGHO",
      expires: "Base Rate",
    },
  ];

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
      <div className="mt-4">
        {rewards.map((reward, index) => (
          <SlideUpWrapper key={index} delay={index * 0.1}>
            <div className="flex items-start justify-between py-3">
              <div>
                <PrimaryLabel className="text-sm font-medium">
                  {reward.label}
                </PrimaryLabel>
                <SecondaryLabel className="mt-1">
                  {reward.expires}
                </SecondaryLabel>
              </div>

              <PrimaryLabel className="text-sm text-success">
                {reward.type === "percent"
                  ? formatNumber(reward.value, {
                      type: "percent",
                    })
                  : reward.value}
              </PrimaryLabel>
            </div>
          </SlideUpWrapper>
        ))}
      </div>
    </div>
  );
});
