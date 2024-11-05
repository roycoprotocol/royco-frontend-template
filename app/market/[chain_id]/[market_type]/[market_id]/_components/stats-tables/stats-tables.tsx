"use client";

import { cn } from "@/lib/utils";
import { MarketStatsView, MarketType, useMarketManager } from "@/store";
import React from "react";
import { OfferTable } from "./offer-table";
import { useAccount } from "wagmi";
import { AlertIndicator } from "@/components/common";
import {
  BASE_PADDING,
  BASE_UNDERLINE,
  SecondaryLabel,
  TertiaryLabel,
} from "../composables";
import { PositionsRecipeTable } from "./positions-recipe-table";
import { useActiveMarket } from "../hooks";
import { PositionsVaultTable } from "./positions-vault-table";

export const StatsTables = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { statsView, setStatsView } = useMarketManager();
  const { address, isConnected } = useAccount();

  const { marketMetadata } = useActiveMarket();

  return (
    <div ref={ref} className={cn("flex w-full flex-col", className)}>
      <div
        className={cn(
          "flex w-full flex-row items-center space-x-2",
          BASE_PADDING,
          "pb-2"
        )}
      >
        <TertiaryLabel
          onClick={() => setStatsView(MarketStatsView.positions.id)}
          className={cn(
            BASE_UNDERLINE.MD,
            "cursor-pointer decoration-transparent transition-all duration-200 ease-in-out hover:text-black",
            statsView === MarketStatsView.positions.id && "decoration-tertiary"
          )}
        >
          POSITIONS
        </TertiaryLabel>

        <TertiaryLabel>/</TertiaryLabel>

        <TertiaryLabel
          onClick={() => setStatsView(MarketStatsView.offers.id)}
          className={cn(
            BASE_UNDERLINE.MD,
            "cursor-pointer decoration-transparent transition-all duration-200 ease-in-out hover:text-black",
            statsView === MarketStatsView.offers.id && "decoration-tertiary"
          )}
        >
          OFFERS
        </TertiaryLabel>
      </div>

      {isConnected ? (
        statsView === MarketStatsView.positions.id ? (
          marketMetadata &&
          marketMetadata.market_type === MarketType.recipe.id ? (
            <PositionsRecipeTable />
          ) : (
            <PositionsVaultTable />
          )
        ) : (
          <OfferTable />
        )
      ) : (
        <AlertIndicator className="w-full grow bg-white">
          Wallet not connected
        </AlertIndicator>
      )}
    </div>
  );
});
