import React from "react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { InputAmountSelector } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/market-manager/market-action-form/action-params/composables";
import { SecondaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { depositFormSchema } from "../supply-action";

export const DepositActionForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    depositForm: UseFormReturn<z.infer<typeof depositFormSchema>>;
  }
>(({ className, depositForm, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex grow flex-col", className)} {...props}>
      <SecondaryLabel>Input Amount</SecondaryLabel>

      <InputAmountSelector
        containerClassName="mt-2"
        currentValue={depositForm.watch("amount")}
        setCurrentValue={(value) => {
          depositForm.setValue("amount", value);
        }}
        Prefix={() => {
          return (
            <div
              onClick={() => {
                console.log("MAX");
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
  );
});
