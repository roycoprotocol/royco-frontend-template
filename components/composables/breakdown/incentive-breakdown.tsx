"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { EnrichedMarketDataType } from "royco/queries";
import { TokenDisplayer } from "@/components/common";
import formatNumber from "@/utils/numbers";
import { SONIC_ROYCO_GEM_BOOST_ID } from "royco/sonic";
import { EnrichedMarket, TokenQuote } from "royco/api";

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
    item: TokenQuote & {
      rawAmount?: string;
      tokenAmount?: number;
      tokenAmountUsd?: number;
      yieldRate?: number;
      yieldText?: string;
    };
    baseKey: string;
  }
>(({ className, item, baseKey, ...props }, ref) => {
  return (
    <div
      ref={ref}
      key={`incentive-breakdown:${baseKey}:${item.id}`}
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
    </div>
  );
});

const BreakdownContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    breakdown: (TokenQuote & {
      rawAmount?: string;
      tokenAmount?: number;
      tokenAmountUsd?: number;
      yieldRate?: number;
      yieldText?: string;
    })[];
    baseKey: string;
  }
>(({ className, breakdown, baseKey, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("", className)} {...props}>
      {breakdown.map((item) => (
        <BreakdownRow key={item.id} item={item} baseKey={baseKey} />
      ))}
    </div>
  );
});

export const IncentiveBreakdown = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    baseKey: string;
    activeIncentives?: EnrichedMarket["activeIncentives"];
    underlyingIncentives?: EnrichedMarket["underlyingIncentives"];
    nativeIncentives?: EnrichedMarket["nativeIncentives"];
    externalIncentives?: EnrichedMarket["externalIncentives"];
  }
>(
  (
    {
      className,
      activeIncentives,
      nativeIncentives,
      underlyingIncentives,
      externalIncentives,
      baseKey,
      ...props
    },
    ref
  ) => {
    const combinedUnderlyingAndNativeIncentives = [
      ...(underlyingIncentives || []),
      ...(nativeIncentives || []),
    ];

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-3 text-base font-normal text-black",
          className
        )}
        {...props}
      >
        {activeIncentives && activeIncentives.length > 0 && (
          <div>
            <BreakdownItem>
              <BreakdownTitle>Negotiable Incentives</BreakdownTitle>
              <BreakdownContent
                className="mt-1"
                breakdown={activeIncentives}
                baseKey={baseKey}
              />
            </BreakdownItem>
          </div>
        )}

        {combinedUnderlyingAndNativeIncentives.length > 0 && (
          <div>
            <BreakdownItem>
              <BreakdownTitle>Underlying Incentives</BreakdownTitle>
              <BreakdownContent
                className="mt-1"
                breakdown={combinedUnderlyingAndNativeIncentives}
                baseKey={baseKey}
              />
            </BreakdownItem>
          </div>
        )}

        {externalIncentives && externalIncentives.length > 0 && (
          <div>
            <BreakdownItem>
              <BreakdownTitle>Additional Incentives</BreakdownTitle>
              <BreakdownContent
                className="mt-1"
                breakdown={externalIncentives}
                baseKey={baseKey}
              />
            </BreakdownItem>
          </div>
        )}
      </div>
    );
  }
);
