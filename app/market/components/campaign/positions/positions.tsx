"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { SlideUpWrapper } from "@/components/animations";
import { Rewards } from "./rewards/rewards";
import { DepositsManager } from "./deposits/deposits-manager";

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
        <DepositsManager />
      </SlideUpWrapper>

      {/**
       * Rewards
       */}
      <SlideUpWrapper className="mt-12" delay={0.3}>
        <Rewards />
      </SlideUpWrapper>
    </div>
  );
});
