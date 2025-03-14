import React from "react";
import { cn } from "@/lib/utils";
import {
  SecondaryLabel,
  TertiaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { InputAmountSelector } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/market-manager/market-action-form/action-params/composables";
import { Button } from "@/components/ui/button";

export const WithdrawActionForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex grow flex-col", className)} {...props}>
      <SecondaryLabel>Principle</SecondaryLabel>

      <div className="mt-2 flex gap-2">
        <InputAmountSelector
          containerClassName="h-10"
          currentValue=""
          setCurrentValue={(value) => {
            console.log(value);
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

        <Button className="h-full w-fit px-4">Claim</Button>
      </div>

      <TertiaryLabel className="mt-2">Balance: 0 USDC</TertiaryLabel>
    </div>
  );
});
