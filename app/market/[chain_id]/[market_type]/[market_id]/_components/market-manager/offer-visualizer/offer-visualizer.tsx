"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { SecondaryLabel } from "../../composables";
import { BarChart } from "lucide-react";
import { OfferListVisualizer } from "./offer-list-visualizer";

export const OfferVisualizer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("w-full", className)} {...props}>
      {/**
       * Depth Chart
       */}
      <div className={cn("border-b border-divider p-6 py-3")}>
        <SecondaryLabel className="flex flex-row items-center space-x-2">
          <BarChart className="h-4 w-4 text-black" />
          <span className="text-sm text-black">Depth Chart</span>
        </SecondaryLabel>
      </div>

      {/**
       * Offer List Visualizer
       */}
      <OfferListVisualizer />
    </div>
  );
});
