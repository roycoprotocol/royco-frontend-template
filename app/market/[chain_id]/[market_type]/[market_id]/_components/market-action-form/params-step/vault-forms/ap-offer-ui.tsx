import { cn } from "@/lib/utils";
import {
  MarketUserType,
  MarketOfferType,
  MarketFundingType,
  useMarketManager,
} from "@/store";

import React from "react";
import {
  IncentivesAmountSelector,
  IncentivesRateSelector,
  InputAmountWrapper,
} from "../composables";
import { MarketActionFormSchema } from "../../market-action-form-schema";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const APOfferUI = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { userType, offerType, fundingType } = useMarketManager();

  return (
    <div ref={ref} className={cn("", className)} {...props}>
      {/**
       * Quantity Selector for AP
       */}
      <InputAmountWrapper marketActionForm={marketActionForm} delay={0.3} />

      {/**
       * Incentives Amount Selector
       */}
      {offerType === MarketOfferType.limit.id && (
        <IncentivesRateSelector
          marketActionForm={marketActionForm}
          delayTitle={0.4}
          delayContent={0.5}
        />
      )}
    </div>
  );
});
