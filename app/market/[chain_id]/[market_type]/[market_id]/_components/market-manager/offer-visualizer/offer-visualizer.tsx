"use client";

import { cn } from "@/lib/utils";
import { MarketOfferVisualizerView, useMarketManager } from "@/store";
import React from "react";
import { BASE_MARGIN_TOP, SecondaryLabel } from "../../composables";
import { BarChart } from "lucide-react";
import { OfferListBook } from "./offer-list-book";
import { OfferListVisualizer } from "./offer-list-visualizer";

export const OfferVisualizer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { offerVisualizerView } = useMarketManager();

  return (
    <div ref={ref} className={cn("w-full", className)}>
      <div className={cn("border-b border-divider p-6 py-3")}>
        <SecondaryLabel className="flex flex-row items-center space-x-2">
          <BarChart className="h-4 w-4 text-black" />
          <span className="text-sm text-black">Depth Chart</span>
        </SecondaryLabel>
      </div>

      {offerVisualizerView === MarketOfferVisualizerView.chart.id ? (
        <OfferListVisualizer />
      ) : (
        <OfferListBook className={cn(BASE_MARGIN_TOP.MD)} />
      )}
    </div>
  );
});
