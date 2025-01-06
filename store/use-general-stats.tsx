"use client";

import React, { useEffect } from "react";
import { create } from "zustand";
import { detect } from "detect-browser";
import { cn } from "@/lib/utils";
import { restrictedCountries } from "@/app/_components/provider/connect-wallet-provider";
import { useDisconnect } from "wagmi";
import { useAccount } from "wagmi";
import { getFrontendTag } from "./use-global-states";

export const BrowserDetector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  useEffect(() => {
    const browser = detect();

    if (browser) {
      if (browser.name === "safari" || browser.name === "ios-webview") {
        useGeneralStats.getState().setBrowserType("webkit");
      }
    }
  }, []);

  return <div ref={ref} className={cn("contents", className)} {...props} />;
});

export const GeoDetector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { disconnect } = useDisconnect();

  useEffect(() => {
    const checkRestriction = async () => {
      const frontendTag =
        typeof window !== "undefined" ? getFrontendTag() : "default";

      const nonGeoBlockedFrontendTags = ["dev", "testnet", "internal"];

      if (!nonGeoBlockedFrontendTags.includes(frontendTag)) {
        try {
          const response = await fetch("https://freeipapi.com/api/json/");
          const data = await response.json();

          if (
            !!data.countryCode &&
            restrictedCountries.includes(data.countryCode)
          ) {
            setTimeout(() => {
              disconnect();
            }, 2000);
          }
        } catch (e) {
          console.log(e);
        }
      }
    };

    checkRestriction();
  }, []);

  return <div ref={ref} className={cn("contents", className)} {...props} />;
});

interface GeneralStatsState {
  browserType: string | null;
  setBrowserType: (exploreView: string) => void;
}

export const useGeneralStats = create<GeneralStatsState>((set) => ({
  browserType: null,
  setBrowserType: (browserType: string) => set({ browserType }),
}));
