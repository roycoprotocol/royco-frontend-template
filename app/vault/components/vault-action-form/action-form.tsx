"use client";

import React from "react";

import { cn } from "@/lib/utils";
import { SlideUpWrapper } from "@/components/animations/slide-up-wrapper";
import { HorizontalTabs } from "@/components/composables";
import {
  TypeVaultManagerAction,
  useVaultManager,
  VaultManagerActionMap,
} from "@/store/vault/use-vault-manager";
import { DepositAction } from "./deposit-action/deposit-action";
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
            key="vault:action-type:container"
            baseId="vault:action-type"
            tabs={Object.values(VaultManagerActionMap).map((action) => ({
              id: action.value,
              label: action.label,
            }))}
            activeTab={actionType}
            setter={setActionType}
          />
        </SlideUpWrapper>
      </div>

      {(() => {
        if (actionType === TypeVaultManagerAction.Deposit) {
          return <DepositAction />;
        }

        if (actionType === TypeVaultManagerAction.Withdraw) {
          return <WithdrawAction />;
        }
      })()}
    </div>
  );
});
