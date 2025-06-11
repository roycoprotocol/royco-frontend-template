"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { FormDescription, FormMessage } from "@/components/ui/form";
import { type UseFormReturn } from "react-hook-form";
import { RoyaltyFormSchema } from "./royalty-form-schema";
import { FormInputLabel } from "@/components/composables";
import { Button } from "@/components/ui/button";
import { useAccount, useDisconnect } from "wagmi";
import { WalletListTable } from "./wallet-list-table";
import { PlusIcon } from "lucide-react";
import { useConnectWallet } from "@/app/_containers/providers/connect-wallet-provider";
import { authenticationStatusAtom, connectedWalletsAtom } from "@/store/global";
import { useAtom } from "jotai";
import { useEffect } from "react";

export const FormWallets = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    royaltyForm: UseFormReturn<z.infer<typeof RoyaltyFormSchema>>;
  }
>(({ className, royaltyForm, ...props }, ref) => {
  const [authenticationStatus, setAuthenticationStatus] = useAtom(
    authenticationStatusAtom
  );
  const [connectedWallets, setConnectedWallets] = useAtom(connectedWalletsAtom);

  const { isConnected } = useAccount();

  const { disconnect, disconnectAsync } = useDisconnect();

  const { connectWalletModal } = useConnectWallet();

  const disconnectWallet = async () => {
    try {
      await disconnectAsync();
      setAuthenticationStatus("unauthenticated");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (authenticationStatus === "authenticated") {
      disconnectWallet();
    }
  }, [authenticationStatus]);

  return (
    <div ref={ref} className={cn("", className)} {...props}>
      <div className="flex flex-row items-center gap-2">
        <FormInputLabel className="w-fit" label="Proof of funds" />

        {connectedWallets.length > 0 && (
          <Button
            onClick={async () => {
              await disconnectAsync();
              setAuthenticationStatus("unauthenticated");

              connectWalletModal();
            }}
            type="button"
            className="flex h-6 w-6 flex-col items-center justify-center rounded-full border border-divider bg-z2 p-0"
          >
            <PlusIcon strokeWidth={1.5} className="h-4 w-4 stroke-black" />
          </Button>
        )}
      </div>

      <WalletListTable className="mt-3" />

      <FormDescription className="mt-3">
        Prove ownership of wallets to get priority access & benefits. Total
        assets will be public.&nbsp;
        <span className="font-medium text-black">
          Connect more assets to get in first.
        </span>
      </FormDescription>

      {connectedWallets.length === 0 && !isConnected && (
        <Button
          type="button"
          onClick={(e) => {
            connectWalletModal();
            e.stopPropagation();
          }}
          className="mt-5 h-12 w-full rounded-lg bg-mint font-inter text-sm font-normal shadow-none hover:bg-opacity-90"
        >
          Connect Wallet
        </Button>
      )}

      <FormMessage />
    </div>
  );
});
