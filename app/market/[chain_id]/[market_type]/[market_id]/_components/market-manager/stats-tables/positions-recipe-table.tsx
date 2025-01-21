"use client";

import React, { useMemo } from "react";
import { useActiveMarket } from "../../hooks";
import { useAccount } from "wagmi";
import { useEnrichedPositionsRecipe } from "royco/hooks";
import {
  MarketType,
  MarketUserType,
  useGlobalStates,
  useMarketManager,
} from "@/store";
import { offerColumns } from "./offer-columns";
import { StatsDataTable } from "./stats-data-table";
import { LoadingSpinner } from "@/components/composables";
import { AlertIndicator } from "@/components/common";
import { positionsRecipeColumns } from "./positions-recipe-columns";

export const PositionsRecipeTable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { address } = useAccount();

  const { currentMarketData, marketMetadata } = useActiveMarket();

  const { userType } = useMarketManager();

  const dataColumns = useMemo(() => {
    if (userType === MarketUserType.ip.id) {
      return (positionsRecipeColumns as any).filter(
        (column: any) => column.accessorKey !== "token_amounts"
      );
    }
    return positionsRecipeColumns;
  }, [positionsRecipeColumns, userType]);

  const { positionsRecipeTablePage, setPositionsRecipeTablePage } =
    useMarketManager();

  const { customTokenData } = useGlobalStates();

  const { isLoading, data, isError, error } = useEnrichedPositionsRecipe({
    chain_id: marketMetadata.chain_id,
    market_id: marketMetadata.market_id,
    account_address: (address?.toLowerCase() as string) ?? "",
    page_index: positionsRecipeTablePage,
    filters: [
      {
        id: "offer_side",
        value:
          userType === MarketUserType.ap.id
            ? MarketUserType.ap.value
            : MarketUserType.ip.value,
      },
    ],
    custom_token_data: undefined,
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
        <AlertIndicator>No positions found</AlertIndicator>
      </div>
    );
  } else {
    return (
      <StatsDataTable
        pagination={{
          currentPage: positionsRecipeTablePage,
          totalPages: Math.ceil(totalCount / 20),
          setPage: setPositionsRecipeTablePage,
        }}
        columns={dataColumns}
        data={data && data.data ? data.data : []}
      />
    );
  }
});
