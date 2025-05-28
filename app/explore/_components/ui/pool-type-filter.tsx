"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai";
import {
  marketFiltersAtom,
  marketPageAtom,
} from "@/store/explore/explore-market";
import { MULTIPLIER_ASSET_TYPE } from "royco/boyco";
import { ToggleBadge } from "@/components/common/toggle-badge";

export const PoolTypeFilter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [filters, setFilters] = useAtom(marketFiltersAtom);
  const [page, setPage] = useAtom(marketPageAtom);

  const handlePoolTypeToggle = (poolType: MULTIPLIER_ASSET_TYPE) => {
    const poolTypeFilterIndex = filters.findIndex(
      (filter) => filter.id === "marketMetadata.boyco.assetType"
    );

    const currentPoolTypes =
      poolTypeFilterIndex !== -1
        ? (filters[poolTypeFilterIndex].value as string[])
        : [];

    const newPoolTypes = currentPoolTypes.includes(poolType)
      ? currentPoolTypes.filter((id) => id !== poolType)
      : [...currentPoolTypes, poolType];

    const newFilters =
      newPoolTypes.length === 0
        ? filters.filter(
            (filter) => filter.id !== "marketMetadata.boyco.assetType"
          )
        : [
            ...filters.filter(
              (filter) => filter.id !== "marketMetadata.boyco.assetType"
            ),
            {
              id: "marketMetadata.boyco.assetType",
              value: newPoolTypes,
              condition: "inArray",
            },
          ];

    setFilters(newFilters);
    setPage(1);
  };

  const isPoolTypeSelected = (poolType: MULTIPLIER_ASSET_TYPE) => {
    const poolTypeFilter = filters.find(
      (filter) => filter.id === "marketMetadata.boyco.assetType"
    );
    return poolTypeFilter
      ? (poolTypeFilter.value as string[]).includes(poolType)
      : false;
  };

  const getPoolType = (poolType: MULTIPLIER_ASSET_TYPE) => {
    if (poolType === MULTIPLIER_ASSET_TYPE.MAJOR_ONLY) {
      return "Major";
    } else if (poolType === MULTIPLIER_ASSET_TYPE.THIRD_PARTY_ONLY) {
      return "Third-Party";
    } else {
      return "Hybrid";
    }
  };

  return (
    <div ref={ref} className={cn("flex flex-wrap gap-2", className)} {...props}>
      {Object.values(MULTIPLIER_ASSET_TYPE).map((poolType) => (
        <div key={`filter:pool-type:${poolType}`}>
          <ToggleBadge
            onClick={() => handlePoolTypeToggle(poolType)}
            className={cn(
              isPoolTypeSelected(poolType) && "bg-focus",
              "border border-success text-success hover:border-green-800 hover:text-green-800"
            )}
          >
            {getPoolType(poolType)}
          </ToggleBadge>
        </div>
      ))}
    </div>
  );
});
