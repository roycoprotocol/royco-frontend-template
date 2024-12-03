import React, { useState, useEffect, use } from "react";
import { cn } from "@/lib/utils";
import { MarketUserType, useMarketManager } from "@/store";
import { RoycoMarketFundingType } from "royco/market";
import { useAccount } from "wagmi";
import { FundingTypeSelector } from "./funding-type-selector";
import { FallMotion, SlideUpWrapper } from "@/components/animations";
import { NULL_ADDRESS } from "royco/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useEnrichedPositionsVault } from "royco/hooks";
import { EnrichedPositionsVaultDataType } from "royco/queries";
import { LoadingSpinner } from "@/components/composables";

export const FundingVaultSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    address: string;
    currentValue: string | undefined;
    setCurrentValue: (value: string) => void;
  }
>(({ className, currentValue, setCurrentValue, ...props }, ref) => {
  const { address } = useAccount();
  const { fundingType } = useMarketManager();

  const [pageIndex, setPageIndex] = useState(0);

  const [vaults, setVaults] = useState<EnrichedPositionsVaultDataType[]>([]);

  const { isLoading, data } = useEnrichedPositionsVault({
    chain_id: undefined,
    market_id: undefined,
    account_address: (address?.toLowerCase() as string) ?? "",
    page_index: pageIndex,
    filters: [
      {
        id: "offer_side",
        value: MarketUserType.ap.value,
      },
    ],
  });

  useEffect(() => {
    if (data && data.data && data.count) {
      setVaults((prevVaults) => {
        const newVaults =
          data.data as unknown as EnrichedPositionsVaultDataType[];
        const uniqueVaults = [...prevVaults];

        newVaults.forEach((vault) => {
          const exists = uniqueVaults.some(
            (existing) =>
              existing.underlying_vault_address ===
              vault.underlying_vault_address
          );
          if (!exists) {
            uniqueVaults.push(vault);
          }
        });

        return uniqueVaults;
      });
    }
  }, [data]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      e.currentTarget.clientHeight;
    if (bottom && !isLoading && vaults.length < (data?.count || 0)) {
      setPageIndex((prev) => prev + 1);
    }
  };

  const selectedVault = vaults.find(
    (v) => v.underlying_vault_address === currentValue
  );

  return (
    <div ref={ref} className={cn("contents", className)} {...props}>
      <FundingTypeSelector fundingVaultAddress={currentValue ?? NULL_ADDRESS} />

      {fundingType === RoycoMarketFundingType.vault.id && (
        <SlideUpWrapper
          layout="position"
          layoutId="motion:market:erc4626-vault-selector"
          delay={0.3}
        >
          <Select
            onOpenChange={(open) => {
              return open;
            }}
            onValueChange={(e) => {
              setCurrentValue(e);
            }}
            value={selectedVault?.underlying_vault_address ?? ""}
          >
            <SelectTrigger
              className={cn(
                "mt-2 w-full bg-white py-0 pl-3 pr-2 text-sm font-light text-black"
              )}
            >
              <div className="w-full">
                <FallMotion
                  customKey={`market:funding:funding-vault-selector`}
                  height="2rem"
                  motionClassName="flex flex-col items-start"
                  contentClassName="text-left"
                >
                  {selectedVault?.name || "Select Vault"}
                </FallMotion>
              </div>
            </SelectTrigger>

            <SelectContent
              className="max-h-[200px] w-full overflow-auto"
              onScroll={handleScroll}
            >
              {vaults.map((vault) => (
                <SelectItem
                  className="text-sm"
                  key={vault.id}
                  value={vault.underlying_vault_address as string}
                >
                  {vault.name}
                </SelectItem>
              ))}
              {isLoading && <LoadingSpinner className="h-3 w-3" />}
            </SelectContent>
          </Select>
        </SlideUpWrapper>
      )}
    </div>
  );
});
