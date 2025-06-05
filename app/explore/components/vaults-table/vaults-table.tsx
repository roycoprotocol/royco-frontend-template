"use client";

import { LoadingIndicator } from "@/app/_components/common/loading-indicator";
import { SecondaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables/common-labels";
import { PrimaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables/common-labels";
import { cn } from "@/lib/utils";
import { loadableExploreVaultAtom } from "@/store/explore/explore-market";
import { useAtomValue } from "jotai";
import React, { useMemo } from "react";
import { NotFoundWarning } from "../../common/not-found-warning";
import { EnrichedVault } from "royco/api";
import { UsdcCoinIcon } from "@/assets/icons/usdc";
import { Button } from "@/components/ui/button";
import formatNumber from "@/utils/numbers";
import { BtcCoinIcon } from "@/assets/icons/btc";
import { EthCoinIcon } from "@/assets/icons/eth";

interface VaultsCardProps {
  data: EnrichedVault;
}

const getDepositTokenIcon = (symbol: string) => {
  switch (symbol) {
    case "USDC":
      return { color: "#1A6FBB", icon: <UsdcCoinIcon className="h-20 w-20" /> };
    case "BTC":
      return { color: "#DC7F11", icon: <BtcCoinIcon className="h-20 w-20" /> };
    case "ETH":
      return { color: "#0F0E0D", icon: <EthCoinIcon className="h-20 w-20" /> };
    default:
      return { color: "#1A6FBB", icon: <UsdcCoinIcon className="h-20 w-20" /> };
  }
};

const VaultsCard = ({
  data,
  className,
}: VaultsCardProps & { className: string }) => {
  const depositToken = getDepositTokenIcon(data.depositTokens[0]?.symbol);

  return (
    <div
      className={cn(
        "flex flex-col rounded-sm border border-_divider_ bg-_surface_",
        className
      )}
    >
      <div
        className="flex flex-col items-center justify-between gap-5 p-8"
        style={{
          background: `linear-gradient(to bottom left, ${depositToken.color}0D, transparent, transparent)`,
        }}
      >
        {depositToken.icon}

        <PrimaryLabel className="text-2xl font-medium text-_primary_">
          {data.name}
        </PrimaryLabel>

        <SecondaryLabel className="text-sm font-normal text-_secondary_">
          {(data as any).type === "comingSoon" ? (
            "Coming Soon"
          ) : (
            <div className="flex items-center gap-3">
              <span>
                {formatNumber(data.tvlUsd, {
                  type: "currency",
                }) + " TVL"}
              </span>

              <div className="h-3 w-[1px] bg-_divider_" />

              <span style={{ color: depositToken.color }}>
                {"Up to " +
                  formatNumber(data.yieldRate, { type: "percent" }) +
                  " APY"}
              </span>
            </div>
          )}
        </SecondaryLabel>

        {(data as any).type === "comingSoon" ? (
          <Button
            disabled={true}
            variant="outline"
            size="sm"
            className="h-9 rounded-sm border-_divider_ px-4 text-center font-medium opacity-40 sm:h-10"
            style={{ color: depositToken.color }}
          >
            Deposit
          </Button>
        ) : (
          <a href={`/vault/boring/${data.chainId}/${data.vaultAddress}`}>
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-sm border-_divider_ px-4 text-center font-medium sm:h-10"
              style={{ color: depositToken.color }}
            >
              Deposit
            </Button>
          </a>
        )}
      </div>
    </div>
  );
};

export const VaultsTable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const {
    data: propsData,
    isLoading,
    isError,
  } = useAtomValue(loadableExploreVaultAtom);

  const data = useMemo(() => {
    return [
      ...(propsData?.data || []),
      {
        id: "royco-btc",
        type: "comingSoon",
        name: "Royco BTC",
        depositTokens: [
          {
            symbol: "BTC",
          },
        ],
        className: "hidden md:flex",
      },
      {
        id: "royco-eth",
        type: "comingSoon",
        name: "Royco ETH",
        depositTokens: [
          {
            symbol: "ETH",
          },
        ],
        className: "hidden md:flex",
      },
    ];
  }, [propsData]);

  if (isLoading && !propsData) {
    return (
      <div className="w-full">
        <LoadingIndicator />
      </div>
    );
  }

  if (isError || propsData?.count === 0) {
    return (
      <div className="w-full">
        <NotFoundWarning title="No Vaults Found." />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {data.map((vault) => {
        return (
          <VaultsCard
            key={vault.id}
            data={vault as EnrichedVault}
            className={(vault as any).className as string}
          />
        );
      })}
    </div>
  );
});
