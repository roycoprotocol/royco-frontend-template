"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { shortAddress } from "royco/utils";
import { connectedWalletsAtom } from "@/store/global";
import { useAtom } from "jotai";

export const WalletListTable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [connectedWallets, setConnectedWallets] = useAtom(connectedWalletsAtom);

  if (connectedWallets.length === 0) {
    return null;
  }

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "flex flex-col gap-2 text-sm font-normal text-black",
        className
      )}
    >
      {connectedWallets.map((wallet) => {
        return (
          <div className="flex flex-row items-center justify-between">
            <div>{shortAddress(wallet.id)}</div>

            <div>
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                useGrouping: true,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(wallet.balanceUsd)}
            </div>
          </div>
        );
      })}

      <div className="h-px w-full bg-divider" />

      <div className="flex flex-row items-center justify-between">
        <div>Total Assets</div>
        <div>
          {Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            useGrouping: true,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(
            connectedWallets.reduce((acc, curr) => acc + curr.balanceUsd, 0)
          )}
        </div>
      </div>
    </div>
  );
});
