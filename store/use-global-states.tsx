"use client";

import React, { useEffect } from "react";
import { create } from "zustand";
import { detect } from "detect-browser";
import { cn } from "@/lib/utils";
import { CustomTokenData } from "@/sdk/types";

export type FrontendTag =
  | "ethereum"
  | "base"
  | "arbitrum"
  | "plume"
  | "corn"
  | "testnet"
  | "default"
  | "boyco"
  | "dev"
  | "internal";

export const getFrontendTag = () => {
  try {
    if (typeof window === "undefined") return "default";

    let url = window.location.host;
    let frontendTag = "default";

    /**
     * @note This custom if else statements are added to handle .vercel.app cases where explicit subdomain can't be added, so ethereum-royco-testnet.vercel.app would work as expected with ethereum.roycoterminal.com
     */
    if (url.includes("ethereum")) {
      frontendTag = "ethereum";
    } else if (url.includes("base")) {
      frontendTag = "base";
    } else if (url.includes("arbitrum")) {
      frontendTag = "arbitrum";
    } else if (url.includes("plume")) {
      frontendTag = "plume";
    } else if (url.includes("corn")) {
      frontendTag = "corn";
    } else if (url.includes("testnet") || url.includes("sepolia")) {
      frontendTag = "testnet";
    } else if (url.includes("boyco")) {
      frontendTag = "boyco";
    } else if (url.includes("local")) {
      frontendTag = "dev";
    } else if (url.includes("internal")) {
      frontendTag = "internal";
    }

    return frontendTag as FrontendTag;
  } catch (error) {
    return "default";
  }
};

interface GlobalState {
  customTokenData: CustomTokenData;
  setCustomTokenData: (customTokenData: CustomTokenData) => void;
  frontendTag: FrontendTag;
  setFrontendTag: (frontendTag: FrontendTag) => void;
}

export const useGlobalStates = create<GlobalState>((set) => ({
  customTokenData: [],
  setCustomTokenData: (customTokenData: CustomTokenData) =>
    set({ customTokenData }),
  frontendTag: getFrontendTag(),
  setFrontendTag: (frontendTag: FrontendTag) => set({ frontendTag }),
}));
