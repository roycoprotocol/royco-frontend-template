"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { SlideUpWrapper } from "@/components/animations";
import { RiskFramework } from "./risk-framework/risk-framework";
import { CampaignFAQ } from "./campaign-faq/campaign-faq";
import { Rewards } from "./rewards/rewards";

export const Overview = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} {...props} className={cn("", className)}>
      <SlideUpWrapper delay={0.2}>
        <Rewards />
      </SlideUpWrapper>

      <SlideUpWrapper className="mt-12" delay={0.4}>
        <RiskFramework />
      </SlideUpWrapper>

      <SlideUpWrapper className="mt-12" delay={0.5}>
        <CampaignFAQ />
      </SlideUpWrapper>
    </div>
  );
});
