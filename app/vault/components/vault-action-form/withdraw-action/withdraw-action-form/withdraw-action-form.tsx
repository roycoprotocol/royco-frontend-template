import React, { useMemo } from "react";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

import { cn } from "@/lib/utils";
import {
  SecondaryLabel,
  TertiaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { InputAmountSelector } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/market-manager/market-action-form/action-params/composables";
import { withdrawFormSchema } from "../withdraw-action";
import { boringVaultAtom } from "@/store/vault/atom/boring-vault";

import { useAtomValue } from "jotai";
import { VAULT_DECIMALS } from "@/app/vault/providers/boring-vault/boring-vault-provider";
export const WithdrawActionForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    withdrawForm: UseFormReturn<z.infer<typeof withdrawFormSchema>>;
  }
>(({ className, withdrawForm, ...props }, ref) => {
  const boringVault = useAtomValue(boringVaultAtom);

  return (
    <div ref={ref} className={cn("flex grow flex-col", className)} {...props}>
      <SecondaryLabel>Principle</SecondaryLabel>

      <div className="mt-2 flex gap-2">
        <InputAmountSelector
          containerClassName="h-10"
          currentValue={withdrawForm.watch("amount")}
          setCurrentValue={(value) => {
            withdrawForm.setValue("amount", value);
          }}
          Prefix={() => {
            return (
              <div
                onClick={() => {
                  withdrawForm.setValue(
                    "amount",
                    (
                      boringVault?.user?.total_shares_in_base_asset || 0
                    ).toString()
                  );
                }}
                className={cn(
                  "flex cursor-pointer items-center justify-center",
                  "text-xs font-300 text-secondary underline decoration-tertiary decoration-dotted underline-offset-[3px]",
                  "transition-all duration-200 ease-in-out hover:opacity-80"
                )}
              >
                Max
              </div>
            );
          }}
          Suffix={() => {
            return <SecondaryLabel className="text-black">USDC</SecondaryLabel>;
          }}
        />
      </div>

      <TertiaryLabel className="mt-2">Balance: 0 USDC</TertiaryLabel>
    </div>
  );
});
