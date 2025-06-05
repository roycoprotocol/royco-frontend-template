"use client";

import {
  PrimaryLabel,
  SecondaryLabel,
  TertiaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { userInfoAtom } from "@/store/global";
import { useAtomValue } from "jotai";
import { useAccount } from "wagmi";
import { EmailEditor } from "./email-editor";
import {
  ChevronRightIcon,
  PlusIcon,
  SquarePlayIcon,
  SquarePlusIcon,
  WalletIcon,
} from "lucide-react";
import { showUserInfoAtom } from "@/store/global";
import { AlertIndicator } from "@/components/common";
import { WalletEditor } from "./wallet-editor";

export const UserPanel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isConnected } = useAccount();

  const showUserInfo = useAtomValue(showUserInfoAtom);

  const userInfo = useAtomValue(userInfoAtom);

  const [isEmailEditorOpen, setIsEmailEditorOpen] = useState(false);
  const [isWalletEditorOpen, setIsWalletEditorOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  return (
    <div ref={ref} {...props} className={cn("", className)}>
      <PrimaryLabel className="text-2xl font-medium text-_primary_">
        Manage Account
      </PrimaryLabel>

      {!showUserInfo && (
        <div className="mt-6">
          <AlertIndicator>Connect wallet to manage account</AlertIndicator>
        </div>
      )}

      {showUserInfo && (
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
                  : "Unlock your Royco Royalty account"}
              </SecondaryLabel>
            </div>

            <div className="flex flex-row items-center justify-end">
              <ChevronRightIcon className="h-6 w-6 text-_primary_" />
            </div>
          </div>

          {/* <PrimaryLabel className="mt-6 text-base font-medium text-_primary_">
            Linked Wallets
          </PrimaryLabel>

          <div className="mt-2 flex flex-col">
            {userInfo?.wallets.map((wallet) => (
              <div
                onClick={() => {
                  setSelectedWallet(wallet.id);
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
              setSelectedWallet(null);
              setIsWalletEditorOpen(true);
            }}
            className="mt-3 flex flex-row items-center gap-3 transition-all duration-200 ease-in-out hover:cursor-pointer hover:opacity-60"
          >
            <SquarePlusIcon className="h-6 w-6 text-_primary_" />

            <SecondaryLabel className="text-base text-_primary_">
              Add Wallet
            </SecondaryLabel>
          </div>

          <EmailEditor
            isOpen={isEmailEditorOpen}
            onOpenChange={setIsEmailEditorOpen}
          />

          <WalletEditor
            isOpen={isWalletEditorOpen}
            onOpenChange={setIsWalletEditorOpen}
            selectedWallet={selectedWallet}
          /> */}
        </div>
      )}
    </div>
  );
});

UserPanel.displayName = "UserPanel";
