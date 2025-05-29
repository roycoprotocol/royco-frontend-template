"use client";

import { cn } from "@/lib/utils";
import { sessionAtom } from "@/store/global";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAtomValue } from "jotai";
import React, { useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";

export const Disconnector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { address, isConnected, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const session = useAtomValue(sessionAtom);

  const { connectModalOpen } = useConnectModal();

  const autoDisconnect = () => {
    if (
      address &&
      isConnected &&
      connectModalOpen === false &&
      session === null
    ) {
      disconnect();
    }
  };

  useEffect(() => {
    autoDisconnect();
  }, [address, connectModalOpen, session]);

  return <div ref={ref} {...props} className={cn("contents", className)}></div>;
});
