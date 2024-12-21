"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { EnrichedMarketDataType } from "royco/queries";
import { TokenDisplayer } from "@/components/common";

const BreakdownItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("", className)} {...props} />;
});

const BreakdownRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    item: EnrichedMarketDataType["incentive_tokens_data"][number];
    base_key: string;
  }
>(({ className, item, base_key, ...props }, ref) => {
  return (
    <div
      ref={ref}
      key={`incentive-breakdown:${base_key}:${item.id}`}
      className="flex flex-row items-center justify-between font-light"
      {...props}
    >
      <TokenDisplayer tokens={[item]} symbols={true} />

      <div className="flex flex-row items-center gap-2">
        <div>
          {Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          }).format(item.token_amount_usd)}
        </div>
      </div>
    </div>
  );
});

const BreakdownContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    breakdown: EnrichedMarketDataType["incentive_tokens_data"];
    base_key: string;
  }
>(({ className, breakdown, base_key, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("", className)} {...props}>
      {breakdown.map((item) => (
        <BreakdownRow key={item.id} item={item} base_key={base_key} />
      ))}
    </div>
  );
});

export const IncentiveBreakdown = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    breakdown: EnrichedMarketDataType["incentive_tokens_data"];
    base_key: string;
  }
>(({ className, breakdown, base_key, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-3 text-base font-normal text-black",
        className
      )}
      {...props}
    >
      <BreakdownItem>
        <BreakdownContent breakdown={breakdown} base_key={base_key} />
      </BreakdownItem>
    </div>
  );
});
