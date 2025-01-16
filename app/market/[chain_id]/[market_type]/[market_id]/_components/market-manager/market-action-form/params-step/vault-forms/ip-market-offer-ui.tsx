import React from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useMarketManager } from "@/store";
import { InputAmountWrapper, IPQuantityIndicator } from "../composables";
import { MarketActionFormSchema } from "../../market-action-form-schema";
import { UseFormReturn } from "react-hook-form";
import { BigNumber } from "ethers";
import { parseRawAmount } from "royco/utils";
import { SlideUpWrapper } from "@/components/animations";

export const IPMarketOfferUI = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { userType, offerType, fundingType } = useMarketManager();

  return (
    <div ref={ref} className={cn("", className)} {...props}>
      {/**
       * Quantity Selector for IP
       */}
      <InputAmountWrapper marketActionForm={marketActionForm} delay={0.3} />

      {/**
       * Grey Box for IP
       */}
      <IPQuantityIndicator marketActionForm={marketActionForm} />
    </div>
  );
});
