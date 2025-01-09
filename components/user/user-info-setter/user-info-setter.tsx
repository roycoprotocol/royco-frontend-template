"use client";

import { useGlobalStates, useJoin } from "@/store";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useUserInfo } from "../hooks";
import { isEqual } from "lodash";

export const UserInfoSetter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { userInfo, setUserInfo } = useGlobalStates();
  const { address, isConnected } = useAccount();
  const { cachedWallet, setCachedWallet } = useGlobalStates();

  const { isUserInfoPaused } = useGlobalStates();

  const propsUserInfo = useUserInfo({
    account_address: address?.toLowerCase(),
    proof: cachedWallet?.proof,
  });

  useEffect(() => {
    if (isUserInfoPaused) {
      return;
    }

    if (!isEqual(userInfo, propsUserInfo.data)) {
      if (propsUserInfo.data === null || propsUserInfo.data === undefined) {
        setUserInfo(null);
      } else {
        setUserInfo(propsUserInfo.data);
      }
    }
  }, [propsUserInfo.data, cachedWallet, isUserInfoPaused]);

  return null;
});
