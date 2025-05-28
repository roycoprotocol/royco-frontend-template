"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { SlideUpWrapper } from "@/components/animations";
import { MarketAllocation } from "./market-allocation/market-allocation";
import { RiskFramework } from "./risk-framework/risk-framework";
import { VaultFAQ } from "./vault-faq/vault-faq";
import { Rewards } from "./rewards/rewards";

export const Overview = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} {...props} className={cn("", className)}>
      {/**
       * Rewards
       */}
      <SlideUpWrapper delay={0.2}>
        <Rewards />
      </SlideUpWrapper>

      {/**
       * Market Allocation
       */}
      <SlideUpWrapper className="mt-12" delay={0.3}>
        <MarketAllocation />
      </SlideUpWrapper>

      {/**
       * Risk Framework
       */}
      <SlideUpWrapper className="mt-12" delay={0.4}>
        <RiskFramework />
      </SlideUpWrapper>

      {/**
       * Vault FAQ
       */}
      <SlideUpWrapper className="mt-12" delay={0.5}>
        <VaultFAQ />
      </SlideUpWrapper>
    </div>
  );
});
