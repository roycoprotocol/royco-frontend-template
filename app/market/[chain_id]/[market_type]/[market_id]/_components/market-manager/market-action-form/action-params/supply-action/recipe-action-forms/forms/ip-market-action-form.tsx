import React from "react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketActionFormSchema } from "../../../../market-action-form-schema";
import { InputAmountWrapper } from "../../components/input-amount-wrapper";
import { IPQuantityIndicator } from "../../../composables";
import { IncentiveAssetsSelector } from "../../../composables";

export const IPMarketActionForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("", className)} {...props}>
      <div ref={ref} className={cn(className)} {...props}>
        <InputAmountWrapper marketActionForm={marketActionForm} delay={0.2} />

        <IncentiveAssetsSelector
          marketActionForm={marketActionForm}
          delayTitle={0.4}
          delayContent={0.5}
        />

        <IPQuantityIndicator marketActionForm={marketActionForm} />
      </div>
    </div>
  );
});
