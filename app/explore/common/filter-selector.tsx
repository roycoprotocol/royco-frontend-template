import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import Fuse from "fuse.js";
import { Button } from "@/components/ui/button";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { ScrollArea } from "@/components/ui/scroll-area";

export const FilterSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    staticData?: {
      label: string;
      value: any;
      icon?: React.ReactNode;
    }[];
    data: {
      label: string;
      value: any;
      icon?: React.ReactNode;
    }[];
    selected?: any[];
    onSelect?: (id: string) => void;
    onClear?: () => void;
    containerClassName?: string;
    inputPlaceholder?: string;
    disabled?: boolean;
  }
>(
  (
    {
      children,
      className,
      data,
      selected,
      onSelect,
      onClear,
      containerClassName,
      inputPlaceholder = "Search",
      staticData,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const fuse = useMemo(() => {
      return new Fuse(data, {
        keys: ["label"],
        threshold: 0.3,
        includeScore: true,
      });
    }, [data]);

    const searchData = useMemo(() => {
      if (!search) {
        const sortedData = [...data];
        return sortedData.sort((a, b) =>
          selected?.includes(a.value) ? -1 : selected?.includes(b.value) ? 1 : 0
        );
      }
      return fuse.search(search).map((result) => result.item);
    }, [search, data, fuse, open]);

    return (
      <div ref={ref} className={cn("", className)} {...props}>
        <Popover
          open={open}
          onOpenChange={() => {
            setSearch("");
            setOpen(!open);
          }}
        >
          <PopoverTrigger asChild>
            <div
              className={cn(
                "flex h-fit cursor-pointer items-center gap-2 rounded-sm border border-_divider_ bg-_surface_ px-3 py-2 transition-all duration-300 hover:border-_secondary_",
                disabled && "opacity-60 hover:border-_divider_"
              )}
            >
              {children}
            </div>
          </PopoverTrigger>

          {!disabled && (
            <PopoverContent
              sideOffset={8}
              side="bottom"
              align="end"
              className={cn(
                "mx-3 flex h-fit max-h-[340px] w-[320px] flex-col rounded-sm border border-_divider_ bg-_surface_ p-0 shadow-none",
                containerClassName
              )}
            >
              <Input
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                value={search}
                Prefix={() => {
                  return (
                    <div className="h-4 w-4 text-placeholder">
                      <SearchIcon className=" h-4 w-4" />
                    </div>
                  );
                }}
                className="w-full"
                containerClassName="h-10 font-normal text-sm text-_primary_ p-3 border-none"
                placeholder={inputPlaceholder}
              />

              <hr className="my-0 border-_divider_" />

              {staticData && staticData.length > 0 && (
                <>
                  <div className="flex flex-wrap gap-1 p-3">
                    {staticData?.map((item, index) => {
                      const isSelected = selected?.some(
                        (value) => value === item.value
                      );

                      return (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            onSelect?.(item.value);
                          }}
                          className={cn(
                            "flex cursor-pointer items-center gap-1 rounded-sm border border-_surface_tertiary bg-_surface_tertiary px-2 py-1 hover:bg-_surface_secondary",
                            isSelected && "border-_primary_"
                          )}
                        >
                          <SecondaryLabel
                            className={cn(
                              "text-xs font-normal text-_secondary_",
                              isSelected && "font-medium text-_primary_"
                            )}
                          >
                            {item.label}
                          </SecondaryLabel>
                        </Button>
                      );
                    })}
                  </div>

                  <hr className="my-0 border-_divider_" />
                </>
              )}

              <div className="flex items-center justify-between px-2 py-1">
                <SecondaryLabel className="text-sm font-normal text-_secondary_">
                  {searchData.length + " results"}
                </SecondaryLabel>

                {onClear && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClear}
                    className="text-_secondary_"
                  >
                    Clear
                  </Button>
                )}
              </div>

              <ScrollArea className="flex flex-1 flex-col gap-0">
                {searchData.map((item, index) => {
                  const isSelected = selected?.some(
                    (value) => value === item.value
                  );

                  return (
                    <div key={index}>
                      <div
                        onClick={() => {
                          onSelect?.(item.value);
                        }}
                        tabIndex={0}
                        className="flex cursor-pointer items-center gap-4 rounded-sm p-2 transition-all duration-200 ease-in-out hover:bg-focus"
                      >
                        <div
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded-sm border border-_divider_",
                            isSelected && "border-_primary_ bg-_primary_"
                          )}
                        >
                          {isSelected && (
                            <CheckIcon
                              className="h-3 w-3 text-white"
                              strokeWidth={3}
                            />
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {item.icon}

                          <PrimaryLabel
                            className={cn(
                              "text-base font-normal text-_secondary_",
                              isSelected && "text-_primary_"
                            )}
                          >
                            {item.label}
                          </PrimaryLabel>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </ScrollArea>
            </PopoverContent>
          )}
        </Popover>
      </div>
    );
  }
);
