import { cn } from "@/lib/utils";
import React, { useMemo } from "react";
import { SlideUpWrapper } from "@/components/animations";
import { SecondaryLabel } from "../../../composables";
import { INFO_ROW_CLASSES } from "../../../composables/base-classes";
import { InfoCard } from "@/components/common/info-card";
import { IncentiveToken } from "../annual-yield-details/incentive-details";
import { useActiveMarket } from "../../../hooks";
import { TokenDisplayer } from "@/components/common/token-displayer";

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
      className={cn("overflow-hidden rounded-lg border px-4 py-3", className)}
      {...props}
    >
      <SecondaryLabel>Additional Rewards</SecondaryLabel>

      <hr className="-mx-4 my-3" />

      <InfoCard
        className={cn("flex h-fit max-h-32 flex-col gap-3 overflow-y-scroll")}
      >
        {externalIncentives.map((externalIncentive, index) => (
          <SlideUpWrapper key={externalIncentive.id} delay={0.1 + index * 0.1}>
            <InfoCard.Row className={cn(INFO_ROW_CLASSES)}>
              <InfoCard.Row.Key>
                <div className="flex items-center">
                  <TokenDisplayer
                    className={cn("")}
                    tokens={[externalIncentive as any]}
                    size={4}
                    symbols={false}
                  />

                  <span className="text-sm font-medium text-black">
                    {externalIncentive.label || externalIncentive.symbol}
                  </span>
                </div>
              </InfoCard.Row.Key>

              <InfoCard.Row.Value>
                <SecondaryLabel className="text-secondary">
                  {externalIncentive.value}
                </SecondaryLabel>
              </InfoCard.Row.Value>
            </InfoCard.Row>
          </SlideUpWrapper>
        ))}
      </InfoCard>
    </div>
  );
});

ExternalIncentiveDetails.displayName = "ExternalIncentiveDetails";
