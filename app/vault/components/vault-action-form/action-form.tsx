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
import { CustomHorizontalTabs } from "../../common/custom-horizontal-tabs";
import { Balance } from "./balance/balance";

export const VaultActionForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { action, setAction } = useVaultManager();

  return (
    <div ref={ref} {...props} className={cn("", className)}>
      <SlideUpWrapper delay={0.1} className={cn("mt-3")}>
        <Balance />
      </SlideUpWrapper>

      <SlideUpWrapper delay={0.2} className={cn("mt-2 flex flex-col")}>
        <CustomHorizontalTabs
          tabs={Object.values(VaultManagerActionMap).map((action) => ({
            id: action.value,
            label: action.label,
          }))}
          baseId="vault-action-form"
          activeTab={action}
          onTabChange={(id) => setAction(id as TypeVaultManagerAction)}
        />
      </SlideUpWrapper>

      {(() => {
        if (action === TypeVaultManagerAction.Deposit) {
          return (
            <div className="mt-6">
              <DepositAction />
            </div>
          );
        }

        if (action === TypeVaultManagerAction.Withdraw) {
          return (
            <div className="mt-6">
              <WithdrawAction />
            </div>
          );
        }
      })()}
    </div>
  );
});
