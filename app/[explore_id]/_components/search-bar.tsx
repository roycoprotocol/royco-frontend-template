"use client";

import { Input } from "@/components/ui/input";
import { useExplore } from "@/store";
import { CircleXIcon, SearchIcon } from "lucide-react";

export const SearchBar = () => {
  const { exploreSearch, setExploreSearch, setExplorePageIndex } = useExplore();

  return (
    <div className="h-[2.875rem] w-full pr-1 md:min-w-40 lg:w-1/3 lg:min-w-40">
      <div className="flex h-full w-full flex-row items-center gap-2 rounded-full border border-divider bg-white px-4">
        <SearchIcon className="h-5 w-5 shrink-0 text-secondary" />
        <Input
          containerClassName="border-none text-black p-0 h-5 grow"
          className="body-2 placeholder:text-secondary"
          value={exploreSearch}
          onChange={(e) => {
            setExplorePageIndex(0);
            setExploreSearch(e.target.value);
          }}
          placeholder="Search"
        />
      </div>
    </div>
  );
};
