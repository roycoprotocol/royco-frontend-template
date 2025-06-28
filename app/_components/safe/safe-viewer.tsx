"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAtom, useAtomValue } from "jotai";

import { cn } from "@/lib/utils";
import {
  PrimaryLabel,
  SecondaryLabel,
  TertiaryLabel,
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
  CircleIcon,
  Dot,
  DotIcon,
  Edit2Icon,
  ExternalLinkIcon,
  TriangleAlertIcon,
  LinkIcon,
  PlusIcon,
  SquareArrowOutUpRightIcon,
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
import { TokenDisplayer } from "../common/token-displayer";

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
              <SecondaryLabel>SAFES</SecondaryLabel>

              {data?.safes.map((safe, safeIndex) => (
                <div key={`safe:${safe.id}`} className="mt-3">
                  <div className="flex flex-row items-center gap-2">
                    <TertiaryLabel>Safe {safeIndex + 1}</TertiaryLabel>

                    <CircleIcon className="h-1 w-1 fill-_tertiary_ text-_tertiary_ opacity-50" />

                    <TertiaryLabel>
                      {shortAddress(safe.safeAddress)}
                    </TertiaryLabel>

                    <CircleIcon className="h-1 w-1 fill-_tertiary_ text-_tertiary_ opacity-50" />

                    <a
                      href={getExplorerUrl({
                        chainId: safe.chainId,
                        type: "address",
                        value: safe.safeAddress,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-_tertiary_ transition-all duration-200 ease-in-out hover:opacity-80"
                    >
                      <ExternalLinkIcon strokeWidth={1.5} className="h-3 w-3" />
                    </a>
                  </div>

                  <div className="mt-3 flex flex-col">
                    {safe.tokenizedPositions.length === 0 && (
                      <div className="flex flex-row items-center gap-2 border-b border-_divider_ pb-3">
                        <TriangleAlertIcon
                          strokeWidth={1.5}
                          className="h-4 w-4 text-_primary_ opacity-80"
                        />

                        <SecondaryLabel className="">
                          No tokenized positions found
                        </SecondaryLabel>
                      </div>
                    )}

                    {safe.tokenizedPositions.map((position, positionIndex) => {
                      return (
                        <div
                          key={`safe:${safe.id}:tokenized-position:${position.id}`}
                          className="mt-2 flex flex-row items-center gap-3 border-b border-_divider_ pb-2"
                        >
                          <TokenDisplayer
                            size={6}
                            tokens={[position]}
                            showChain={true}
                            showSymbol={false}
                          />

                          <div className="flex flex-col gap-[0.125rem]">
                            <div className="flex flex-row items-center gap-2">
                              <PrimaryLabel className="text-sm font-normal">
                                {position.symbol}
                              </PrimaryLabel>

                              <a
                                href={getExplorerUrl({
                                  chainId: position.chainId,
                                  type: "address",
                                  value: position.contractAddress,
                                })}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-_primary_ transition-all duration-200 ease-in-out hover:opacity-80"
                              >
                                <ExternalLinkIcon
                                  strokeWidth={1.5}
                                  className="h-[0.8rem] w-[0.8rem]"
                                />
                              </a>
                            </div>

                            <div className="flex flex-row items-center gap-1">
                              <SecondaryLabel className="text-xs">
                                {formatNumber(position.tokenAmount, {
                                  type: "number",
                                })}{" "}
                                {position.symbol}
                              </SecondaryLabel>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
