import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { MarketType, useMarketManager } from "@/store";
import { RoycoMarketFundingType } from "royco/market";
import { useAccount } from "wagmi";
import { FundingTypeSelector } from "./funding-type-selector";
import { FallMotion, SlideUpWrapper } from "@/components/animations";
import { NULL_ADDRESS, SupportedMarketMap } from "royco/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useVaultBalances } from "royco/hooks";
import { LoadingSpinner } from "@/components/composables";
import { useActiveMarket } from "../../../hooks";

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

  const { currentMarketData } = useActiveMarket();

  const vaultMarkets = useMemo(() => {
    if (!currentMarketData) return [];

    return Object.values(SupportedMarketMap)
      .filter((market) => {
        const [chainId, marketType] = market.id.split("_").map(Number);
        return (
          chainId === currentMarketData.chain_id &&
          market.is_verified === true &&
          marketType === MarketType.vault.value
        );
      })
      .map((market) => {
        const [chainId, _, vaultAddress] = market.id.split("_");
        return {
          name: market.name,
          chain_id: Number(chainId),
          vault_address: vaultAddress,
        };
      });
  }, [SupportedMarketMap, currentMarketData]);

  const { data: vaultBalances, isLoading } = useVaultBalances({
    account: address?.toLowerCase() as string,
    vaults: vaultMarkets.map((vault) => ({
      chain_id: vault.chain_id,
      vault_address: vault.vault_address,
    })),
  });

  const vaults = useMemo(() => {
    if (!vaultBalances) return [];

    return vaultMarkets.filter((vault) => {
      const vaultBalance = vaultBalances.find(
        (v) => v.vault_address === vault.vault_address
      );
      return (
        vaultBalance &&
        vaultBalance.token_id === currentMarketData?.input_token_data.id &&
        BigInt(vaultBalance.raw_amount) > BigInt(0)
      );
    });
  }, [vaultMarkets, vaultBalances, currentMarketData]);

  const selectedVault = vaults.find((v) => v.vault_address === currentValue);

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
            value={selectedVault?.vault_address ?? ""}
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

            <SelectContent className="max-h-[200px] w-full overflow-auto">
              {vaults.map((vault) => (
                <SelectItem
                  className="text-sm"
                  key={vault.vault_address}
                  value={vault.vault_address}
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
