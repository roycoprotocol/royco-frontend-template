import React from "react";
import { cn } from "@/lib/utils";
import {
  FormInputLabel,
  LoadingSpinner,
  SpringNumber,
} from "@/components/composables";
import {
  MarketFundingType,
  MarketOfferType,
  MarketVaultIncentiveAction,
} from "@/store";
import { useMarketManager } from "@/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { FallMotion } from "@/components/animations";
import {
  RoycoMarketFundingType,
  TypedRoycoMarketFundingType,
  TypedRoycoMarketVaultIncentiveAction,
} from "@/sdk/market";
import { useAccountBalance, useVaultBalance } from "@/sdk/hooks";
import { useActiveMarket } from "../../../hooks";
import { useAccount } from "wagmi";
import { NULL_ADDRESS } from "@/sdk/constants";
import { TertiaryLabel } from "../../../composables";

export const FundingTypeSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    fundingVaultAddress: string;
  }
>(({ className, fundingVaultAddress, ...props }, ref) => {
  const { address } = useAccount();
  const { fundingType, setFundingType } = useMarketManager();
  const { currentMarketData, marketMetadata } = useActiveMarket();

  return (
    <div ref={ref} className={cn("", className)} {...props}>
      <FormInputLabel
        size="sm"
        label="Source"
        info="The source you want to use for funding the offer"
      ></FormInputLabel>

      <Select
        onOpenChange={(open) => {
          return open;
        }}
        onValueChange={(e) => {
          setFundingType(e as TypedRoycoMarketFundingType);
        }}
        value={fundingType}
      >
        <SelectTrigger
          className={cn(
            "mt-2 w-full bg-white py-0 pl-3 pr-2 text-sm font-light text-black"
          )}
        >
          <div className="w-full">
            <FallMotion
              customKey={`market:funding:funding-type-selector:${fundingType}`}
              height="2rem"
              motionClassName="flex flex-col items-start"
              contentClassName="text-left"
            >
              {MarketFundingType[fundingType]
                ? MarketFundingType[fundingType].label
                : "Select Source"}
            </FallMotion>
          </div>
        </SelectTrigger>

        <SelectContent className="w-full">
          {Object.values(MarketFundingType).map((option) => (
            <SelectItem className="text-sm" key={option.id} value={option.id}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
});
