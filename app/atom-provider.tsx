"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAccount } from "wagmi";
import { useSetAtom } from "jotai";
import { accountAddressAtom } from "@/store/global/atoms";

export const AtomProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { address } = useAccount();

  const setAccountAddress = useSetAtom(accountAddressAtom);

  useEffect(() => {
    setAccountAddress(address);
  }, [address]);

  return <div ref={ref} className={cn("contents", className)} {...props} />;
});
