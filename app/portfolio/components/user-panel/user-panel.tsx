"use client";

import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import {
  isWalletEditorOpenAtom,
  isEmailEditorOpenAtom,
  userInfoAtom,
  selectedWalletAtom,
} from "@/store/global";
import { useAtom, useAtomValue } from "jotai";
import {
  CheckCheckIcon,
  CheckIcon,
  ChevronRightIcon,
  CopyIcon,
  SquarePlusIcon,
  WalletIcon,
} from "lucide-react";
import { AlertIndicator } from "@/components/common";
import { isAuthenticatedAtom } from "@/store/global";
import { linkWalletAtom } from "@/store/global";
import { CopyWrapper } from "@/app/_containers/wrappers/copy-wrapper";
import { AnimatePresence, motion } from "framer-motion";
import { useAccount } from "wagmi";
import { isAuthEnabledAtom } from "@/store/global";

export const UserPanel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { address } = useAccount();

  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const isAuthEnabled = useAtomValue(isAuthEnabledAtom);
  const userInfo = useAtomValue(userInfoAtom);

  const [isEmailEditorOpen, setIsEmailEditorOpen] = useAtom(
    isEmailEditorOpenAtom
  );
  const [isWalletEditorOpen, setIsWalletEditorOpen] = useAtom(
    isWalletEditorOpenAtom
  );
  const [linkWallet, setLinkWallet] = useAtom(linkWalletAtom);
  const [selectedWallet, setSelectedWallet] = useAtom(selectedWalletAtom);

  const [copied, setCopied] = useState<string | undefined>(undefined);

  if (!isAuthEnabled) {
    return (
      <div ref={ref} {...props} className={cn("", className)}>
        <PrimaryLabel className="text-2xl font-medium text-_primary_">
          Manage Account
        </PrimaryLabel>

        <AlertIndicator className="mt-6">
          Auth is disabled on this site. So you can't manage your account from
          here.
        </AlertIndicator>
      </div>
    );
  }

  return (
    <div ref={ref} {...props} className={cn("", className)}>
      <PrimaryLabel className="text-2xl font-medium text-_primary_">
        Manage Account
      </PrimaryLabel>

      {!isAuthenticated && (
        <div className="mt-6">
          <AlertIndicator>
            Connect & verify ownership of your wallet to manage account
          </AlertIndicator>
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
                  setLinkWallet(undefined);
                  setSelectedWallet(wallet);
                  setIsWalletEditorOpen(true);
                }}
                key={`${userInfo?.id}:${wallet.id}`}
                className="flex flex-row items-center justify-between border-b border-divider py-3 transition-all duration-200 ease-in-out hover:cursor-pointer hover:opacity-60"
              >
                <div className="flex flex-row items-center gap-3">
                  <WalletIcon
                    strokeWidth={1.5}
                    className={cn(
                      "h-8 w-8",
                      wallet.id === address?.toLowerCase()
                        ? "text-success"
                        : "text-_secondary_"
                    )}
                  />

                  <div className="flex flex-col">
                    <div className="flex flex-row items-center gap-2">
                      <SecondaryLabel className="text-base text-_primary_">
                        {wallet.id.slice(0, 6)}...{wallet.id.slice(-4)}
                      </SecondaryLabel>
                      {/* <div
                        onClick={(e) => {
                          e.stopPropagation();

                          if (copied === wallet.id) {
                            return;
                          }

                          navigator.clipboard.writeText(wallet.id);

                          setCopied(wallet.id);
                          setTimeout(() => {
                            setCopied(undefined);
                          }, 3000);
                        }}
                        className="flex flex-row items-center justify-center hover:cursor-pointer"
                      >
                        <AnimatePresence mode="popLayout">
                          {copied === wallet.id ? (
                            <motion.div
                              key="check"
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                            >
                              <CheckCheckIcon className="h-4 w-4 text-success" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="copy"
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                            >
                              <CopyIcon className="h-4 w-4 text-_primary_" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div> */}
                    </div>

                    <SecondaryLabel
                      className={cn(
                        "text-base",
                        wallet.id === address?.toLowerCase()
                          ? "text-_tertiary_"
                          : "text-_tertiary_"
                      )}
                    >
                      {wallet.id === address?.toLowerCase()
                        ? "Active"
                        : "Inactive"}
                    </SecondaryLabel>
                  </div>
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
              setIsWalletEditorOpen(true);
            }}
            className="mt-3 flex flex-row items-center gap-3 transition-all duration-200 ease-in-out hover:cursor-pointer hover:opacity-60"
          >
            <SquarePlusIcon
              strokeWidth={1.5}
              className="h-6 w-6 text-_primary_"
            />

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
