import React from "react";
import { cn } from "@/lib/utils";
import { FormInputLabel } from "@/components/composables";
import { MarketFundingType } from "@/store";
import { useMarketManager } from "@/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { FallMotion } from "@/components/animations";
import { TypedRoycoMarketFundingType } from "royco/market";

export const FundingTypeSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    fundingVaultAddress: string;
  }
>(({ className, fundingVaultAddress, ...props }, ref) => {
  const { fundingType, setFundingType } = useMarketManager();

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
              contentClassName="text-left flex flex-col justify-center"
              className="h-full"
            >
              {MarketFundingType[fundingType]
                ? MarketFundingType[fundingType].label
                : "Select Source"}
            </FallMotion>
          </div>
        </SelectTrigger>

        <SelectContent className="w-full">
          {/* <SelectItem
            className="text-sm"
            key={MarketFundingType.wallet.id}
            value={MarketFundingType.wallet.id}

          >
            {MarketFundingType.wallet.label}
          </SelectItem> */}

          {/**
           * @note Below code is for selecting funding vault, it is disabled for now
           */}
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
