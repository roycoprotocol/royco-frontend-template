"use client";

import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { EnrichedMarketDataType } from "royco/queries";
import { InfoTip, TokenDisplayer } from "@/components/common";
import { SparklesIcon, SquarePenIcon } from "lucide-react";
import { TokenEditor } from "../token-editor";
import { createPortal } from "react-dom";
import { TertiaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { MarketType } from "@/store";

const BreakdownItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("", className)} {...props} />;
});

const BreakdownTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("font-normal", className)} {...props} />;
});

const BreakdownRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    item: EnrichedMarketDataType["yield_breakdown"][number];
    base_key: string;
    closeParentModal?: () => void;
  }
>(({ className, item, base_key, closeParentModal, ...props }, ref) => {
  const [open, setOpen] = useState(false);

  const triggerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      key={`yield-breakdown:${base_key}:${item.category}:${item.id}`}
      className="flex flex-row items-center justify-between font-light"
      {...props}
    >
      <TokenDisplayer tokens={[item]} symbols={true} />

      <div className="flex flex-row items-center gap-2">
        <div>
          {Intl.NumberFormat("en-US", {
            style: "percent",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(item.annual_change_ratio)}
        </div>

        {item.category === "base" && (
          <HoverCard
            openDelay={200}
            closeDelay={200}
            open={open}
            onOpenChange={setOpen}
          >
            <HoverCardTrigger
              asChild
              onClick={() => {
                if (open === false) {
                  setOpen(true);
                }
              }}
            >
              <SquarePenIcon
                strokeWidth={2}
                className="h-4 w-4 cursor-pointer text-secondary transition-all duration-200 ease-in-out hover:opacity-80"
              />
            </HoverCardTrigger>
            <HoverCardContent className="w-96 overflow-hidden p-0">
              <TokenEditor
                closeHoverCard={() => {
                  setOpen(false);
                  triggerRef.current?.blur();
                  if (closeParentModal) {
                    closeParentModal();
                  }
                }}
                token_data={{
                  ...item,
                  fdv: item.fdv ?? 0,
                  total_supply: item.total_supply
                    ? item.total_supply === 0
                      ? 1
                      : item.total_supply
                    : 0,
                  price: item.price ?? 0,
                  allocation: item.allocation ? item.allocation * 100 : 100,
                  token_amount: item.token_amount ?? 0,
                }}
              />
            </HoverCardContent>
          </HoverCard>
        )}
      </div>
    </div>
  );
});

const BreakdownContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    breakdown: EnrichedMarketDataType["yield_breakdown"];
    base_key: string;
    closeParentModal?: () => void;
  }
>(({ className, breakdown, base_key, closeParentModal, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("", className)} {...props}>
      {breakdown.map((item) => (
        <BreakdownRow
          key={item.id}
          item={item}
          base_key={base_key}
          closeParentModal={closeParentModal}
        />
      ))}
    </div>
  );
});

const NetYield = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    base_key: string;
    annual_change_ratio: number;
  }
>(({ className, base_key, annual_change_ratio, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-3 font-normal text-success", className)}
      {...props}
    >
      <div className="w-full border-b border-divider"></div>
      <div
        key={`yield-breakdown:${base_key}:net-yield`}
        className=" flex flex-row items-center justify-between"
      >
        <div className="flex flex-row items-center gap-2">
          <SparklesIcon className="h-4 w-4" color="#3CC27A" strokeWidth={3} />
          <span>Net APY</span>
        </div>
        <div className="">
          {Intl.NumberFormat("en-US", {
            style: "percent",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(annual_change_ratio)}
        </div>
      </div>
    </div>
  );
});

export const YieldBreakdown = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    breakdown: EnrichedMarketDataType["yield_breakdown"];
    base_key: string;
    marketType?: number;
  }
>(({ className, breakdown, base_key, marketType, ...props }, ref) => {
  return (
    <HoverCard openDelay={200} closeDelay={200}>
      <HoverCardTrigger className={cn("flex cursor-pointer items-end")}>
        {props.children}
      </HoverCardTrigger>
      {typeof window !== "undefined" &&
        breakdown.length > 0 &&
        createPortal(
          <HoverCardContent className="w-64">
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
                    <BreakdownTitle>Incentives Offered on Royco</BreakdownTitle>
                    <BreakdownContent
                      className="mt-1"
                      breakdown={breakdown.filter(
                        (item) => item.category === "base"
                      )}
                      base_key={base_key}
                    />
                  </BreakdownItem>
                  {marketType !== undefined &&
                    marketType === MarketType.recipe.value && (
                      <div className="flex justify-end gap-2">
                        <TertiaryLabel className="self-end italic">
                          Fixed Rate
                        </TertiaryLabel>
                        <InfoTip size="sm">Hello World</InfoTip>
                      </div>
                    )}
                </div>
              )}

              {breakdown.some((item) => item.category !== "base") && (
                <BreakdownItem>
                  <BreakdownTitle>Native Incentives</BreakdownTitle>
                  <BreakdownContent
                    className="mt-1"
                    breakdown={breakdown.filter(
                      (item) => item.category !== "base"
                    )}
                    base_key={base_key}
                  />
                </BreakdownItem>
              )}

              <BreakdownItem>
                <NetYield
                  base_key={base_key}
                  annual_change_ratio={breakdown.reduce(
                    (acc, item) => acc + item.annual_change_ratio,
                    0
                  )}
                />
              </BreakdownItem>
            </div>
          </HoverCardContent>,
          document.body
        )}
    </HoverCard>
  );
});
