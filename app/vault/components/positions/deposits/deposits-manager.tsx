"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";

import { DepositsTable } from "./deposits-table";
import { depositsColumns } from "./deposits-columns";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { ScrollBar } from "@/components/ui/scroll-area";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  loadableBoringPositionsAtom,
  loadableSpecificBoringPositionAtom,
} from "@/store/vault/boring-positions";
import { getCoreRowModel, getPaginationRowModel } from "@tanstack/react-table";
import { useReactTable } from "@tanstack/react-table";
import { GradientText } from "@/app/vault/common/gradient-text";
import formatNumber from "@/utils/numbers";
import { InfoTip } from "@/app/_components/common/info-tip";
import { accountAddressAtom } from "@/store/global";
import { AlertIndicator } from "@/components/common";
import { loadableEnrichedVaultAtom } from "@/store/vault/enriched-vault";
import { LoadingIndicator } from "@/app/_components/common/loading-indicator";

export const DepositsManager = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data, isLoading: isLoadingBoringPosition } = useAtomValue(
    loadableSpecificBoringPositionAtom
  );

  const { data: enrichedVault } = useAtomValue(loadableEnrichedVaultAtom);

  const accountAddress = useAtomValue(accountAddressAtom);

  const table = useReactTable({
    data: data ? [data] : [],
    columns: depositsColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  return (
    <div ref={ref} {...props} className={cn("", className)}>
      <PrimaryLabel className="text-2xl font-medium text-_primary_">
        Deposits
      </PrimaryLabel>

      <div className="mt-7">
        <SecondaryLabel className="text-xs font-medium tracking-wide text-_secondary_">
          TOTAL DEPOSITS
        </SecondaryLabel>

        <PrimaryLabel className="mt-2 text-2xl font-normal">
          {formatNumber(data?.depositToken.tokenAmount ?? 0, {
            type: "number",
          })}{" "}
          {enrichedVault?.depositTokens[0].symbol}
        </PrimaryLabel>

        {/* <SecondaryLabel className="mt-2 text-xs font-medium text-_secondary_">
          <div className="flex items-center gap-1">
            <span className="flex gap-1">
              Estimated from
              <span className="border-b-2 border-dotted border-current">
                Current
              </span>
              APY
            </span>

            <InfoTip contentClassName="max-w-[400px]">
              APY is a snapshot based on current token prices and market
              allocations. It excludes compounding, duration, and changes in
              token value. Vault curators may adjust allocations at any time.
              Actual rewards will vary.
            </InfoTip>
          </div>
        </SecondaryLabel> */}
      </div>

      {!accountAddress ? (
        <div className="mt-7 w-full border border-_divider_ text-center">
          <AlertIndicator className="py-10">
            <span className="text-base">Wallet not connected</span>
          </AlertIndicator>
        </div>
      ) : isLoadingBoringPosition ? (
        <div className="mt-7 w-full border border-_divider_ text-center">
          <LoadingIndicator />
        </div>
      ) : !data ? (
        <div className="mt-7 w-full border border-_divider_ text-center">
          <AlertIndicator className="py-10">
            <span className="text-base">No deposits found</span>
          </AlertIndicator>
        </div>
      ) : (
        <ScrollArea className={cn("mt-7 w-full overflow-hidden")}>
          <DepositsTable data={data ? [data] : []} table={table} />

          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </div>
  );
});
