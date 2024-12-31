"use client";

import React, { useEffect } from "react";
import { create } from "zustand";
import { detect } from "detect-browser";
import { cn } from "@/lib/utils";
import { CustomTokenData } from "@/sdk/types";

interface GlobalState {
  customTokenData: CustomTokenData;
  setCustomTokenData: (customTokenData: CustomTokenData) => void;
}

export const getSubdomain = () => {
  try {
    if (typeof window === "undefined") return undefined;

    let url = window.location.host;
    let subdomain = url.split(".")[0];

    /**
     * @note This custom if else statements are added to handle .vercel.app cases where explicit subdomain can't be added, so ethereum-royco-testnet.vercel.app would work as expected with ethereum.roycoterminal.com
     */
    if (url.includes("ethereum")) {
      subdomain = "ethereum";
    } else if (url.includes("sepolia")) {
      subdomain = "sepolia";
    } else if (url.includes("base")) {
      subdomain = "base";
    } else if (url.includes("arbitrum")) {
      subdomain = "arbitrum";
    } else if (url.includes("plume")) {
      subdomain = "plume";
    } else if (url.includes("corn")) {
      subdomain = "corn";
    } else if (url.includes("testnet")) {
      subdomain = "testnet";
    }

    return subdomain;
  } catch (error) {
    return undefined;
  }
};

export const useGlobalStates = create<GlobalState>((set) => ({
  customTokenData: [],
  setCustomTokenData: (customTokenData: CustomTokenData) =>
    set({ customTokenData }),
}));
