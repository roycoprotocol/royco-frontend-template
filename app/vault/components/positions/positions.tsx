"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { SlideUpWrapper } from "@/components/animations";
import { Withdrawals } from "./withdrawals/withdrawals";
import { Rewards } from "./rewards/rewards";

export const Positions = React.forwardRef<
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
       * Withdrawals
       */}
      <SlideUpWrapper className="mt-12" delay={0.3}>
        <Withdrawals />
      </SlideUpWrapper>
    </div>
  );
});
