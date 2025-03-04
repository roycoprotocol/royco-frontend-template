"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { EnrichedMarketDataType } from "royco/queries";
import { TokenDisplayer } from "@/components/common";
import formatNumber from "@/utils/numbers";
import { SONIC_ROYCO_GEM_BOOST_ID } from "royco/sonic";

const BreakdownTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("font-normal", className)} {...props} />;
});

const BreakdownItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("", className)} {...props} />;
});

const BreakdownRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    item:
      | EnrichedMarketDataType["yield_breakdown"][number]
      | EnrichedMarketDataType["external_incentives"][number];
    base_key: string;
  }
>(({ className, item, base_key, ...props }, ref) => {
  return (
    <div
      ref={ref}
      key={`incentive-breakdown:${base_key}:${item.id}`}
      className="flex flex-row items-center justify-between gap-8 font-light"
      {...props}
    >
      {item.id === SONIC_ROYCO_GEM_BOOST_ID ? (
        <div className="flex flex-row items-center">
          <TokenDisplayer tokens={[item] as any} symbols={false} />
          <div>Royco Gem Bonus</div>
        </div>
      ) : (
        <TokenDisplayer tokens={[item] as any} symbols={true} />
      )}

      {item.token_amount && (
        <div className="flex flex-row items-center gap-2">
          <div>{formatNumber(item.token_amount)}</div>
        </div>
      )}

      {item.value && (
        <div className="flex flex-row items-center gap-2">
          <div>{item.value}</div>
        </div>
      )}
    </div>
  );
});

const BreakdownContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    breakdown:
      | EnrichedMarketDataType["yield_breakdown"]
      | EnrichedMarketDataType["external_incentives"];
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
    breakdown: EnrichedMarketDataType["yield_breakdown"];
    external_incentives: EnrichedMarketDataType["external_incentives"];
    base_key: string;
  }
>(({ className, breakdown, external_incentives, base_key, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-3 text-base font-normal text-black",
        className
      )}
      {...props}
    >
      {breakdown.some((item) => item.category === "base") && (
        <div>
          <BreakdownItem>
            <BreakdownTitle>Negotiable Incentives</BreakdownTitle>
            <BreakdownContent
              className="mt-1"
              breakdown={breakdown.filter((item) => item.category === "base")}
              base_key={base_key}
            />
          </BreakdownItem>
        </div>
      )}

      {breakdown.some((item) => item.category !== "base") && (
        <BreakdownItem>
          <BreakdownTitle>Underlying Incentives</BreakdownTitle>
          <BreakdownContent
            className="mt-1"
            breakdown={breakdown.filter((item) => item.category !== "base")}
            base_key={base_key}
          />
        </BreakdownItem>
      )}

      {external_incentives.length > 0 && (
        <BreakdownItem>
          <BreakdownTitle>Additional Incentives</BreakdownTitle>
          <BreakdownContent
            className="mt-1"
            breakdown={external_incentives}
            base_key={base_key}
          />
        </BreakdownItem>
      )}
    </div>
  );
});
