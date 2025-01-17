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
  InputExpirySelector,
} from "../composables";
import { MarketActionFormSchema } from "../../market-action-form-schema";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import ShortcutsWidget from "../shortucts-widget";
import { useActiveMarket } from "../../../hooks";

export const APOfferUI = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { userType, offerType, fundingType } = useMarketManager();
  const { currentMarketData } = useActiveMarket();

  return (
    <div ref={ref} className={cn("", className)} {...props}>
      {/**
       * Enso zap-in
       */}
      {fundingType === MarketFundingType.wallet.id && (
        <ShortcutsWidget
          token={currentMarketData?.input_token_data.contract_address!}
          symbol={currentMarketData?.input_token_data.symbol}
          chainId={currentMarketData?.chain_id!}
        />
      )}

      {/**
       * Quantity Selector for AP
       */}
      <InputAmountWrapper marketActionForm={marketActionForm} delay={0.3} />

      {/**
       * Incentives Rate Selector
       */}
      {offerType === MarketOfferType.limit.id && (
        <IncentivesRateSelector
          marketActionForm={marketActionForm}
          delayTitle={0.4}
          delayContent={0.5}
        />
      )}

      {/**
       * Expiry Selector
       */}
      {offerType === MarketOfferType.limit.id && (
        <InputExpirySelector delay={0.6} marketActionForm={marketActionForm} />
      )}
    </div>
  );
});
