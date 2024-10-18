"use client";

import { EyeIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { cn } from "@/lib/utils";
import { useExplore } from "@/store";

export const ColumnToggler = () => {
  const {
    exploreColumnVisibility,
    exploreColumnNames,
    setExploreColumnVisibility,
  } = useExplore();

  return (
    <div className="aspect-square h-11 w-11 md:h-full">
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex aspect-square h-full shrink-0 flex-col place-content-center items-center rounded-xl border border-divider bg-white text-secondary transition-all duration-200 ease-in-out hover:bg-focus">
            <EyeIcon
              className={cn("h-5 w-5 transition-all duration-200 ease-in-out")}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[200px] p-0">
          <Command>
            <div className="subtitle-2 border-b border-divider px-3 py-2 text-left text-secondary">
              Field Visibility
            </div>
            <CommandGroup>
              <CommandList>
                {Object.entries(exploreColumnVisibility)
                  .sort((a, b) =>
                    exploreColumnNames[a[0]].localeCompare(
                      exploreColumnNames[b[0]]
                    )
                  )
                  .map(([key, value]) => {
                    const name = exploreColumnNames[key] || null;

                    if (!!name) {
                      return (
                        <CommandItem
                          key={`column-toggler:${key}`}
                          className="cursor-pointer rounded-md aria-selected:bg-z2"
                          value={key}
                          onSelect={() => {
                            setExploreColumnVisibility({
                              ...exploreColumnVisibility,
                              [key]: !value,
                            });
                          }}
                        >
                          <div className="body-2 flex w-full flex-row items-center justify-between">
                            <div>{name}</div>

                            <AnimatePresence initial={false} mode="popLayout">
                              {value && (
                                <motion.svg
                                  key="check-icon"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-check h-5 w-5 text-secondary transition-all duration-200 ease-in-out"
                                >
                                  <motion.path
                                    initial={{ pathLength: 0, pathOffset: 1 }}
                                    animate={{ pathLength: 1, pathOffset: 0 }}
                                    exit={{ pathLength: 0, pathOffset: 0 }}
                                    transition={{
                                      duration: 0.15,
                                      type: "spring",
                                      bounce: 0,
                                      ease: "easeInOut",
                                    }}
                                    d="M20 6 9 17l-5-5"
                                  />
                                </motion.svg>
                              )}
                            </AnimatePresence>
                          </div>
                        </CommandItem>
                      );
                    }
                  })}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
