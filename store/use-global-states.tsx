"use client";

import React, { useEffect } from "react";
import { create } from "zustand";
import { detect } from "detect-browser";
import { cn } from "@/lib/utils";
import { CustomTokenDataElementType } from "royco/types";
import { UserInfo } from "@/components/user/hooks";

export type TypedUserWallet = {
  account_address: string;
  proof: string;
};

export type UserWallet = TypedUserWallet | null | undefined;

export type CustomTokenDataElement = CustomTokenDataElementType & {
  allocation?: string;
};
export type CustomTokenData = Array<CustomTokenDataElement>;

interface GlobalState {
  customTokenData: CustomTokenData;
  setCustomTokenData: (customTokenData: CustomTokenData) => void;
  isUserInfoPaused: boolean;
  setIsUserInfoPaused: (isUserInfoPaused: boolean) => void;
  user: UserInfo | null;
  setUser: (user: UserInfo | null) => void;
}

export const useGlobalStates = create<GlobalState>((set) => ({
  customTokenData: [
    {
      token_id: process.env.NEXT_PUBLIC_B_DEFAULT_TOKEN_ID!,
      price: process.env.NEXT_PUBLIC_B_DEFAULT_TOKEN_PRICE!,
      fdv: process.env.NEXT_PUBLIC_B_DEFAULT_TOKEN_FDV!,
      total_supply: process.env.NEXT_PUBLIC_B_DEFAULT_TOKEN_TOTAL_SUPPLY!,
    },
  ],
  setCustomTokenData: (customTokenData: CustomTokenData) =>
    set({ customTokenData }),
  isUserInfoPaused: false,
  setIsUserInfoPaused: (isUserInfoPaused: boolean) => set({ isUserInfoPaused }),
  user: null,
  setUser: (user: UserInfo | null) => set({ user }),
}));
