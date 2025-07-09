"use client";

import React, { useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  loadableExploreAssetFilterOptionsAtom,
  marketFiltersAtom,
  marketPageAtom,
} from "@/store/explore/explore-market";
import { PrimaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { ListFilter } from "lucide-react";
import { FilterSelector } from "@/app/explore/common/filter-selector";
import { TokenDisplayer } from "@/components/common";
import { useMixpanel } from "@/services/mixpanel/use-mixpanel";

const FILTER_ID = "incentiveTokenIds";

export const IncentiveAssetFilter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { trackExploreIncentiveAssetChanged } = useMixpanel();
  const { data } = useAtomValue(loadableExploreAssetFilterOptionsAtom);

  const [filters, setFilters] = useAtom(marketFiltersAtom);
  const setExploreMarketPage = useSetAtom(marketPageAtom);

  const staticOptions = useMemo(() => {
    if (!data) return [];

    return data.staticIncentiveTokenFilters.map((item) => ({
      label: item.symbol,
      value: `${item.chainId}-${item.contractAddress}`,
      icon: <TokenDisplayer tokens={[item]} symbols={false} />,
      match: item.ids,
    }));
  }, [data]);

  const selectOptions = useMemo(() => {
    if (!data) return [];

    return data.dynamicIncentiveTokenFilters.map((item) => ({
      label: item.symbol,
      value: `${item.chainId}-${item.contractAddress}`,
      icon: <TokenDisplayer tokens={[item]} symbols={false} />,
      match: item.ids,
    }));
  }, [data]);

  const allOptions = useMemo(() => {
    return [...staticOptions, ...selectOptions];
  }, [staticOptions, selectOptions]);

  const doFilterExists = (id: string) => {
    const option = allOptions.find((option) => option.value === id);
    if (!option) return false;

    const incentiveAssetFilter = filters.find((item) => item.id === FILTER_ID);
    if (!incentiveAssetFilter) return false;

    return option.match.every((value) =>
      (incentiveAssetFilter.value as string[]).includes(value)
    );
  };

  const addFilter = (id: string) => {
    const option = allOptions.find((option) => option.value === id);
    if (!option) return;

    if (doFilterExists(id)) return;

    let incentiveAssetFilter = filters.find((item) => item.id === FILTER_ID);
    if (!incentiveAssetFilter) {
      incentiveAssetFilter = {
        id: FILTER_ID,
        value: [],
        condition: "inArray",
      };
    }

    const newFilters = filters.filter((item) => item.id !== FILTER_ID);
    newFilters.push({
      ...incentiveAssetFilter,
      value: [...(incentiveAssetFilter.value as string[]), ...option.match],
    });

    setFilters(newFilters);
  };

  const removeFilter = (id: string) => {
    const option = allOptions.find((option) => option.value === id);
    if (!option) return;

    if (!doFilterExists(id)) return;

    let incentiveAssetFilter = filters.find((item) => item.id === FILTER_ID);
    if (!incentiveAssetFilter) return;

    const newFilters = filters.filter((item) => item.id !== FILTER_ID);
    newFilters.push({
      ...incentiveAssetFilter,
      value: (incentiveAssetFilter.value as string[]).filter(
        (value) => !option.match.includes(value)
      ),
    });

    setFilters(newFilters);
  };

  const handleToggle = (id: string) => {
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

  useEffect(() => {
    trackExploreIncentiveAssetChanged({
      incentive_assets: selectedOptions.map((option) => option.label),
    });
  }, [selectedOptions]);

  return (
    <div ref={ref} className={cn("flex flex-wrap gap-2", className)} {...props}>
      <FilterSelector
        data={selectOptions}
        staticData={staticOptions}
        selected={selectedOptions.map((asset) => asset.value)}
        onSelect={(id) => handleToggle(id as string)}
        onClear={onClearFilter}
      >
        <PrimaryLabel className="text-sm font-medium text-_primary_">
          Incentive
        </PrimaryLabel>

        <ListFilter className="h-5 w-5" />
      </FilterSelector>
    </div>
  );
});
