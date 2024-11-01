import React from "react";
import { cn } from "@/lib/utils";
import { InputVaultSelector } from "./input-vault-selector";
import { useMarketManager } from "@/store";
import { RoycoMarketFundingType } from "@/sdk/market";
import { useAccount } from "wagmi";
import { FundingTypeSelector } from "./funding-type-selector";
import { SlideUpWrapper } from "@/components/animations";
import { useActiveMarket } from "../../../hooks";
import { NULL_ADDRESS } from "@/sdk/constants";

export const FundingVaultSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    address: string;
    currentValue: string | undefined;
    setCurrentValue: (value: string) => void;
  }
>(({ className, currentValue, setCurrentValue, ...props }, ref) => {
  const { address } = useAccount();
  const { fundingType, setFundingType } = useMarketManager();

  const { currentMarketData, marketMetadata } = useActiveMarket();

  return (
    <div ref={ref} className={cn("contents", className)} {...props}>
      <FundingTypeSelector fundingVaultAddress={currentValue ?? NULL_ADDRESS} />

      {fundingType === RoycoMarketFundingType.vault.id && (
        <SlideUpWrapper
          layout="position"
          layoutId="motion:market:erc4626-vault-selector"
          delay={0.3}
        >
          <InputVaultSelector
            containerClassName="mt-2"
            currentValue={currentValue ?? ""}
            setCurrentValue={setCurrentValue}
          />
        </SlideUpWrapper>
      )}
    </div>
  );
});
