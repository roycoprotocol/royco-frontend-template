import React from "react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketActionFormSchema } from "../../../../market-action-form-schema";
import { IPQuantityIndicator } from "../../../composables";
import { InputExpirySelector } from "../../../composables";
import { IncentivesAmountSelector } from "../../../composables";
import { InputAmountWrapper } from "../../components/input-amount-wrapper";

export const IPLimitActionForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("", className)} {...props}>
      <InputAmountWrapper marketActionForm={marketActionForm} delay={0.2} />

      <IncentivesAmountSelector
        marketActionForm={marketActionForm}
        delayTitle={0.5}
        delayContent={0.5}
      />

      <InputExpirySelector delay={0.6} marketActionForm={marketActionForm} />

      <IPQuantityIndicator marketActionForm={marketActionForm} />
    </div>
  );
});
