import React from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { MarketActionFormSchema } from "../market-action-form-schema";
import { MarketActionType, useMarketManager } from "@/store";
import { MarketUserType } from "@/store";
import { SlideUpWrapper } from "@/components/animations/slide-up-wrapper";
import { HorizontalTabs } from "@/components/composables";
import { SupplyAction } from "./supply-action";
import { WithdrawAction } from "./withdraw-action";

export const ActionParams = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { actionType, setActionType, userType, viewType } = useMarketManager();

  return (
    <div ref={ref} className={cn("flex grow flex-col", className)} {...props}>
      {userType === MarketUserType.ap.id && (
        <div className={cn("mb-3")}>
          <SlideUpWrapper
            layout="position"
            layoutId={`motion:market:action-type:${viewType}`}
            className={cn("flex flex-col")}
          >
            <HorizontalTabs
              className={cn("")}
              size="sm"
              key="market:action-type:container"
              baseId="market:action-type"
              tabs={Object.values(MarketActionType)}
              activeTab={actionType}
              setter={setActionType}
            />
          </SlideUpWrapper>
        </div>
      )}

      {/**
       * Supply Action
       */}
      {actionType === MarketActionType.supply.id && (
        <SupplyAction marketActionForm={marketActionForm} />
      )}

      {/**
       * Withdraw Action
       */}
      {actionType === MarketActionType.withdraw.id && (
        <WithdrawAction marketActionForm={marketActionForm} />
      )}
    </div>
  );
});
