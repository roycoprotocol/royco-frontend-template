import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { MarketType } from "@/store";
import { useAccount } from "wagmi";
import { FallMotion, SlideUpWrapper } from "@/components/animations";
import { SupportedMarketMap } from "royco/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useVaultBalances } from "royco/hooks";
import { LoadingSpinner } from "@/components/composables";
import { useActiveMarket } from "../../../../../../hooks";

export const FundingVaultSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    fundingVaultAddress?: string;
    onSelectFundingVaultAddress?: (value: string) => void;
  }
>(
  (
    { className, fundingVaultAddress, onSelectFundingVaultAddress, ...props },
    ref
  ) => {
    const { address } = useAccount();
    const { currentMarketData } = useActiveMarket();

    const validVaultMarketData = useMemo(() => {
      if (!currentMarketData) {
        return [];
      }

      const validVaultMarkets = Object.values(SupportedMarketMap).filter(
        (market) => {
          const [chainId, marketType] = market.id.split("_").map(Number);
          return (
            chainId === currentMarketData.chain_id &&
            market.is_verified === true &&
            marketType === MarketType.vault.value
          );
        }
      );

      const marketData = validVaultMarkets.map((market) => {
        const [chainId, _, marketAddress] = market.id.split("_");
        return {
          name: market.name,
          chain_id: Number(chainId),
          market_id: marketAddress,
        };
      });

      return marketData;
    }, [SupportedMarketMap, currentMarketData]);

    const {
      data: userVaultMarketBalanceData,
      isLoading: isLoadingUserVaultMarketBalanceData,
    } = useVaultBalances({
      account: address?.toLowerCase() as string,
      vaults: validVaultMarketData.map((vault) => ({
        chain_id: vault.chain_id,
        vault_address: vault.market_id,
      })),
    });

    const fundingVaultMarketData = useMemo(() => {
      if (!userVaultMarketBalanceData || !currentMarketData) {
        return [];
      }

      return validVaultMarketData.filter((vault) => {
        const userVaultBalance = userVaultMarketBalanceData.find(
          (v) => v.vault_address === vault.market_id
        );

        if (!userVaultBalance) {
          return false;
        }

        if (
          userVaultBalance.token_id !== currentMarketData.input_token_data.id
        ) {
          return false;
        }

        return BigInt(userVaultBalance.raw_amount) > BigInt(0);
      });
    }, [validVaultMarketData, userVaultMarketBalanceData, currentMarketData]);

    const selectedFundingVault = useMemo(() => {
      const vaultMarketData = fundingVaultMarketData.find(
        (vault) => vault.market_id === fundingVaultAddress
      );

      if (!vaultMarketData) {
        return {
          name: "Select Vault",
          market_id: "",
        };
      }

      return vaultMarketData;
    }, [fundingVaultMarketData, fundingVaultAddress]);

    return (
      <div ref={ref} className={cn("contents", className)} {...props}>
        <Select
          onOpenChange={(open) => {
            return open;
          }}
          onValueChange={(e) => {
            onSelectFundingVaultAddress && onSelectFundingVaultAddress(e);
          }}
          value={selectedFundingVault.market_id}
        >
          <SelectTrigger
            className={cn(
              "mt-2 w-full bg-white py-0 pl-3 pr-2 text-sm font-light text-black"
            )}
          >
            <div className="w-full">
              <FallMotion
                customKey={`market:funding-source-selector:funding-vault-selector:${selectedFundingVault.market_id}`}
                height="2rem"
                motionClassName="flex flex-col items-start"
                contentClassName="text-left"
              >
                {selectedFundingVault.name}
              </FallMotion>
            </div>
          </SelectTrigger>

          <SelectContent className="max-h-[200px] w-full overflow-auto">
            {fundingVaultMarketData.map((vault) => (
              <SelectItem
                key={vault.market_id}
                className="text-sm"
                value={vault.market_id}
              >
                {vault.name}
              </SelectItem>
            ))}
            {isLoadingUserVaultMarketBalanceData && (
              <LoadingSpinner className="h-3 w-3" />
            )}
          </SelectContent>
        </Select>
      </div>
    );
  }
);
