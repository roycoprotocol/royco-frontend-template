"use client";

import React, { useEffect } from "react";

import { cn } from "@/lib/utils";

import { z } from "zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";

import { RoyaltyFormSchema } from "./royality-form-schema";
import { FormInputLabel, LoadingSpinner } from "@/components/composables";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";
import { useConnectWallet } from "@/app/_components/provider/connect-wallet-provider";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useJoin } from "@/store";
import { useSignMessage } from "wagmi";
import { OwnershipProofMessage } from "@/components/constants";

export const FormWallets = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    royaltyForm: UseFormReturn<z.infer<typeof RoyaltyFormSchema>>;
  }
>(({ className, royaltyForm, ...props }, ref) => {
  const { address: account_address, isConnected } = useAccount();

  const { connectWalletModal } = useConnectWallet();
  const { openConnectModal } = useConnectModal();
  const { proofPending, setProofPending, isLoadingProof, setIsLoadingProof } =
    useJoin();

  const checkProofStatus = async () => {
    setIsLoadingProof(true);

    if (isConnected && !!account_address) {
      const isWalletAlreadyAdded = royaltyForm
        .watch("wallets")
        .some(
          (wallet) =>
            wallet.account_address.toLowerCase() ===
            account_address.toLowerCase()
        );

      if (!isWalletAlreadyAdded) {
        setProofPending(true);
      }
    }

    setIsLoadingProof(false);
  };

  const {
    signMessage,
    data: dataSignMessage,
    isPending: isPendingSignMessage,
    isSuccess: isSuccessSignMessage,
    isError: isErrorSignMessage,
  } = useSignMessage({});

  console.log("dataSignMessage", dataSignMessage);

  useEffect(() => {
    checkProofStatus();
  }, [account_address]);

  return (
    <FormField
      control={royaltyForm.control}
      name="wallets"
      render={({ field }) => (
        <FormItem className={cn("", className)}>
          <FormInputLabel className="mb-2" label="Proof of funds" />

          <FormDescription className="mt-2 ">
            Prove ownership of wallets to get priority access & benefits. Total
            assets will be public.&nbsp;
            <span className="font-medium text-black">
              Connect more assets to get in first.
            </span>
          </FormDescription>

          {royaltyForm.watch("wallets").length === 0 && !isConnected && (
            <Button
              type="button"
              onClick={(e) => {
                connectWalletModal();
                e.stopPropagation();
              }}
              className="bg-mint mt-5 h-12 w-full rounded-lg font-inter text-sm font-normal shadow-none hover:bg-opacity-90"
            >
              Connect Wallet
            </Button>
          )}

          {isConnected && proofPending === true && (
            <Button
              type="button"
              onClick={() => {
                signMessage({
                  message: OwnershipProofMessage,
                });
              }}
              className={cn(
                "mt-5 h-12 w-full rounded-lg font-inter text-sm font-normal shadow-none hover:bg-opacity-90",
                isPendingSignMessage ? "border border-divider bg-z2" : "bg-mint"
              )}
            >
              {isPendingSignMessage ? (
                <LoadingSpinner className="h-5 w-5" />
              ) : (
                "Prove Funds"
              )}
            </Button>
          )}

          <FormDescription className="mt-5">
            By connecting your wallet(s) you agree to the{" "}
            <a
              href="https://drive.google.com/file/d/1PQsptyBUtX8v0U1w3mgJ3tup6r0NbhUM/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Use
            </a>{" "}
            &{" "}
            <a
              href="https://drive.google.com/file/d/15ArmJFXqZVE42rTeGyhMcvfRd5KnFK3N/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
});
