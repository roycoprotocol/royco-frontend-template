"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSelectionMenu } from "@/store";
import { SearchIcon, XCircleIcon } from "lucide-react";
import React, { Fragment, useRef } from "react";

export const SearchBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { searchKey, setSearchKey } = useSelectionMenu();

  const searchRef = useRef<HTMLInputElement>(null);

  return (
    <div ref={ref} className={cn("", className)} {...props}>
      <Input
        ref={searchRef}
        value={searchKey}
        Prefix={() => {
          return (
            <SearchIcon
              className={cn(
                "h-5 w-5 shrink-0 text-tertiary transition-all duration-200 ease-in-out"
                // "group-focus-within:text-primary"
              )}
            />
          );
        }}
        /**
         * Clear Button
         *
         * @notice currently removed
         */
        // Suffix={() => {
        //   return (
        //     <Fragment>
        //       {searchKey && searchKey.length > 0 && (
        //         <XCircleIcon
        //           onClick={(e) => {
        //             e.preventDefault();
        //             e.stopPropagation();
        //             setSearchKey("");
        //             searchRef.current?.focus();
        //           }}
        //           className="h-5 w-5 cursor-pointer fill-tertiary text-white transition-all duration-200 ease-in-out hover:fill-primary"
        //         />
        //       )}
        //     </Fragment>
        //   );
        // }}
        onChange={(e) => setSearchKey(e.target.value)}
        // containerClassName="bg-white h-8"
        // newHeight="h-8"
        // newLeading="leading-8"
        placeholder="Search"
        containerClassName="bg-z2"
      />
    </div>
  );
});
