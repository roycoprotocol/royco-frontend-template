import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { cn } from "@/lib/utils";
import React from "react";
import { TokenDisplayer } from "@/components/common/token-displayer";
import formatNumber from "@/utils/numbers";
import { GradientText } from "./gradient-text";

interface AnnualYieldAssumptionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  incentives: any[];
  showFdv?: boolean;
}

export const AnnualYieldAssumption = React.forwardRef<
  HTMLDivElement,
  AnnualYieldAssumptionProps
>(({ className, incentives, showFdv = true, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={cn("divide-y divide-_divider_", className)}
    >
      {incentives.map((item, index) => {
        return (
          <div
            key={item.id}
            className={cn(
              "flex w-full items-start justify-between py-2",
              index === 0 && "pt-0",
              index === incentives.length - 1 && "pb-0"
            )}
          >
            <div className="flex items-start gap-3">
              <TokenDisplayer size={6} tokens={[item]} symbols={false} />

              <div>
                <PrimaryLabel className="text-base font-normal text-_primary_">
                  {item.name}
                </PrimaryLabel>

                {showFdv && (
                  <SecondaryLabel className="mt-1 text-sm font-normal text-_secondary_">
                    {formatNumber(item.fdv, {
                      type: "currency",
                    }) + " FDV"}
                  </SecondaryLabel>
                )}
              </div>
            </div>

            <PrimaryLabel className="text-base font-normal">
              <GradientText>
                {formatNumber(item.yieldRate, {
                  type: "percent",
                })}
              </GradientText>
            </PrimaryLabel>
          </div>
        );
      })}
    </div>
  );
});
