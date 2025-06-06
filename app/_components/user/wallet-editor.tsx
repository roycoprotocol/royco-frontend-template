"use client";

import {
  authenticationStatusAtom,
  isWalletEditorOpenAtom,
  selectedWalletAtom,
  userInfoAtom,
} from "@/store/global";
import { useAtom, useAtomValue } from "jotai";
import { cn } from "@/lib/utils";
import React, { Fragment, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TriangleAlertIcon, WalletIcon, XIcon } from "lucide-react";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { toast } from "sonner";
import { LoadingCircle } from "@/components/animations/loading-circle";
import { api } from "@/app/api/royco";
import { isAuthenticatedAtom } from "@/store/global";
import { linkWalletAtom } from "@/store/global";
import { useAccount, useDisconnect } from "wagmi";
import { useConnectWallet } from "@/app/_containers/providers/connect-wallet-provider";
import { queryClientAtom } from "jotai-tanstack-query";
import { SuccessIcon } from "@/assets/icons/success";
import formatNumber from "@/utils/numbers";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";

export const WalletEditor = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [step, setStep] = useState<
    "info" | "add" | "delete" | "delete-success"
  >("info");

  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const [authenticationStatus, setAuthenticationStatus] = useAtom(
    authenticationStatusAtom
  );

  const userInfo = useAtomValue(userInfoAtom);
  const queryClient = useAtomValue(queryClientAtom);
  const [isOpen, onOpenChange] = useAtom(isWalletEditorOpenAtom);

  const { address } = useAccount();
  const { disconnect, disconnectAsync } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { connectWalletModal } = useConnectWallet();

  const [linkWallet, setLinkWallet] = useAtom(linkWalletAtom);
  const [selectedWallet, setSelectedWallet] = useAtom(selectedWalletAtom);

  const [isAddingWallet, setIsAddingWallet] = useState(false);
  const [isDeletingWallet, setIsDeletingWallet] = useState(false);

  const addWallet = async () => {
    setIsAddingWallet(true);

    try {
      await disconnectAsync();
      setAuthenticationStatus("unauthenticated");

      onOpenChange(false);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      try {
        connectWalletModal();
      } catch (error) {
        toast.error("Error connecting wallet.");
      }
    } catch (error) {
      toast.error(
        (error as any)?.response?.data?.error?.message ?? "Error adding wallet"
      );
    }

    setIsAddingWallet(false);
  };

  const deleteWallet = async () => {
    setIsDeletingWallet(true);

    try {
      if (selectedWallet) {
        await api.userControllerEditUser({
          deleteWallet: selectedWallet.id,
        });

        if (address?.toLowerCase() === selectedWallet.id.toLowerCase()) {
          await disconnectAsync();
          setAuthenticationStatus("unauthenticated");
        }

        setStep("delete-success");

        queryClient.refetchQueries({
          queryKey: ["userInfo"],
        });
      }
    } catch (error) {
      toast.error(
        (error as any)?.response?.data?.error?.message ?? "Error adding wallet"
      );
    }

    setIsDeletingWallet(false);
  };

  useEffect(() => {
    if (isOpen) {
      if (linkWallet) {
        setStep("add");
      } else {
        setStep("info");
      }
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {isOpen && (
        <DialogContent
          className={cn("p-6 sm:max-w-[500px]", className)}
          ref={ref}
          {...props}
        >
          <Button
            type="button"
            variant="transparent"
            className="absolute right-3 top-3"
            onClick={() => onOpenChange(false)}
          >
            <XIcon className="h-6 w-6 text-_secondary_" />
          </Button>

          <DialogHeader>
            <DialogTitle>
              {step === "info" && (
                <Fragment>
                  <WalletIcon className="h-10 w-10 text-_primary_" />

                  <PrimaryLabel className="mt-6 text-2xl text-_primary_">
                    Linked Wallet
                  </PrimaryLabel>
                </Fragment>
              )}

              {step === "add" && (
                <Fragment>
                  <WalletIcon className="h-10 w-10 text-_primary_" />

                  <PrimaryLabel className="mt-6 text-2xl text-_primary_">
                    Add Wallet
                  </PrimaryLabel>
                </Fragment>
              )}

              {step === "delete" && (
                <Fragment>
                  <TriangleAlertIcon className="h-10 w-10 text-_primary_" />

                  <PrimaryLabel className="mt-6 text-2xl text-_primary_">
                    Delete Wallet
                  </PrimaryLabel>
                </Fragment>
              )}

              {step === "delete-success" && (
                <Fragment>
                  <SuccessIcon className="h-10 w-10 text-success" />

                  <PrimaryLabel className="mt-6 text-2xl text-_primary_">
                    Wallet Deleted
                  </PrimaryLabel>
                </Fragment>
              )}
            </DialogTitle>
          </DialogHeader>

          <DialogDescription>
            {step === "info" && (
              <Fragment>
                <PrimaryLabel className="text-_secondary_">
                  {selectedWallet?.id.slice(0, 6)}...
                  {selectedWallet?.id.slice(-4)}
                </PrimaryLabel>

                <div className="mt-3 grid grid-cols-2 justify-between text-base text-_secondary_">
                  <div className="text-left ">Balance</div>

                  <div className="text-right">
                    {formatNumber(selectedWallet?.balanceUsd ?? 0, {
                      type: "currency",
                    })}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button
                    size="fixed"
                    type="button"
                    onClick={() => onOpenChange(false)}
                    variant="outline"
                  >
                    Close
                  </Button>

                  <Button
                    size="fixed"
                    type="button"
                    onClick={() => setStep("delete")}
                    variant="outline"
                    className="bg-error text-white"
                  >
                    Delete Wallet
                  </Button>
                </div>
              </Fragment>
            )}

            {step === "delete" && (
              <Fragment>
                <SecondaryLabel className="mt-3 text-_secondary_">
                  Your wallet will be deleted immediately and it will no longer
                  be associated with your royalty account. This action cannot be
                  undone.
                </SecondaryLabel>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button
                    size="fixed"
                    type="button"
                    onClick={() => onOpenChange(false)}
                    variant="outline"
                    className="w-full"
                  >
                    Cancel
                  </Button>

                  <Button
                    aria-disabled={isDeletingWallet}
                    disabled={isDeletingWallet}
                    size="fixed"
                    type="button"
                    onClick={deleteWallet}
                    variant="outline"
                    className="bg-error text-white"
                  >
                    Yes, delete it
                  </Button>
                </div>
              </Fragment>
            )}

            {step === "add" && (
              <Fragment>
                <SecondaryLabel className="mt-3 text-_secondary_">
                  The wallet you are adding will be linked to your current
                  royalty account. If it is already linked with any existing
                  royalty account, it will be automatically unlinked from the
                  previous account. This action cannot be undone.
                </SecondaryLabel>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button
                    size="fixed"
                    type="button"
                    onClick={() => onOpenChange(false)}
                    variant="outline"
                    className="w-full"
                  >
                    Cancel
                  </Button>

                  <Button
                    aria-disabled={isAddingWallet}
                    disabled={isAddingWallet}
                    size="fixed"
                    type="button"
                    onClick={addWallet}
                    variant="outline"
                    className="bg-success text-white"
                  >
                    {isAddingWallet ? <LoadingCircle /> : "Add Wallet"}
                  </Button>
                </div>
              </Fragment>
            )}

            {step === "delete-success" && (
              <Fragment>
                <SecondaryLabel className="mt-3 text-_secondary_">
                  The selected wallet has been deleted from your royalty
                  account.
                </SecondaryLabel>

                <div className="mt-6 grid grid-cols-1 gap-3">
                  <Button
                    size="fixed"
                    type="button"
                    onClick={() => onOpenChange(false)}
                    variant="outline"
                    className="bg-_primary_ text-white"
                  >
                    Close
                  </Button>
                </div>
              </Fragment>
            )}
          </DialogDescription>
        </DialogContent>
      )}
    </Dialog>
  );
});

WalletEditor.displayName = "WalletEditor";
