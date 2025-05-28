"use client";

import React from "react";

import { cn } from "@/lib/utils";
import { TokenBadge } from "@/components/common";
import { useExplore } from "@/store";
import { MarketFilter } from "royco/queries";

interface FilterWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  filter: MarketFilter;
  token: {
    id?: string;
    image?: string;
    symbol: string;
    ids?: Array<string>;
  };
}

const FilterWrapper = React.forwardRef<HTMLDivElement, FilterWrapperProps>(
  ({ className, children, filter, token, ...props }, ref) => {
    const { exploreFilters, setExploreFilters, setExplorePageIndex } =
      useExplore();

    const doFilterExists = ({ id, value }: MarketFilter): [boolean, number] => {
      for (let i = 0; i < exploreFilters.length; i++) {
        if (
          exploreFilters[i].id === id &&
          exploreFilters[i].value.toString() === value.toString()
        ) {
          return [true, i];
        }
      }

      return [false, -1];
    };

    const setFilter = (filter: MarketFilter) => {
      const filters = [...exploreFilters];

      const [filterExists, filterIndex] = doFilterExists({
        id: filter.id,
        value: filter.value,
      });

      if (filterExists && filterIndex !== -1 && filterIndex < filters.length) {
        filters.splice(filterIndex, 1);
      } else {
        filters.push(filter);
      }

      setExploreFilters(filters);
      setExplorePageIndex(0);
    };

    return (
      <TokenBadge
        onClick={() => setFilter(filter)}
        className={cn(doFilterExists(filter)[0] === true ? "bg-focus" : "")}
        token={token}
      />
    );
  }
);
FilterWrapper.displayName = "FilterWrapper";

export { FilterWrapper };
