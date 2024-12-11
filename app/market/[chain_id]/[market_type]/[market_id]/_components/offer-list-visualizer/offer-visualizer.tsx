"use client";

import { cn } from "@/lib/utils";
import { MarketOfferVisualizerView, useMarketManager } from "@/store";
import React from "react";
import { useAccount } from "wagmi";
import { AlertIndicator } from "@/components/common";
import {
  BASE_MARGIN_TOP,
  BASE_PADDING,
  BASE_UNDERLINE,
  TertiaryLabel,
} from "../composables";
import { useActiveMarket } from "../hooks";
import { useEnrichedOffers } from "royco/hooks";
import { OfferListVisualizer } from "./offer-list-visualizer";
import { OfferListBook } from "./offer-list-book";

export const OfferVisualizer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { offerVisualizerView, setOfferVisualizerView, userType } =
    useMarketManager();
  const { isConnected } = useAccount();

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
          onClick={() =>
            setOfferVisualizerView(MarketOfferVisualizerView.chart.id)
          }
          className={cn(
            BASE_UNDERLINE.MD,
            "cursor-pointer decoration-transparent transition-all duration-200 ease-in-out hover:text-black",
            offerVisualizerView === MarketOfferVisualizerView.chart.id &&
              "decoration-tertiary"
          )}
        >
          DEPTH CHART
        </TertiaryLabel>

        <TertiaryLabel>/</TertiaryLabel>

        <TertiaryLabel
          onClick={() =>
            setOfferVisualizerView(MarketOfferVisualizerView.book.id)
          }
          className={cn(
            BASE_UNDERLINE.MD,
            "cursor-pointer decoration-transparent transition-all duration-200 ease-in-out hover:text-black",
            offerVisualizerView === MarketOfferVisualizerView.book.id &&
              "decoration-tertiary"
          )}
        >
          BOOK
        </TertiaryLabel>
      </div>

      {isConnected ? (
        offerVisualizerView === MarketOfferVisualizerView.chart.id ? (
          <OfferListVisualizer />
        ) : (
          <OfferListBook className={cn(BASE_MARGIN_TOP.MD)} />
        )
      ) : (
        <AlertIndicator className="w-full grow bg-white">
          Wallet not connected
        </AlertIndicator>
      )}
    </div>
  );
});
