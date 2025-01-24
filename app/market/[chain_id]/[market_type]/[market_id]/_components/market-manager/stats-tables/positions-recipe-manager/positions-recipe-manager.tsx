"use client";

import React, { Fragment, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { produce } from "immer";
import { isEqual } from "lodash";
import { useEnrichedPositionsRecipe } from "royco/hooks";
import { useImmer } from "use-immer";
import { PositionsRecipeTable } from "./positions-recipe-table";
import {
  positionsRecipeColumns,
  positionsRecipeColumnsBoyco,
} from "./positions-recipe-columns";
import { LoadingSpinner } from "@/components/composables";
import { useAccount } from "wagmi";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TablePagination } from "../composables";
import { MarketUserType, useGlobalStates, useMarketManager } from "@/store";
import { useActiveMarket } from "../../../hooks";

export const PositionsRecipeManager = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const page_size = 10;
  const [page, setPage] = useState(0);
  const { address } = useAccount();

  const { customTokenData } = useGlobalStates();
  const { currentMarketData } = useActiveMarket();

  const { userType } = useMarketManager();

  const propsPositionsRecipe = useEnrichedPositionsRecipe({
    account_address: address?.toLowerCase() ?? "",
    market_id: currentMarketData?.market_id ?? undefined,
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

  const [placeholderPositionsRecipe, setPlaceholderPositionsRecipe] = useImmer<
    Array<ReturnType<typeof useEnrichedPositionsRecipe>["data"]>
  >([undefined, undefined]);

  useEffect(() => {
    if (!isEqual(propsPositionsRecipe.data, placeholderPositionsRecipe[1])) {
      setPlaceholderPositionsRecipe((prevDatas) => {
        return produce(prevDatas, (draft) => {
          // Prevent overwriting previous data with the same object reference
          if (!isEqual(draft[1], propsPositionsRecipe.data)) {
            draft[0] = draft[1] as typeof propsPositionsRecipe.data; // Set previous data to the current data
            draft[1] =
              propsPositionsRecipe.data as typeof propsPositionsRecipe.data; // Set current data to the new data
          }
        });
      });
    }
  }, [propsPositionsRecipe.data]);

  if (userType === MarketUserType.ip.id) {
    return <div className="w-full p-5 text-center">Not Applicable</div>;
  }

  if (propsPositionsRecipe.isLoading) {
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
      className={cn("flex w-full grow flex-col overflow-y-hidden", className)}
    >
      <ScrollArea className={cn("relative w-full grow")}>
        <PositionsRecipeTable
          data={
            placeholderPositionsRecipe[1]?.data
              ? placeholderPositionsRecipe[1].data.map((item, index) => ({
                  ...item,
                  prev:
                    placeholderPositionsRecipe[0] &&
                    Array.isArray(placeholderPositionsRecipe[0].data) &&
                    index < placeholderPositionsRecipe[0].data.length
                      ? placeholderPositionsRecipe[0].data[index]
                      : null,
                }))
              : []
          }
          columns={
            currentMarketData?.category === "boyco"
              ? positionsRecipeColumnsBoyco
              : positionsRecipeColumns
          }
        />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <TablePagination
        page={page}
        page_size={page_size}
        count={propsPositionsRecipe.data?.count || 0}
        setPage={setPage}
        className="border-t border-divider"
      />
    </div>
  );
});
