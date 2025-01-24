"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { produce } from "immer";
import { isEqual } from "lodash";
import {
  useEnrichedPositionsRecipe,
  useEnrichedPositionsVault,
} from "royco/hooks";
import { useImmer } from "use-immer";
import { PositionsVaultTable } from "./positions-vault-table";
import { positionsVaultColumns } from "./positions-vault-columns";
import { LoadingSpinner } from "@/components/composables";
import { useAccount } from "wagmi";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TablePagination } from "../composables";
import { TertiaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { useGlobalStates } from "@/store";

export const PositionsVaultManager = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const page_size = 5;
  const [page, setPage] = useState(0);
  const { address } = useAccount();

  const { customTokenData } = useGlobalStates();

  const propsPositionsVault = useEnrichedPositionsVault({
    account_address: address?.toLowerCase() ?? "",
    page_index: page,
    page_size,
    filters: [
      {
        id: "offer_side",
        value: 0,
      },
    ],
    custom_token_data: customTokenData,
  });

  const [placeholderPositionsVault, setPlaceholderPositionsVault] = useImmer<
    Array<ReturnType<typeof useEnrichedPositionsVault>["data"]>
  >([undefined, undefined]);

  useEffect(() => {
    if (!isEqual(propsPositionsVault.data, placeholderPositionsVault[1])) {
      setPlaceholderPositionsVault((prevDatas) => {
        return produce(prevDatas, (draft) => {
          // Prevent overwriting previous data with the same object reference
          if (!isEqual(draft[1], propsPositionsVault.data)) {
            draft[0] = draft[1] as typeof propsPositionsVault.data; // Set previous data to the current data
            draft[1] =
              propsPositionsVault.data as typeof propsPositionsVault.data; // Set current data to the new data
          }
        });
      });
    }
  }, [propsPositionsVault.data]);

  if (propsPositionsVault.isLoading) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-5",
          className
        )}
      >
        <LoadingSpinner className="h-5 w-5" />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-divider bg-white",
        className
      )}
    >
      <div ref={ref} {...props} className={cn("flex flex-row items-center")}>
        <TertiaryLabel className="mb-2 mt-5 px-5">POSITIONS</TertiaryLabel>
      </div>

      <ScrollArea className={cn("w-full")}>
        <PositionsVaultTable
          data={
            placeholderPositionsVault[1]?.data
              ? placeholderPositionsVault[1].data.map((item, index) => ({
                  ...item,
                  prev:
                    placeholderPositionsVault[0] &&
                    Array.isArray(placeholderPositionsVault[0].data) &&
                    index < placeholderPositionsVault[0].data.length
                      ? placeholderPositionsVault[0].data[index]
                      : null,
                }))
              : []
          }
          columns={positionsVaultColumns}
        />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <TablePagination
        page={page}
        page_size={page_size}
        count={propsPositionsVault.data?.count || 0}
        setPage={setPage}
        className="border-t border-divider"
      />
    </div>
  );
});
