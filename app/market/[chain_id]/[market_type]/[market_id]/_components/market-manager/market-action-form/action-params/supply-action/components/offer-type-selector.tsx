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
import { useAtomValue } from "jotai";
import { loadableEnrichedMarketAtom } from "@/store/market/atoms";

export const OfferTypeSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { offerType, setOfferType, userType } = useMarketManager();

  const { data: enrichedMarket } = useAtomValue(loadableEnrichedMarketAtom);

  const { address } = useAccount();

  useEffect(() => {
    if (
      enrichedMarket?.marketType === 1 &&
      userType === MarketUserType.ip.id &&
      address?.toLowerCase() !== enrichedMarket?.owner?.toLowerCase() &&
      offerType === MarketOfferType.limit.id
    ) {
      setOfferType(MarketOfferType.market.id);
    }
  }, [userType, address, enrichedMarket]);

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
    if (enrichedMarket?.marketType === 1) {
      if (userType === MarketUserType.ip.id) {
        if (option.id === MarketOfferType.limit.id) {
          if (address?.toLowerCase() !== enrichedMarket?.owner?.toLowerCase()) {
            return true;
          }
        }
      } else {
        // user type is AP
        if (option.id === MarketOfferType.limit.id) {
          if (
            enrichedMarket &&
            enrichedMarket.vaultMetadata?.baseIncentives &&
            enrichedMarket.vaultMetadata?.baseIncentives.length < 1
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
