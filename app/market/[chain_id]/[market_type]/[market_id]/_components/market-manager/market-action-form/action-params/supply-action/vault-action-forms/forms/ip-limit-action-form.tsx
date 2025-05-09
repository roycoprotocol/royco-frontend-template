import React from "react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketActionFormSchema } from "../../../../market-action-form-schema";
import { ActionTypeSelector } from "../../../composables";
import { SlideUpWrapper } from "@/components/animations";
import { IPLimitOfferIncentivesUI } from "../ip-limit-offer-incentives-ui";
import { useMarketManager } from "@/store/use-market-manager";

export const IPLimitActionForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { viewType } = useMarketManager();

  return (
    <div ref={ref} className={cn("", className)} {...props}>
      {/**
       * Vault Incentive Action Type Selector
       */}
      <SlideUpWrapper delay={0.1}>
        <ActionTypeSelector />
      </SlideUpWrapper>

      {/**
       * Incentives UI
       */}
      <IPLimitOfferIncentivesUI marketActionForm={marketActionForm} />
    </div>
  );
});
