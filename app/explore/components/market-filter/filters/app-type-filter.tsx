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
import { SONIC_APP_TYPE } from "royco/sonic";

const FILTER_ID = "marketMetadata.sonic.appType";

export const AppTypeFilter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [filters, setFilters] = useAtom(marketFiltersAtom);
  const setExploreMarketPage = useSetAtom(marketPageAtom);

  const selectOptions = useMemo(() => {
    const getLabel = (appType: SONIC_APP_TYPE) => {
      if (appType === SONIC_APP_TYPE.EMERALD) {
        return "Emerald";
      } else if (appType === SONIC_APP_TYPE.SAPPHIRE) {
        return "Sapphire";
      } else if (appType === SONIC_APP_TYPE.RUBY) {
        return "Ruby";
      }
      return "-";
    };

    return Object.values(SONIC_APP_TYPE).map((appType) => ({
      label: getLabel(appType),
      value: appType,
    }));
  }, []);

  const allOptions = useMemo(() => {
    return selectOptions;
  }, [selectOptions]);

  const doFilterExists = (id: SONIC_APP_TYPE) => {
    const appTypeFilter = filters.find((item) => item.id === FILTER_ID);
    if (!appTypeFilter) return false;

    return (appTypeFilter.value as string[]).includes(id);
  };

  const addFilter = (id: SONIC_APP_TYPE) => {
    if (doFilterExists(id)) return;

    let appTypeFilter = filters.find((item) => item.id === FILTER_ID);
    if (!appTypeFilter) {
      appTypeFilter = {
        id: FILTER_ID,
        value: [],
        condition: "inArray",
      };
    }

    const newFilters = filters.filter((item) => item.id !== FILTER_ID);
    newFilters.push({
      ...appTypeFilter,
      value: [...(appTypeFilter.value as string[]), id],
    });

    setFilters(newFilters);
  };

  const removeFilter = (id: SONIC_APP_TYPE) => {
    if (!doFilterExists(id)) return;

    let appTypeFilter = filters.find((item) => item.id === FILTER_ID);
    if (!appTypeFilter) return;

    const newFilters = filters.filter((item) => item.id !== FILTER_ID);
    newFilters.push({
      ...appTypeFilter,
      value: (appTypeFilter.value as string[]).filter((value) => value !== id),
    });

    setFilters(newFilters);
  };

  const handleToggle = (id: SONIC_APP_TYPE) => {
    if (doFilterExists(id)) {
      removeFilter(id);
    } else {
      addFilter(id);
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
        onSelect={(id) => handleToggle(id as SONIC_APP_TYPE)}
        onClear={onClearFilter}
      >
        <PrimaryLabel className="whitespace-nowrap text-sm font-medium text-_primary_">
          App Type
        </PrimaryLabel>

        <ListFilter className="h-5 w-5" />
      </FilterSelector>
    </div>
  );
});
