"use client";

import React from "react";

import { cn } from "@/lib/utils";
import { MarketActionType } from "@/store";
import { SlideUpWrapper } from "@/components/animations/slide-up-wrapper";
import { HorizontalTabs } from "@/components/composables";
import { useVaultManager } from "@/store/vault/zustand/use-vault-manager";
import { SupplyAction } from "./supply-action/supply-action";
import { WithdrawAction } from "./withdraw-action/withdraw-action";

export const VaultActionForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { actionType, setActionType } = useVaultManager();

  return (
    <div ref={ref} {...props} className={cn("p-5", className)}>
      <div className={cn("mb-3")}>
        <SlideUpWrapper className={cn("flex flex-col")}>
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

      {(() => {
        if (actionType === MarketActionType.supply.id) {
          return <SupplyAction />;
        }

        if (actionType === MarketActionType.withdraw.id) {
          return <WithdrawAction />;
        }
      })()}
    </div>
  );
});
