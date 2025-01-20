import React from "react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketActionFormSchema } from "../../../../market-action-form-schema";
import {
  IncentivesRateSelector,
  InputExpirySelector,
} from "../../../composables";
import { IncentivesAmountSelector } from "../../../composables";
import { MarketOfferType, useMarketManager } from "@/store";
import { MarketFundingType } from "@/store";
import { InputAmountWrapper } from "../../components/input-amount-wrapper";
import { FundingSourceSelector } from "../../components/funding-source-selector";

export const APLimitActionForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { fundingType, offerType } = useMarketManager();

  return (
    <div ref={ref} className={cn("", className)} {...props}>
      {/**
       * Quantity Selector for AP
       */}
      <InputAmountWrapper marketActionForm={marketActionForm} delay={0.3} />

      {/**
       * Incentives Rate Selector
       */}
      <IncentivesRateSelector
        marketActionForm={marketActionForm}
        delayTitle={0.4}
        delayContent={0.5}
      />

      {/**
       * Expiry Selector
       */}
      {offerType === MarketOfferType.limit.id && (
        <InputExpirySelector delay={0.6} marketActionForm={marketActionForm} />
      )}
    </div>
  );
});
