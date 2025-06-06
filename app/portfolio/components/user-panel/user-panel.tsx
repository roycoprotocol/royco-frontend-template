"use client";

import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { cn } from "@/lib/utils";
import React from "react";
import {
  isWalletEditorOpenAtom,
  isEmailEditorOpenAtom,
  userInfoAtom,
  selectedWalletAtom,
} from "@/store/global";
import { useAtom, useAtomValue } from "jotai";
import { ChevronRightIcon, SquarePlusIcon, WalletIcon } from "lucide-react";
import { AlertIndicator } from "@/components/common";
import { isAuthenticatedAtom } from "@/store/global";
import { linkWalletAtom } from "@/store/global";

export const UserPanel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const userInfo = useAtomValue(userInfoAtom);

  const [isEmailEditorOpen, setIsEmailEditorOpen] = useAtom(
    isEmailEditorOpenAtom
  );
  const [isWalletEditorOpen, setIsWalletEditorOpen] = useAtom(
    isWalletEditorOpenAtom
  );
  const [linkWallet, setLinkWallet] = useAtom(linkWalletAtom);
  const [selectedWallet, setSelectedWallet] = useAtom(selectedWalletAtom);

  return (
    <div ref={ref} {...props} className={cn("", className)}>
      <PrimaryLabel className="text-2xl font-medium text-_primary_">
        Manage Account
      </PrimaryLabel>

      {!isAuthenticated && (
        <div className="mt-6">
          <AlertIndicator>Connect wallet to manage account</AlertIndicator>
        </div>
      )}

      {isAuthenticated && (
        <div className="mt-6">
          <PrimaryLabel className="text-base font-medium text-_primary_">
            Email
          </PrimaryLabel>

          <div
            onClick={() => setIsEmailEditorOpen(true)}
            className="mt-6 flex flex-row items-center justify-between rounded-lg transition-all duration-200 ease-in-out hover:cursor-pointer hover:opacity-60"
          >
            <div className="flex flex-col gap-2">
              <SecondaryLabel className="text-base font-medium text-_primary_">
                {userInfo?.email ?? "Add email"}
              </SecondaryLabel>

              <SecondaryLabel
                className={cn(
                  userInfo?.email &&
                    (userInfo?.verified ? "text-success" : "text-error")
                )}
              >
                {userInfo?.email
                  ? userInfo?.verified
                    ? "Verified"
                    : "Unverified"
                  : "Verified Email unlocks Royco Royalty features"}
              </SecondaryLabel>
            </div>

            <div className="flex flex-row items-center justify-end">
              <ChevronRightIcon className="h-6 w-6 text-_primary_" />
            </div>
          </div>

          <PrimaryLabel className="mt-6 text-base font-medium text-_primary_">
            Linked Wallets
          </PrimaryLabel>

          <div className="mt-2 flex flex-col">
            {userInfo?.wallets.map((wallet) => (
              <div
                onClick={() => {
                  setSelectedWallet(wallet);
                  setIsWalletEditorOpen(true);
                }}
                key={`${userInfo?.id}:${wallet.id}`}
                className="flex flex-row items-center justify-between border-b border-divider py-3 transition-all duration-200 ease-in-out hover:cursor-pointer hover:opacity-60"
              >
                <div className="flex flex-row items-center gap-3">
                  <WalletIcon className="h-6 w-6 text-_primary_" />

                  <SecondaryLabel className="text-base text-_primary_">
                    {wallet.id.slice(0, 6)}...{wallet.id.slice(-4)}
                  </SecondaryLabel>
                </div>

                <div className="flex flex-row items-center justify-end">
                  <ChevronRightIcon className="h-6 w-6 text-_primary_" />
                </div>
              </div>
            ))}
          </div>

          <div
            onClick={() => {
              setSelectedWallet(undefined);
              setLinkWallet(true);
              setIsWalletEditorOpen(true);
            }}
            className="mt-3 flex flex-row items-center gap-3 transition-all duration-200 ease-in-out hover:cursor-pointer hover:opacity-60"
          >
            <SquarePlusIcon className="h-6 w-6 text-_primary_" />

            <SecondaryLabel className="text-base text-_primary_">
              Add Wallet
            </SecondaryLabel>
          </div>
        </div>
      )}
    </div>
  );
});

UserPanel.displayName = "UserPanel";
