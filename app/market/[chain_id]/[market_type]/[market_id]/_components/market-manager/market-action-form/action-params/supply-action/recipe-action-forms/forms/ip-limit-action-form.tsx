import React from "react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketActionFormSchema } from "../../../../market-action-form-schema";
import { IPQuantityIndicator } from "../../../composables";
import { InputExpirySelector } from "../../../composables";
import { IncentivesAmountSelector } from "../../../composables";
import { InputAmountWrapper } from "../../components/input-amount-wrapper";
import { SlideUpWrapper } from "@/components/animations";
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
       * Input Amount
       */}
      <SlideUpWrapper delay={0.1}>
        <InputAmountWrapper marketActionForm={marketActionForm} />
      </SlideUpWrapper>

      {/**
       * Incentive Amount Selector
       */}
      <IncentivesAmountSelector
        marketActionForm={marketActionForm}
        delayTitle={0.2}
        delayContent={0.3}
      />

      {/**
       * Input Expiry
       */}
      <div className="mt-5">
        <SlideUpWrapper delay={0.4}>
          <InputExpirySelector marketActionForm={marketActionForm} />
        </SlideUpWrapper>
      </div>

      <IPQuantityIndicator marketActionForm={marketActionForm} />
    </div>
  );
});
