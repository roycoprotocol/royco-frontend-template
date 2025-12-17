import React, { Fragment } from "react";
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
import { useMixpanel } from "@/services/mixpanel";
import { TriangleAlert } from "lucide-react";

export const ActionParams = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { trackMarketFromActionChanged } = useMixpanel();
  const { actionType, setActionType, userType } = useMarketManager();

  return (
    <div ref={ref} className={cn("flex grow flex-col", className)} {...props}>
      {userType === MarketUserType.ap.id && (
        <div className={cn("mb-3")}>
          <SlideUpWrapper className={cn("flex flex-col")}>
            <HorizontalTabs
              className={cn("")}
              size="sm"
              key="market:action-type:container"
              baseId="market:action-type"
              tabs={Object.values(MarketActionType)}
              activeTab={actionType}
              setter={(value: any) => {
                setActionType(value);

                if (value === MarketActionType.supply.id) {
                  trackMarketFromActionChanged({
                    from_action: "supply",
                  });
                } else {
                  trackMarketFromActionChanged({
                    from_action: "withdraw",
                  });
                }
              }}
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
        <Fragment>
          <div className="flex w-full flex-col gap-1 rounded-xl border border-divider bg-z2 p-3 text-xs text-black transition-all duration-200 ease-in-out hover:bg-focus">
            <div className="flex flex-row items-center gap-2">
              <TriangleAlert className="h-4 w-4 text-blue-500" />
              <div className="font-bold text-blue-500">INFO</div>
            </div>

            <div className="text-light text-secondary">
              Please check on Etherscan to confirm that you received your funds.
              Already withdrawn positions may still show on the Royco site.
              Reach out on Telegram with any questions.
            </div>
          </div>

          <WithdrawAction marketActionForm={marketActionForm} />
        </Fragment>
      )}
    </div>
  );
});
