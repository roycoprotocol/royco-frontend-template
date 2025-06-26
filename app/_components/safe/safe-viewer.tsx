"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAtom, useAtomValue } from "jotai";

import { cn } from "@/lib/utils";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import formatNumber from "@/utils/numbers";
import {
  vaultManagerAtom,
  vaultMetadataAtom,
} from "@/store/vault/vault-manager";
import { Input } from "@/components/ui/input";
import { ThemedInput } from "../common/themed-input";
import { Button } from "@/components/ui/button";
import {
  AlertCircleIcon,
  CheckIcon,
  Edit2Icon,
  PlusIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { safeOwnersAtom, safeThresholdAtom } from "@/store/safe/create";
import { isAddress } from "viem";
import { Counter } from "@/components/animate-ui/components/counter";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  type TooltipProviderProps,
  type TooltipProps,
  type TooltipContentProps,
} from "@/components/animate-ui/components/tooltip";
import {
  MarketTransactionType,
  useTransactionManager,
} from "@/store/global/use-transaction-manager";
import { RoycoAbi } from "./safe-abi";
import { useAccount } from "wagmi";

import { loadableEnrichedSafeUserInfoAtom } from "@/store/safe/view";
import { ConnectWalletButton } from "../header/connect-wallet-button/connect-wallet-button";
import { getExplorerUrl, shortAddress } from "royco/utils";

export const SafeViewer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data, isLoading } = useAtomValue(loadableEnrichedSafeUserInfoAtom);

  const { isConnected } = useAccount();

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "flex w-full max-w-xl flex-col border border-divider p-3 md:p-5",
        className
      )}
    >
      <div>Title: View All Safes</div>
      <div>Description: View your safes and manage them.</div>

      {!isConnected ? (
        <ConnectWalletButton className="mt-7 w-full" />
      ) : (
        <div className="mt-7">
          {isLoading ? (
            <div>Loading...</div>
          ) : !data || data?.safes.length === 0 ? (
            <div>No safes found</div>
          ) : (
            <div>
              <div>Sub Title 1: Safes</div>
              <div>Description: List of safes that belong to you.</div>

              {data?.safes.map((safe, index) => (
                <div key={`safe:${safe.id}`} className="mt-5">
                  <div>-- Safe {index + 1} Details --</div>
                  <div>Chain ID: {safe.chainId}</div>
                  <div>
                    Safe's Contract Address: {shortAddress(safe.safeAddress)}
                  </div>
                  <div>
                    Etherscan Link:{" "}
                    <a
                      href={getExplorerUrl({
                        chainId: safe.chainId,
                        type: "address",
                        value: safe.safeAddress,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {shortAddress(safe.safeAddress)}
                    </a>
                  </div>

                  <div className="mt-2">
                    Safe Owners:{" "}
                    {safe.owners.map((owner) => shortAddress(owner)).join(", ")}
                  </div>
                  <div>Safe Threshold: {safe.threshold}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
