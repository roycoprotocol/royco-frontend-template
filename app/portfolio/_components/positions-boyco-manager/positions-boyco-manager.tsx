"use client";

import React, { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { produce } from "immer";
import { isEqual } from "lodash";
import { useEnrichedPositionsBoyco } from "royco/hooks";
import { useImmer } from "use-immer";
import { PositionsBoycoTable } from "./positions-boyco-table";
import { positionsBoycoColumns } from "./positions-boyco-columns";
import { LoadingSpinner } from "@/components/composables";
import { useAccount } from "wagmi";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TablePagination } from "../composables";
import { TertiaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { useGlobalStates } from "@/store";

export const PositionsBoycoManager = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const page_size = 5;
  const [page, setPage] = useState(0);
  const { address } = useAccount();

  const propsPositionsBoyco = useEnrichedPositionsBoyco({
    account_address: address?.toLowerCase() ?? "",
    page_index: page,
    page_size,
  });

  const [placeholderPositionsBoyco, setPlaceholderPositionsBoyco] = useImmer<
    Array<ReturnType<typeof useEnrichedPositionsBoyco>["data"]>
  >([undefined, undefined]);

  useEffect(() => {
    if (!isEqual(propsPositionsBoyco.data, placeholderPositionsBoyco[1])) {
      setPlaceholderPositionsBoyco((prevDatas) => {
        return produce(prevDatas, (draft) => {
          // Prevent overwriting previous data with the same object reference
          if (!isEqual(draft[1], propsPositionsBoyco.data)) {
            draft[0] = draft[1] as typeof propsPositionsBoyco.data; // Set previous data to the current data
            draft[1] =
              propsPositionsBoyco.data as typeof propsPositionsBoyco.data; // Set current data to the new data
          }
        });
      });
    }
  }, [propsPositionsBoyco.data]);

  if (propsPositionsBoyco.isLoading) {
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
        <PositionsBoycoTable
          data={
            placeholderPositionsBoyco[1]?.data
              ? placeholderPositionsBoyco[1].data.map((item, index) => ({
                  ...item,
                  prev:
                    placeholderPositionsBoyco[0] &&
                    Array.isArray(placeholderPositionsBoyco[0].data) &&
                    index < placeholderPositionsBoyco[0].data.length
                      ? placeholderPositionsBoyco[0].data[index]
                      : null,
                }))
              : []
          }
          columns={positionsBoycoColumns}
        />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <TablePagination
        page={page}
        page_size={page_size}
        count={propsPositionsBoyco.data?.count || 0}
        setPage={setPage}
        className="border-t border-divider"
      />
    </div>
  );
});
