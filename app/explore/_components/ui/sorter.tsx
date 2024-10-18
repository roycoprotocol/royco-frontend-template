"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useExplore } from "@/store";
import { cn } from "@/lib/utils";
import { ArrowUpWideNarrowIcon } from "lucide-react";

export const SortingStates = {
  name: "Title",
  market_type: "Type",
  total_incentive_amounts_usd: "Incentives",
  locked_quantity_usd: "TVL",
  annual_change_ratio: "AIP",
};

export const Sorter = () => {
  const { exploreSort, setExploreSort } = useExplore();

  return (
    // <div className="flex w-fit shrink-0 flex-row items-center gap-3 bg-red-500">
    <React.Fragment>
      <div className="caption text-nowrap text-secondary">Sort By</div>
      <Select
        onValueChange={(value) => {
          setExploreSort([
            {
              id: value,
              desc: true,
            },
          ]);
        }}
      >
        <SelectTrigger className="body-2 body-2 h-full w-[100px] shrink-0 rounded-xl border border-divider bg-white px-4 text-primary shadow-none drop-shadow-none md:w-[180px]">
          <SelectValue
            // @TODO strict type this
            // @ts-ignore
            placeholder={SortingStates[exploreSort[0].id]}
            // @ts-ignore
            defaultValue={SortingStates[exploreSort[0].id]}
            defaultChecked={true}
          />
        </SelectTrigger>
        <SelectContent className="rounded-xl border border-divider">
          {Object.entries(SortingStates).map(([key, value]) => {
            return (
              <SelectItem
                key={`sorter:${key}`}
                value={key}
                className={cn(
                  "body-2 cursor-pointer rounded-lg text-primary focus:bg-focus",
                  key === exploreSort[0].id && "hidden"
                )}
              >
                {value}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      <button
        onClick={() => {
          setExploreSort([
            {
              id: exploreSort[0].id,
              desc: !exploreSort[0].desc,
            },
          ]);
        }}
        className="flex aspect-square h-11 w-11 shrink-0  flex-col place-content-center items-center rounded-xl border border-divider bg-white text-secondary transition-all duration-200 ease-in-out hover:bg-focus md:h-full"
      >
        <ArrowUpWideNarrowIcon
          className={cn(
            "h-5 w-5 transition-all duration-200 ease-in-out",
            exploreSort[0].desc !== true && "rotate-180"
          )}
        />
      </button>
    </React.Fragment>
    // </div>
  );
};
