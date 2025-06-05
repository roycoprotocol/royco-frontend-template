"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAccount } from "wagmi";
import { useAtomValue, useAtom, useSetAtom } from "jotai";
import { accountAddressAtom } from "@/store/global/atoms";
import { loadableUserInfoAtom, userInfoAtom } from "@/store/global";
import { isEqual } from "lodash";
import { queryClientAtom } from "jotai-tanstack-query";

export const DataProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { address } = useAccount();

  const queryClient = useAtomValue(queryClientAtom);

  /**
   * @description Server atoms
   */
  const { data: actualUserInfo } = useAtomValue(loadableUserInfoAtom);

  /**
   * @description Local atoms
   */
  const [accountAddress, setAccountAddress] = useAtom(accountAddressAtom);
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);

  /**
   * @description Syncs the account address from wagmi to local atom
   */
  useEffect(() => {
    setAccountAddress(address);
    queryClient.refetchQueries({
      queryKey: ["userInfo"],
    });
  }, [address]);

  /**
   * @description Syncs the user info from the server to local atom
   */
  useEffect(() => {
    if (!isEqual(userInfo, actualUserInfo)) {
      setUserInfo(actualUserInfo ?? null);
    }
  }, [actualUserInfo]);

  return <div ref={ref} className={cn("contents", className)} {...props} />;
});
