import React, { useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { FormInputLabel } from "@/components/composables";
import { MarketOfferType, MarketUserType, MarketType } from "@/store";
import { useMarketManager } from "@/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { FallMotion } from "@/components/animations";
import { TypedRoycoMarketOfferType } from "@/sdk/market";
import { useActiveMarket } from "../hooks";
import { useAccount } from "wagmi";

export const OfferTypeSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { offerType, setOfferType, userType } = useMarketManager();

  const { currentMarketData, marketMetadata } = useActiveMarket();
  const { address: walletAddress } = useAccount();

  const isWalletVaultIP = useMemo(() => {
    return (
      (currentMarketData &&
        currentMarketData.market_type === MarketType.vault.value &&
        walletAddress &&
        currentMarketData.owner &&
        walletAddress.toLowerCase() ===
          currentMarketData.owner.toLowerCase()) ??
      false
    );
  }, [currentMarketData, walletAddress]);

  const isMarketVault = useMemo(() => {
    return (
      (currentMarketData &&
        currentMarketData.market_type === MarketType.vault.value) ??
      false
    );
  }, [currentMarketData]);

  useEffect(() => {
    if (
      // isMarketVault &&
      // !isWalletVaultIP &&

      marketMetadata.market_type === MarketType.vault.id &&
      userType === MarketUserType.ip.id &&
      walletAddress !== currentMarketData.owner &&
      offerType === MarketOfferType.limit.id
    ) {
      setOfferType(MarketOfferType.market.id);
    }
  }, [isWalletVaultIP]);

  return (
    <div ref={ref} className={cn("", className)} {...props}>
      <FormInputLabel
        size="sm"
        label="Offer Type"
        info="The type of offer you want to place"
      />

      <Select
        onOpenChange={(open) => {
          return open;
        }}
        onValueChange={(e) => {
          if (
            // isMarketVault &&
            // !isWalletVaultIP &&
            marketMetadata.market_type === MarketType.vault.id &&
            userType === MarketUserType.ip.id &&
            walletAddress !== currentMarketData.owner &&
            e === MarketOfferType.limit.id
          ) {
            return;
          }

          setOfferType(e as TypedRoycoMarketOfferType);
        }}
        value={offerType}
      >
        <SelectTrigger
          className={cn(
            "mt-2 w-full bg-white py-0 pl-3 pr-2 text-sm font-light text-black"
          )}
        >
          <div className="w-full">
            <FallMotion
              customKey={`market:offer-type-selector:${offerType}`}
              height="2rem"
              motionClassName="flex flex-col items-start"
              contentClassName="text-left"
            >
              {MarketOfferType[offerType]
                ? userType === MarketUserType.ip.id &&
                  offerType === MarketOfferType.market.id
                  ? "Fill AP Offers"
                  : MarketOfferType[offerType].label
                : "Select Offer Type"}
            </FallMotion>
          </div>
        </SelectTrigger>

        <SelectContent className="w-full">
          {Object.values(MarketOfferType).map((option) => (
            <SelectItem
              disabled={
                // isMarketVault &&
                // !isWalletVaultIP &&
                marketMetadata.market_type === MarketType.vault.id &&
                userType === MarketUserType.ip.id &&
                walletAddress !== currentMarketData.owner &&
                option.id === MarketOfferType.limit.id
              }
              className="text-sm"
              key={option.id}
              value={option.id}
            >
              {userType === MarketUserType.ip.id &&
              option.id === MarketOfferType.market.id
                ? "Fill AP Offers"
                : option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
});
