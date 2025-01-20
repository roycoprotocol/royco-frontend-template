import React, { useMemo } from "react";
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
import {
  RoycoMarketFundingType,
  TypedRoycoMarketFundingType,
} from "royco/market";
import { FundingVaultSelector } from "./funding-vault-selector";

export const FundingSourceSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    fundingVaultAddress?: string;
    onSelectFundingVaultAddress?: (fundingVaultAddress: string) => void;
  }
>(
  (
    { className, fundingVaultAddress, onSelectFundingVaultAddress, ...props },
    ref
  ) => {
    const { fundingType, setFundingType } = useMarketManager();

    const fundingTypeOptions = useMemo(() => {
      return Object.values(MarketFundingType);
    }, []);

    const labelFundingType = useMemo(() => {
      if (MarketFundingType[fundingType]) {
        return MarketFundingType[fundingType].label;
      }

      return "Select Source";
    }, [fundingType]);

    return (
      <div ref={ref} className={cn("", className)} {...props}>
        <FormInputLabel size="sm" label="Source Funds From" />

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
              "mt-2 bg-white py-0 pl-3 pr-2 text-sm font-light text-black"
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
                {labelFundingType}
              </FallMotion>
            </div>
          </SelectTrigger>

          <SelectContent className="w-full">
            {fundingTypeOptions.map((option) => (
              <SelectItem className="text-sm" key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {fundingType === RoycoMarketFundingType.vault.id && (
          <FundingVaultSelector
            fundingVaultAddress={fundingVaultAddress}
            onSelectFundingVaultAddress={onSelectFundingVaultAddress}
          />
        )}
      </div>
    );
  }
);
