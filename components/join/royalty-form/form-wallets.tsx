"use client";

import React, { Fragment, useEffect } from "react";

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
import {
  ErrorAlert,
  FormInputLabel,
  LoadingSpinner,
} from "@/components/composables";
import { Button } from "@/components/ui/button";
import { useAccount, useDisconnect } from "wagmi";
import { useConnectWallet } from "@/app/_components/provider/connect-wallet-provider";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useGlobalStates, useJoin } from "@/store";
import { useSignMessage } from "wagmi";
import { OwnershipProofMessage } from "@/components/constants";
import { isEqual } from "lodash";
import { WalletListTable } from "./wallet-list-table";
import { PlusIcon } from "lucide-react";
import toast from "react-hot-toast";

export const WalletConnectionLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
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
  );
});

export const FormWallets = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    royaltyForm: UseFormReturn<z.infer<typeof RoyaltyFormSchema>>;
  }
>(({ className, royaltyForm, ...props }, ref) => {
  const { address: account_address, isConnected } = useAccount();

  const { disconnect, disconnectAsync } = useDisconnect();

  const { connectWalletModal } = useConnectWallet();

  const {
    signMessage,
    data: dataSignMessage,
    isPending: isPendingSignMessage,
    isSuccess: isSuccessSignMessage,
    isError: isErrorSignMessage,
  } = useSignMessage();

  const addWallet = async () => {
    if (
      isConnected &&
      !!account_address &&
      !royaltyForm
        .watch("wallets")
        .some(
          (wallet) =>
            wallet.account_address.toLowerCase() ===
            account_address.toLowerCase()
        )
    ) {
      royaltyForm.setValue("wallets", [
        ...royaltyForm.getValues("wallets"),
        {
          account_address: account_address.toLowerCase(),
          proof: "",
        },
      ]);
    }
  };

  const addProof = async () => {
    if (
      isSuccessSignMessage === true &&
      !!account_address &&
      royaltyForm
        .watch("wallets")
        .some(
          (wallet) =>
            wallet.account_address.toLowerCase() ===
            account_address.toLowerCase()
        )
    ) {
      const index = royaltyForm
        .watch("wallets")
        .findIndex(
          (wallet) =>
            wallet.account_address.toLowerCase() ===
            account_address.toLowerCase()
        );

      let newWallets = royaltyForm.getValues("wallets");
      newWallets[index].proof = dataSignMessage;
      royaltyForm.setValue("wallets", newWallets);

      await disconnectAsync();
    }
  };

  useEffect(() => {
    addProof();
  }, [dataSignMessage]);

  useEffect(() => {
    addWallet();
  }, [account_address]);

  return (
    <FormField
      control={royaltyForm.control}
      name="wallets"
      render={({ field }) => (
        <FormItem className={cn("", className)}>
          <div className="flex flex-row items-center gap-2">
            <FormInputLabel className="w-fit" label="Proof of funds" />

            <Button
              onClick={async () => {
                await disconnectAsync().then(() => {
                  connectWalletModal();
                });
              }}
              type="button"
              className="flex h-6 w-6 flex-col items-center justify-center rounded-full border border-divider bg-z2 p-0"
            >
              <PlusIcon strokeWidth={1.5} className="h-4 w-4 stroke-black" />
            </Button>
          </div>

          {royaltyForm.watch("wallets").length > 0 && (
            <WalletListTable className="mt-3" royaltyForm={royaltyForm} />
          )}

          <FormDescription className="mt-3">
            Prove ownership of wallets to get priority access & benefits. Total
            assets will be public.&nbsp;
            <span className="font-medium text-black">
              Connect more assets to get in first.
            </span>
          </FormDescription>

          {royaltyForm.watch("wallets").length === 0 && !isConnected && (
            <Fragment>
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
              <WalletConnectionLabel />
            </Fragment>
          )}

          {isConnected &&
            royaltyForm
              .getValues("wallets")
              .some((wallet) => wallet.proof === "") && (
              <Fragment>
                <Button
                  type="button"
                  onClick={() => {
                    signMessage({
                      message: OwnershipProofMessage,
                    });
                  }}
                  className={cn(
                    "mt-5 h-12 w-full rounded-lg font-inter text-sm font-normal shadow-none hover:bg-opacity-90",
                    isPendingSignMessage
                      ? "border border-divider bg-z2"
                      : "bg-mint"
                  )}
                >
                  {isPendingSignMessage ? (
                    <LoadingSpinner className="h-5 w-5" />
                  ) : (
                    "Prove Funds"
                  )}
                </Button>
                <WalletConnectionLabel />
              </Fragment>
            )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
});
