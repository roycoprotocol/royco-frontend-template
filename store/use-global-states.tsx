"use client";

import React, { useEffect } from "react";
import { create } from "zustand";
import { detect } from "detect-browser";
import { cn } from "@/lib/utils";
import { CustomTokenData } from "royco/types";
import { UserInfo } from "@/components/user/hooks";

export type TypedUserWallet = {
  account_address: string;
  proof: string;
};

export type UserWallet = TypedUserWallet | null | undefined;

interface GlobalState {
  customTokenData: CustomTokenData;
  setCustomTokenData: (customTokenData: CustomTokenData) => void;
  isUserInfoPaused: boolean;
  setIsUserInfoPaused: (isUserInfoPaused: boolean) => void;
  user: UserInfo | null;
  setUser: (user: UserInfo | null) => void;
}

export const useGlobalStates = create<GlobalState>((set) => ({
  customTokenData: [],
  setCustomTokenData: (customTokenData: CustomTokenData) =>
    set({ customTokenData }),
  isUserInfoPaused: false,
  setIsUserInfoPaused: (isUserInfoPaused: boolean) => set({ isUserInfoPaused }),
  user: null,
  setUser: (user: UserInfo | null) => set({ user }),
}));
