import { SlideUpWrapper } from "@/components/animations";
import { cn } from "@/lib/utils";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useActiveMarket } from "../../../hooks";
import { parseRawAmount, parseRawAmountToTokenAmount } from "@/sdk/utils";
import { MarketActionFormSchema } from "../../market-action-form-schema";
import { z } from "zod";
import { InfoIcon } from "lucide-react";

export const IPQuantityIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { currentMarketData } = useActiveMarket();

  return (
    <div ref={ref} className={cn("flex flex-col", className)} {...props}>
      {parseRawAmount(marketActionForm.watch("quantity.raw_amount")) !==
        "0" && (
        <SlideUpWrapper>
          <div className="mt-5 flex flex-col gap-1 rounded-xl border border-divider bg-focus px-3 py-2 text-sm text-secondary">
            <div className="flex flex-row items-center gap-1">
              <InfoIcon className="size-4 text-inherit" />
              <div className="text-inherit">INFO</div>
            </div>

            <div>
              You are requesting{" "}
              {Intl.NumberFormat("en-US", {
                style: "decimal",
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
              }).format(
                parseRawAmountToTokenAmount(
                  marketActionForm.watch("quantity.raw_amount"),
                  currentMarketData?.input_token_data?.decimals
                )
              )}{" "}
              {currentMarketData?.input_token_data?.symbol}
            </div>
          </div>
        </SlideUpWrapper>
      )}
    </div>
  );
});
