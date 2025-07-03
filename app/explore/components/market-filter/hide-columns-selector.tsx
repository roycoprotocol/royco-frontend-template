import React, { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EyeIcon, EyeOffIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import Fuse from "fuse.js";
import { Button } from "@/components/ui/button";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAtomValue } from "jotai";
import { tagAtom } from "@/store/protector/protector";
import { exploreMarketColumnNames } from "../market-table/columns/explore-market-columns";
import { useExploreMarket } from "@/store/explore/use-explore-market";
import { useMixpanel } from "@/services/mixpanel/use-mixpanel";

export const HideColumnsSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    containerClassName?: string;
  }
>(({ children, className, containerClassName, ...props }, ref) => {
  const { trackExploreVisiblePropertiesChanged } = useMixpanel();
  const tag = useAtomValue(tagAtom);

  const { hiddenTableColumns, setHiddenTableColumns } = useExploreMarket();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const columns = useMemo(() => {
    let type = "default";
    if (tag === "boyco") {
      type = "boyco";
    }
    if (tag === "sonic") {
      type = "sonic";
    }
    if (tag === "plume") {
      type = "plume";
    }
    const columnNames = Object.entries(exploreMarketColumnNames)
      .filter(([key, value]) => value.type.includes(type))
      .map(([key, value]) => {
        return {
          label: value.label,
          value: key,
        };
      });

    return columnNames;
  }, [tag]);

  const fuse = useMemo(() => {
    return new Fuse(columns, {
      keys: ["label"],
      threshold: 0.3,
      includeScore: true,
    });
  }, [columns]);

  const searchData = useMemo(() => {
    if (!search) {
      return columns;
    }
    return fuse.search(search).map((result) => result.item);
  }, [search, columns, fuse, open]);

  const onSelect = (value: string) => {
    const isHidden = hiddenTableColumns.includes(value);
    if (isHidden) {
      setHiddenTableColumns(
        hiddenTableColumns.filter((column) => column !== value)
      );
    } else {
      setHiddenTableColumns([...hiddenTableColumns, value]);
    }
  };

  useEffect(() => {
    trackExploreVisiblePropertiesChanged({
      visible_properties: columns
        .filter((column) => !hiddenTableColumns.includes(column.value))
        .map((column) => column.label),
    });
  }, [hiddenTableColumns]);

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
              "flex h-fit cursor-pointer items-center gap-1 rounded-sm border border-_divider_ bg-_surface_ p-2 transition-all duration-300 hover:border-_secondary_"
            )}
          >
            <EyeIcon className="h-5 w-5" />
          </div>
        </PopoverTrigger>

        <PopoverContent
          sideOffset={8}
          side="bottom"
          align="end"
          className={cn(
            "mx-3 flex h-fit max-h-[300px] flex-col rounded-sm border border-_divider_ bg-_surface_ p-0 shadow-none",
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
            placeholder="Search Properties"
          />

          <hr className="my-0 border-_divider_" />

          <div className="flex items-center justify-between p-3">
            <SecondaryLabel className="text-sm font-normal text-_secondary_">
              {searchData.length + " properties"}
            </SecondaryLabel>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setHiddenTableColumns([]);
              }}
              className="text-_secondary_"
            >
              Reset
            </Button>
          </div>

          <ScrollArea className="flex flex-1 flex-col gap-0">
            {searchData.map((item, index) => {
              const isHidden = hiddenTableColumns.includes(item.value);

              return (
                <div key={index}>
                  <div
                    onClick={() => {
                      onSelect(item.value);
                    }}
                    tabIndex={0}
                    className="flex cursor-pointer items-center gap-4 rounded-sm p-2 transition-all duration-200 ease-in-out hover:bg-focus"
                  >
                    <div
                      className={cn("flex h-4 w-5 items-center justify-center")}
                    >
                      {isHidden ? (
                        <EyeOffIcon className="h-4 w-4 text-_secondary_ opacity-50" />
                      ) : (
                        <EyeIcon className="h-4 w-4 text-_secondary_" />
                      )}
                    </div>

                    <PrimaryLabel
                      className={cn("text-base font-normal text-_secondary_")}
                    >
                      {item.label}
                    </PrimaryLabel>
                  </div>
                </div>
              );
            })}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
});
