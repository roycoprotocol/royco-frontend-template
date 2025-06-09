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

const FILTER_ID = "inputToken.tag";

export const InputTokenTagFilter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [filters, setFilters] = useAtom(marketFiltersAtom);
  const setExploreMarketPage = useSetAtom(marketPageAtom);

  const selectOptions = useMemo(() => {
    const getLabel = (inputTokenTag: string) => {
      if (inputTokenTag === "stable") {
        return "Stable";
      } else if (inputTokenTag === "volatile") {
        return "Volatile";
      }
      return "-";
    };

    return Object.values(["stable", "volatile"]).map((inputTokenTag) => ({
      label: getLabel(inputTokenTag),
      value: inputTokenTag,
    }));
  }, []);

  const allOptions = useMemo(() => {
    return selectOptions;
  }, [selectOptions]);

  const doFilterExists = (id: string) => {
    const inputTokenTagFilter = filters.find((item) => item.id === FILTER_ID);
    if (!inputTokenTagFilter) return false;

    return (inputTokenTagFilter.value as string[]).includes(id);
  };

  const addFilter = (id: string) => {
    if (doFilterExists(id)) return;

    let inputTokenTagFilter = filters.find((item) => item.id === FILTER_ID);
    if (!inputTokenTagFilter) {
      inputTokenTagFilter = {
        id: FILTER_ID,
        value: [],
        condition: "inArray",
      };
    }

    const newFilters = filters.filter((item) => item.id !== FILTER_ID);
    newFilters.push({
      ...inputTokenTagFilter,
      value: [...(inputTokenTagFilter.value as string[]), id],
    });

    setFilters(newFilters);
  };

  const removeFilter = (id: string) => {
    if (!doFilterExists(id)) return;

    let inputTokenTagFilter = filters.find((item) => item.id === FILTER_ID);
    if (!inputTokenTagFilter) return;

    const newFilters = filters.filter((item) => item.id !== FILTER_ID);
    newFilters.push({
      ...inputTokenTagFilter,
      value: (inputTokenTagFilter.value as string[]).filter(
        (value) => value !== id
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

  return (
    <div ref={ref} className={cn("flex flex-wrap gap-2", className)} {...props}>
      <FilterSelector
        data={selectOptions}
        selected={selectedOptions.map((asset) => asset.value)}
        onSelect={(id) => handleToggle(id as string)}
        onClear={onClearFilter}
      >
        <PrimaryLabel className="whitespace-nowrap text-sm font-medium text-_primary_">
          Asset Type
        </PrimaryLabel>

        <ListFilter className="h-5 w-5" />
      </FilterSelector>
    </div>
  );
});
