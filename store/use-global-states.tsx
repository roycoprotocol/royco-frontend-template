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
  if (typeof window === "undefined") return undefined;

  const subdomain = window.location.host.split(".")[0];

  return subdomain;
};

export const useGlobalStates = create<GlobalState>((set) => ({
  customTokenData: [],
  setCustomTokenData: (customTokenData: CustomTokenData) =>
    set({ customTokenData }),
}));
