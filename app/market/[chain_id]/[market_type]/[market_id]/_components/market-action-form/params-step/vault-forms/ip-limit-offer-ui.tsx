import React from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { SlideUpWrapper } from "@/components/animations";
import { MarketVaultIncentiveAction, useMarketManager } from "@/store";
import { IPLimitOfferAddIncentivesUI } from "./ip-limit-offer-add-incentives-ui";
import { UseFormReturn } from "react-hook-form";
import { MarketActionFormSchema } from "../../market-action-form-schema";
import { ActionTypeSelector } from "../composables/action-type-selector";
import { IPLimitOfferIncentivesUI } from "./ip-limit-offer-incentives-ui";

export const IPLimitOfferUI = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { vaultIncentiveActionType } = useMarketManager();

  return (
    <div ref={ref} className={cn("", className)} {...props}>
      <SlideUpWrapper
        layout="position"
        layoutId="motion:market:vault-incentive-action-type"
        delay={0.1}
      >
        <ActionTypeSelector />
      </SlideUpWrapper>

      <IPLimitOfferIncentivesUI marketActionForm={marketActionForm} />
    </div>
  );
});
