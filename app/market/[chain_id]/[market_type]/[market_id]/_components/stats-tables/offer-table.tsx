"use client";

import React from "react";
import { useActiveMarket } from "../hooks";
import { useAccount } from "wagmi";
import { useEnrichedOffers } from "@/sdk/hooks";
import { MarketType, MarketUserType, useMarketManager } from "@/store";
import { offerColumns } from "./offer-columns";
import { StatsDataTable } from "./stats-data-table";
import { LoadingSpinner } from "@/components/composables";
import { AlertIndicator } from "@/components/common";

export const OfferTable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { address } = useAccount();

  const { currentMarketData, marketMetadata } = useActiveMarket();

  const { offerTablePage, setOfferTablePage, userType } = useMarketManager();

  const { isLoading, data } = useEnrichedOffers({
    chain_id: marketMetadata.chain_id,
    market_id: marketMetadata.market_id,
    creator: (address?.toLowerCase() as string) ?? "",
    market_type: marketMetadata.market_type === MarketType.recipe.id ? 0 : 1,
    page_index: offerTablePage,
    filters: [
      {
        id: "offer_side",
        value: userType === MarketUserType.ap.id ? 0 : 1,
      },
    ],
  });

  let totalCount = data && "count" in data ? (data.count ? data.count : 0) : 0;

  if (isLoading) {
    return (
      <div className="flex w-full grow flex-col place-content-center items-center">
        <LoadingSpinner className="h-5 w-5" />
      </div>
    );
  } else if (totalCount === 0) {
    return (
      <div className="flex w-full grow flex-col place-content-center items-center">
        <AlertIndicator>No offers found</AlertIndicator>
      </div>
    );
  } else {
    return (
      <StatsDataTable
        pagination={{
          currentPage: offerTablePage,
          totalPages: Math.ceil(totalCount / 20),
          setPage: setOfferTablePage,
        }}
        columns={offerColumns}
        data={data && data.data ? data.data : []}
      />
    );
  }
});
