"use client";

import { cn } from "@/lib/utils";
import { MarketStatsView, MarketType, useMarketManager } from "@/store";
import React from "react";
import { useAccount } from "wagmi";
import { AlertIndicator } from "@/components/common";
import { useActiveMarket } from "../../hooks";
import { PositionsRecipeManager } from "./positions-recipe-manager";
import { PositionsVaultManager } from "./positions-vault-manager";
import { ListPlusIcon } from "lucide-react";
import { OffersManager } from "./offers-manager";
import { PositionsBoycoManager } from "./positions-boyco-manager";

export const StatsTables = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { statsView, setStatsView, userType } = useMarketManager();
  const { address, isConnected } = useAccount();

  const { marketMetadata, currentMarketData } = useActiveMarket();

  return (
    <div ref={ref} className={cn("flex w-full flex-col", className)}>
      <div
        className={cn(
          "flex w-full flex-row items-center space-x-10 border-b border-divider px-6 py-3 font-light"
        )}
      >
        <div
          onClick={() => setStatsView(MarketStatsView.positions.id)}
          className={cn(
            "flex cursor-pointer flex-row items-center gap-2 text-secondary transition-all duration-200 ease-in-out hover:opacity-80",
            statsView === MarketStatsView.positions.id
              ? "text-black"
              : "text-tertiary"
          )}
        >
          <svg
            strokeWidth={1.5}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-list-check h-5 w-5"
          >
            <path d="M11 18H3" />
            <path d="m15 18 2 2 4-4" />
            <path d="M16 12H3" />
            <path d="M16 6H3" />
          </svg>{" "}
          <div className="">Positions</div>
        </div>

        <div
          onClick={() => setStatsView(MarketStatsView.offers.id)}
          className={cn(
            "flex cursor-pointer flex-row items-center gap-2 text-secondary transition-all duration-200 ease-in-out hover:opacity-80",
            statsView === MarketStatsView.offers.id
              ? "text-black"
              : "text-tertiary"
          )}
        >
          <ListPlusIcon strokeWidth={1.5} className="h-5 w-5" />{" "}
          <div className="">Offers</div>
        </div>
      </div>

      {isConnected ? (
        statsView === MarketStatsView.positions.id ? (
          marketMetadata &&
          marketMetadata.market_type === MarketType.recipe.id ? (
            currentMarketData?.category === "boyco" ? (
              <PositionsBoycoManager />
            ) : (
              <PositionsRecipeManager />
            )
          ) : (
            <PositionsVaultManager />
          )
        ) : (
          <OffersManager />
        )
      ) : (
        <AlertIndicator className="w-full grow bg-white">
          Wallet not connected
        </AlertIndicator>
      )}
    </div>
  );
});
