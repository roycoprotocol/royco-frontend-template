import { SlideUpWrapper } from "@/components/animations";
import { cn } from "@/lib/utils";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { parseRawAmount, parseRawAmountToTokenAmount } from "royco/utils";
import { MarketActionFormSchema } from "../../market-action-form-schema";
import { z } from "zod";
import { InfoIcon } from "lucide-react";
import { useMarketManager } from "@/store";
import formatNumber from "@/utils/numbers";
import { loadableEnrichedMarketAtom } from "@/store/market";
import { useAtomValue } from "jotai";

export const IPQuantityIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { data: enrichedMarket } = useAtomValue(loadableEnrichedMarketAtom);
  const { userType, offerType, marketStep } = useMarketManager();

  return (
    <div ref={ref} className={cn("flex flex-col", className)} {...props}>
      {parseRawAmount(marketActionForm.watch("quantity.raw_amount")) !==
        "0" && (
        <SlideUpWrapper
          key={`ip-quantity-indicator:${userType}:${offerType}:${marketStep}`}
        >
          <div className="mt-5 flex flex-col gap-1 rounded-xl border border-divider bg-focus px-3 py-2 text-sm text-secondary">
            <div className="flex flex-row items-center gap-1">
              <InfoIcon className="size-4 text-inherit" />
              <div className="text-inherit">INFO</div>
            </div>

            <div>
              You are requesting{" "}
              {formatNumber(
                parseRawAmountToTokenAmount(
                  marketActionForm.watch("quantity.raw_amount"),
                  enrichedMarket?.inputToken.decimals ?? 0
                )
              )}{" "}
              {enrichedMarket?.inputToken.symbol}
            </div>
          </div>
        </SlideUpWrapper>
      )}
    </div>
  );
});
