"use client";

import { useGlobalStates } from "@/store";
import React, { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { useUserInfo } from "./use-user-info";
import { useAccount } from "wagmi";
import { isEqual } from "lodash";

export const UserInfoSetter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  const { user, setUser } = useGlobalStates();

  const { address, isConnected } = useAccount();
  const [signInToken, setSignInToken] = useLocalStorage("sign_in_token", null);

  const { data, isLoading, isError, error } = useUserInfo({
    sign_in_token: signInToken,
    account_address: address?.toLowerCase(),
  });

  useEffect(() => {
    if (!isConnected) {
      setUser(null);
    }
  }, [data, isConnected]);

  useEffect(() => {
    if (isConnected && data && !isEqual(data, user)) {
      setUser(data);
    }
  }, [data, isConnected]);

  return null;
});
