"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { SlideUpWrapper } from "@/components/animations";
import { Withdrawals } from "./withdrawals/withdrawals";
import { Rewards } from "./rewards/rewards";
import { Deposits } from "./deposits/deposits";

export const Positions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} {...props} className={cn("", className)}>
      {/**
       * Deposits
       */}
      <SlideUpWrapper delay={0.2}>
        <Deposits />
      </SlideUpWrapper>

      {/**
       * Rewards
       */}
      <SlideUpWrapper className="mt-12" delay={0.3}>
        <Rewards />
      </SlideUpWrapper>

      {/**
       * Withdrawals
       */}
      <SlideUpWrapper className="mt-12" delay={0.4}>
        <Withdrawals />
      </SlideUpWrapper>
    </div>
  );
});
