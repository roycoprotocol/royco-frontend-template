"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useAtom, useSetAtom } from "jotai";
import {
  marketFiltersAtom,
  marketPageAtom,
} from "@/store/explore/explore-market";
import { PrimaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { ListFilter } from "lucide-react";
import { FilterSelector } from "@/app/explore/common/filter-selector";
import { MULTIPLIER_ASSET_TYPE } from "royco/boyco";

const FILTER_ID = "marketMetadata.boyco.assetType";

export const PoolTypeFilter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [filters, setFilters] = useAtom(marketFiltersAtom);
  const setExploreMarketPage = useSetAtom(marketPageAtom);

  const selectOptions = useMemo(() => {
    const getLabel = (poolType: MULTIPLIER_ASSET_TYPE) => {
      if (poolType === MULTIPLIER_ASSET_TYPE.MAJOR_ONLY) {
        return "Major";
      } else if (poolType === MULTIPLIER_ASSET_TYPE.THIRD_PARTY_ONLY) {
        return "Third-Party";
      } else if (poolType === MULTIPLIER_ASSET_TYPE.HYBRID) {
        return "Hybrid";
      }
      return "-";
    };

    return Object.values(MULTIPLIER_ASSET_TYPE).map((poolType) => ({
      label: getLabel(poolType),
      value: poolType,
    }));
  }, []);

  const allOptions = useMemo(() => {
    return selectOptions;
  }, [selectOptions]);

  const doFilterExists = (value: MULTIPLIER_ASSET_TYPE) => {
    const poolTypeFilter = filters.find((item) => item.id === FILTER_ID);
    if (!poolTypeFilter) return false;

    return (poolTypeFilter.value as string[]).includes(value);
  };

  const addAssetFilter = (id: MULTIPLIER_ASSET_TYPE) => {
    if (doFilterExists(id)) return;

    let poolTypeFilter = filters.find((item) => item.id === FILTER_ID);
    if (!poolTypeFilter) {
      poolTypeFilter = {
        id: FILTER_ID,
        value: [],
        condition: "inArray",
      };
    }

    const newFilters = filters.filter((item) => item.id !== FILTER_ID);
    newFilters.push({
      ...poolTypeFilter,
      value: [...(poolTypeFilter.value as string[]), id],
    });

    setFilters(newFilters);
  };

  const removeAssetFilter = (id: MULTIPLIER_ASSET_TYPE) => {
    if (!doFilterExists(id)) return;

    let poolTypeFilter = filters.find((item) => item.id === FILTER_ID);
    if (!poolTypeFilter) return;

    const newFilters = filters.filter((item) => item.id !== FILTER_ID);
    newFilters.push({
      ...poolTypeFilter,
      value: (poolTypeFilter.value as string[]).filter((value) => value !== id),
    });

    setFilters(newFilters);
  };

  const handleAssetToggle = (id: MULTIPLIER_ASSET_TYPE) => {
    if (doFilterExists(id)) {
      removeAssetFilter(id);
    } else {
      addAssetFilter(id);
    }

    setExploreMarketPage(1);
  };

  const onClearFilter = () => {
    setFilters(filters.filter((filter) => filter.id !== FILTER_ID));
    setExploreMarketPage(1);
  };

  const selectedOptions = useMemo(() => {
    return allOptions.filter((option) => doFilterExists(option.value));
  }, [allOptions, filters]);

  return (
    <div ref={ref} className={cn("flex flex-wrap gap-2", className)} {...props}>
      <FilterSelector
        data={selectOptions}
        selected={selectedOptions.map((asset) => asset.value)}
        onSelect={(id) => handleAssetToggle(id as MULTIPLIER_ASSET_TYPE)}
        onClear={onClearFilter}
      >
        <PrimaryLabel className="whitespace-nowrap text-sm font-medium text-_primary_">
          Pool Type
        </PrimaryLabel>

        <ListFilter className="h-5 w-5" />
      </FilterSelector>
    </div>
  );
});
