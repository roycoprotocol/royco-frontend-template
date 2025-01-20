import React from "react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketActionFormSchema } from "../../../../market-action-form-schema";
import { FundingSourceSelector } from "../../components/funding-source-selector";
import { InputAmountWrapper } from "../../components/input-amount-wrapper";

export const APMarketActionForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
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
        <InputAmountWrapper marketActionForm={marketActionForm} />
      </div>
    </div>
  );
});
