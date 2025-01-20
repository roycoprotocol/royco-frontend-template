import React from "react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketActionFormSchema } from "../../../../market-action-form-schema";
import { InputExpirySelector } from "../../../composables";
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
       * Funding Source Selector
       */}
      <FundingSourceSelector
        fundingVaultAddress={marketActionForm.watch("funding_vault") ?? ""}
        onSelectFundingVaultAddress={(value) => {
          marketActionForm.setValue("funding_vault", value);
        }}
      />

      {/**
       * Input Amount
       */}
      <div className="mt-2">
        <InputAmountWrapper
          marketActionForm={marketActionForm}
          delay={fundingType === MarketFundingType.wallet.id ? 0.3 : 0.4}
        />
      </div>

      <IncentivesAmountSelector
        marketActionForm={marketActionForm}
        delayTitle={0.4}
        delayContent={0.5}
      />

      <InputExpirySelector delay={0.6} marketActionForm={marketActionForm} />
    </div>
  );
});
