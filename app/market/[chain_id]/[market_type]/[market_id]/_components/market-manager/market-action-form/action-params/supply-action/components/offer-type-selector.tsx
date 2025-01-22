import React, { useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { MarketOfferType, MarketUserType, MarketType } from "@/store";
import { useMarketManager } from "@/store";
import { TypedRoycoMarketOfferType } from "royco/market";
import { useAccount } from "wagmi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useActiveMarket } from "../../../../../hooks";
import { SecondaryLabel, TertiaryLabel } from "../../../../../composables";

export const OfferTypeSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { offerType, setOfferType, userType } = useMarketManager();

  const { currentMarketData, marketMetadata } = useActiveMarket();
  const { address } = useAccount();

  useEffect(() => {
    if (
      marketMetadata.market_type === MarketType.vault.id &&
      userType === MarketUserType.ip.id &&
      address?.toLowerCase() !== currentMarketData.owner?.toLowerCase() &&
      offerType === MarketOfferType.limit.id
    ) {
      setOfferType(MarketOfferType.market.id);
    }
  }, [marketMetadata, userType, address, currentMarketData]);

  const offerTypeOptions = useMemo(() => {
    const options = Object.values(MarketOfferType).map((item) => {
      if (
        userType === MarketUserType.ip.id &&
        item.id === MarketOfferType.market.id
      ) {
        return {
          ...item,
          label: "Fill AP Offers",
        };
      }
      return item;
    });
    return options;
  }, [userType]);

  const isOfferTypeDisabled = (option: {
    label: string;
    id: TypedRoycoMarketOfferType;
  }) => {
    if (marketMetadata.market_type === MarketType.vault.id) {
      if (userType === MarketUserType.ip.id) {
        if (option.id === MarketOfferType.limit.id) {
          if (
            address?.toLowerCase() !== currentMarketData.owner?.toLowerCase()
          ) {
            return true;
          }
        }
      } else {
        // user type is AP
        if (option.id === MarketOfferType.limit.id) {
          if (
            !!currentMarketData &&
            currentMarketData.base_incentive_ids &&
            currentMarketData.base_incentive_ids.length < 1
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  return (
    <div ref={ref} className={cn("", className)} {...props}>
      <div className="flex flex-col gap-3">
        {offerTypeOptions.map((option) => (
          <Card key={option.id} className="rounded-lg">
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => {
                  setOfferType(option.id);
                }}
                disabled={isOfferTypeDisabled(option)}
                className={cn(
                  "flex w-full flex-col items-start gap-1 p-3 outline-none",
                  isOfferTypeDisabled(option) && "opacity-50"
                )}
              >
                <SecondaryLabel className="text-sm font-semibold">
                  {option.label}
                </SecondaryLabel>

                <TertiaryLabel className="text-xs">
                  {option.description}
                </TertiaryLabel>
              </Button>

              {offerType === option.id && (
                <div className="pointer-events-none absolute inset-0 rounded-lg border-2 border-dodger_blue" />
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
});
