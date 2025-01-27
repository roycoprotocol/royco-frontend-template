"use client";

import React, { Fragment, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { produce } from "immer";
import { isEqual } from "lodash";
import { useEnrichedOffers, useEnrichedPositionsRecipe } from "royco/hooks";
import { useImmer } from "use-immer";
import { OffersTable } from "./offers-table";
import { offersColumns } from "./offers-columns";
import { LoadingSpinner } from "@/components/composables";
import { useAccount } from "wagmi";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TablePagination } from "../composables";
import { TertiaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import {
  MarketType,
  MarketUserType,
  useGlobalStates,
  useMarketManager,
} from "@/store";
import { useActiveMarket } from "../../../hooks";
import { RoycoMarketType } from "royco/market";

export const OffersManager = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const page_size = 10;
  const [page, setPage] = useState(0);
  const { address } = useAccount();

  const { customTokenData } = useGlobalStates();
  const { currentMarketData, marketMetadata } = useActiveMarket();

  const { offerTablePage, setOfferTablePage, userType } = useMarketManager();

  const propsOffers = useEnrichedOffers({
    chain_id: marketMetadata.chain_id,
    market_id: marketMetadata.market_id,
    creator: (address?.toLowerCase() as string) ?? "",
    market_type:
      marketMetadata.market_type === RoycoMarketType.recipe.id ? 0 : 1,
    page_index: page,
    filters: [
      {
        id: "offer_side",
        value: userType === MarketUserType.ap.id ? 0 : 1,
      },
    ],
    custom_token_data: customTokenData,
  });

  const [placeholderOffers, setPlaceholderOffers] = useImmer<
    Array<ReturnType<typeof useEnrichedOffers>["data"]>
  >([undefined, undefined]);

  useEffect(() => {
    if (!isEqual(propsOffers.data, placeholderOffers[1])) {
      setPlaceholderOffers((prevDatas) => {
        return produce(prevDatas, (draft) => {
          // Prevent overwriting previous data with the same object reference
          if (!isEqual(draft[1], propsOffers.data)) {
            draft[0] = draft[1] as typeof propsOffers.data; // Set previous data to the current data
            draft[1] = propsOffers.data as typeof propsOffers.data; // Set current data to the new data
          }
        });
      });
    }
  }, [propsOffers.data]);

  if (
    userType === MarketUserType.ip.id &&
    currentMarketData?.market_type === 1
  ) {
    return <div className="w-full p-5 text-center">Not Applicable</div>;
  }

  if (propsOffers.isLoading) {
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
        <OffersTable
          // data={
          //   placeholderOffers[1]?.data
          //     ? placeholderOffers[1].data.map((item, index) => ({
          //         ...item,
          //         prev:
          //           placeholderOffers[0] &&
          //           Array.isArray(placeholderOffers[0].data) &&
          //           index < placeholderOffers[0].data.length
          //             ? placeholderOffers[0].data[index]
          //             : null,
          //       }))
          //     : []
          // }
          data={
            placeholderOffers[1]?.data &&
            Array.isArray(placeholderOffers[1].data)
              ? placeholderOffers[1].data.map((item, index) => ({
                  ...item,
                  prev:
                    placeholderOffers[0]?.data &&
                    Array.isArray(placeholderOffers[0].data) &&
                    index < placeholderOffers[0].data.length
                      ? placeholderOffers[0].data[index]
                      : null,
                }))
              : []
          }
          columns={offersColumns}
        />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <TablePagination
        page={page}
        page_size={page_size}
        count={propsOffers.data?.count || 0}
        setPage={setPage}
        className="border-t border-divider"
      />
    </div>
  );
});
