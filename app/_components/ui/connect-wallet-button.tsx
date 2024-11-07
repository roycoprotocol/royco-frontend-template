"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useWeb3Modal, useWeb3ModalState } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import { TriangleAlertIcon } from "lucide-react";
import { SupportedChainMap } from "@/sdk/constants";

export const ConnectWalletButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { open, close } = useWeb3Modal();
  console.log(useWeb3Modal);
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
  const { selectedNetworkId } = useWeb3ModalState();

  /**
   * @description Bug in exported type of selectedNetworkId
   */
  // @ts-ignore
  const isChainSupported =
    // @ts-ignore
    selectedNetworkId && SupportedChainMap[selectedNetworkId];

  return (
    <Button
      ref={ref}
      className={cn(
        "flex h-9 flex-row items-center rounded-full px-4 font-gt",
        isConnected && !isChainSupported && "bg-error",
        className
      )}
      onClick={() => {
        open();
      }}
      {...props}
    >
      {isConnected && !isChainSupported && (
        <div className="mr-2 flex flex-col place-content-center items-center">
          <TriangleAlertIcon className="h-4 w-4" />
        </div>
      )}

      {isConnected && !isChainSupported && (
        <div className="flex h-5 flex-col place-content-center items-center">
          Unsupported Chain
        </div>
      )}

      {isConnected && isChainSupported && (
        <div className="relative mr-2 flex flex-col place-content-center items-center">
          <div className="h-2 w-2 rounded-full bg-success"></div>
          <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-success"></div>
        </div>
      )}

      {isConnected && isChainSupported && (
        <div className="flex h-5 flex-col place-content-center items-center">
          {address && address.slice(0, 6) + "..." + address.slice(-4)}
        </div>
      )}

      {(isDisconnected || isConnecting) && (
        <div className="flex h-5 flex-col place-content-center items-center">
          Connect Wallet
        </div>
      )}
    </Button>
  );
});
