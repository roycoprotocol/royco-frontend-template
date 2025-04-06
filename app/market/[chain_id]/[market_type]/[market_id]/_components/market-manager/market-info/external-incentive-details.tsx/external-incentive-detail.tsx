import { cn } from "@/lib/utils";
import React, { useMemo } from "react";
import { SlideUpWrapper } from "@/components/animations";
import { SecondaryLabel } from "../../../composables";
import { INFO_ROW_CLASSES } from "../../../composables/base-classes";
import { InfoCard } from "@/components/common/info-card";
import { useActiveMarket } from "../../../hooks";
import { TokenDisplayer } from "@/components/common/token-displayer";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ExternalIncentiveDetails = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { currentMarketData } = useActiveMarket();

  const externalIncentives = useMemo(() => {
    if (!currentMarketData || !currentMarketData.external_incentives) {
      return [];
    }
    return currentMarketData.external_incentives;
  }, [currentMarketData]);

  return (
    <div
      ref={ref}
      className={cn("overflow-hidden rounded-lg border", className)}
      {...props}
    >
      <SecondaryLabel className="px-4 py-3">
        Additional Incentives
      </SecondaryLabel>

      <hr />

      <ScrollArea
        className={cn(
          "flex h-fit max-h-32 flex-col overflow-y-scroll px-4 pt-3"
        )}
      >
        {externalIncentives.map((externalIncentive, index) => (
          <SlideUpWrapper key={externalIncentive.id} delay={0.1 + index * 0.1}>
            <InfoCard.Row className={cn(INFO_ROW_CLASSES, "mb-3")}>
              <InfoCard.Row.Key>
                <div className="flex items-start">
                  <TokenDisplayer
                    className={cn("mt-px")}
                    tokens={[externalIncentive as any]}
                    size={4}
                    symbols={false}
                  />

                  <span className="break-normal text-sm font-medium text-black">
                    {externalIncentive.label || externalIncentive.symbol}
                  </span>
                </div>
              </InfoCard.Row.Key>

              <InfoCard.Row.Value>
                <SecondaryLabel className="break-normal text-right text-secondary">
                  {externalIncentive.value}
                </SecondaryLabel>
              </InfoCard.Row.Value>
            </InfoCard.Row>
          </SlideUpWrapper>
        ))}
      </ScrollArea>
    </div>
  );
});

ExternalIncentiveDetails.displayName = "ExternalIncentiveDetails";
