import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import { ChevronLeftIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FallMotion } from "@/components/animations";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AlertIndicator, TokenDisplayer } from "@/components/common";
import { getTokenQuote, useSupportedTokens, useTokenQuotes } from "royco/hooks";
import { useActiveMarket } from "../../../hooks";
import { AnimatePresence } from "framer-motion";
import { SpringNumber } from "@/components/composables";

export const IncentiveTokenSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    selected_token_ids?: string[];
    onSelect?: (token: any) => void;
    key?: string;
    token_ids?: string[];
    not_token_ids?: string[];
  }
>(
  (
    {
      className,
      token_ids,
      not_token_ids,
      selected_token_ids,
      onSelect,
      key = "",
      ...props
    },
    ref
  ) => {
    const { marketMetadata } = useActiveMarket();

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const { data, totalPages } = useSupportedTokens({
      chain_id: marketMetadata.chain_id,
      page,
      search,
      token_ids,
      not_token_ids,
    });

    const propsTokenQuotes = useTokenQuotes({
      token_ids: data.map((token) => token.id),
    });

    const canPrevPage = page > 1;
    const canNextPage = page < totalPages;

    const handleNextPage = () => {
      if (canNextPage) {
        setPage(page + 1);
      }
    };

    const handlePrevPage = () => {
      if (canPrevPage) {
        setPage(page - 1);
      }
    };

    const [placeholderPage, setPlaceholderPage] = useState<Array<number>>([
      1, 1,
    ]);
    const [placeholderTotalPages, setPlaceholderTotalPages] = useState<
      Array<number>
    >([1, 1]);

    const updatePlaceholderPage = () => {
      let newPlaceholderPage = [...placeholderPage, page];
      if (newPlaceholderPage.length > 2) {
        newPlaceholderPage.shift();
      }
      setPlaceholderPage(newPlaceholderPage);
    };

    const updatePlaceholderTotalPages = () => {
      let newPlaceholderTotalPages = [...placeholderTotalPages, totalPages];
      if (newPlaceholderTotalPages.length > 2) {
        newPlaceholderTotalPages.shift();
      }
      setPlaceholderTotalPages(newPlaceholderTotalPages);
    };

    const resetPlaceholders = () => {
      if (open === false) {
        setPlaceholderPage([page, page]);
        setPlaceholderTotalPages([totalPages, totalPages]);
      }
    };

    useEffect(() => {
      updatePlaceholderPage();
    }, [page]);

    useEffect(() => {
      updatePlaceholderTotalPages();
    }, [totalPages]);

    useEffect(() => {
      resetPlaceholders();
    }, [open]);

    return (
      <div ref={ref} className={cn("", className)} {...props}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            asChild
            className="body-2 h-9 w-full cursor-pointer rounded-md border border-divider px-3 text-primary"
          >
            <div
              onClick={() => {
                if (open === false) {
                  setOpen(true);
                }
              }}
              className="relative w-full"
            >
              <FallMotion
                customKey={`market:incentive-token-selector:${key}`}
                height="2.25rem"
                motionClassName="flex flex-col items-start"
                contentClassName="body-2 text-left text-sm"
              >
                <div>Select Incentive</div>
              </FallMotion>

              <div
                className={cn(
                  "absolute right-0 top-0 flex h-9 w-9 flex-col place-content-center items-center",
                  "transition-all duration-200 ease-in-out",
                  open ? "-rotate-180" : ""
                )}
              >
                <ChevronDownIcon
                  strokeWidth={1.5}
                  className={cn("!h-5 !w-5 shrink-0 text-secondary")}
                />
              </div>
            </div>
          </PopoverTrigger>

          <PopoverContent
            sideOffset={12}
            side="bottom"
            align="end"
            className={cn(
              "-mt-2 flex w-full flex-col p-1",
              "max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width]"
            )}
          >
            <Input
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              value={search}
              Prefix={() => {
                return (
                  <div className="h-4 w-4 text-placeholder">
                    <SearchIcon className="-mt-[0.05rem] h-4 w-4" />
                  </div>
                );
              }}
              className="mb-1 w-full"
              containerClassName="h-8 font-light px-2 gap-2 bg-z2"
              placeholder="Search Token"
            />

            <ul className="list mt-1 flex h-44 w-full flex-col gap-0 overflow-x-hidden overflow-y-scroll">
              {data.length === 0 && (
                <AlertIndicator className="h-full">
                  No tokens found
                </AlertIndicator>
              )}

              <AnimatePresence mode="popLayout">
                {data.map((token, index) => {
                  const baseKey = `${key}:${index}:${token.id}`;
                  const selected = selected_token_ids?.some(
                    (selected_token_id) => selected_token_id === token.id
                  );

                  return (
                    <div
                      key={`container:input-asset-select:${index}`}
                      className="contents"
                    >
                      <FallMotion height="2rem" customKey={baseKey}>
                        <div
                          onClick={() => {
                            const token_quote = getTokenQuote({
                              token_id: token.id,
                              token_quotes: propsTokenQuotes,
                            });

                            onSelect?.(token_quote);
                          }}
                          key={`fall-motion:${baseKey}`}
                          tabIndex={0}
                          className="relative h-8 w-full cursor-pointer rounded-md px-1 py-1 text-center text-primary transition-all duration-200 ease-in-out hover:bg-focus hover:text-black"
                        >
                          <div
                            key={index}
                            className={cn(
                              "body-2 z-10 grow overflow-hidden truncate text-ellipsis transition-colors duration-200 ease-in-out focus:bg-transparent",
                              selected ? "text-black" : "text-primary"
                            )}
                          >
                            <TokenDisplayer
                              symbolClassName="truncate text-ellipsis"
                              tokens={[token]}
                              symbols={true}
                            />

                            {selected && (
                              <div className="absolute right-0 top-0 mr-1 flex h-7 w-5 shrink-0 flex-col place-content-center items-center text-tertiary">
                                <CheckIcon className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                        </div>
                      </FallMotion>
                    </div>
                  );
                })}
              </AnimatePresence>
            </ul>

            <div className="mt-1 flex w-full flex-row items-center justify-between rounded-md border border-divider bg-z2 px-2 py-1 text-sm">
              <div className="text-secondary">
                Page
                <SpringNumber
                  defaultColor="text-secondary"
                  className="mx-1 inline-block"
                  numberFormatOptions={{
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }}
                  // previousValue={placeholderPage[0]}
                  previousValue={placeholderPage[1]}
                  currentValue={placeholderPage[1]}
                />
                of{" "}
                <SpringNumber
                  defaultColor="text-secondary"
                  numberFormatOptions={{
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }}
                  previousValue={
                    placeholderTotalPages[0] === 0
                      ? 1
                      : placeholderTotalPages[0]
                  }
                  currentValue={totalPages === 0 ? 1 : totalPages}
                  className="mx-1 inline-block"
                />
              </div>
              <div className="flex flex-row items-center gap-1">
                <div
                  onClick={handlePrevPage}
                  className={cn(
                    "h-5 w-5 rounded-md border border-divider bg-white text-tertiary transition-all duration-200 ease-in-out hover:bg-opacity-80 hover:text-secondary",
                    canPrevPage
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-50"
                  )}
                >
                  <ChevronLeftIcon className="h-5 w-5 " />
                </div>
                <div
                  onClick={handleNextPage}
                  className={cn(
                    "h-5 w-5 rounded-md border border-divider bg-white text-tertiary transition-all duration-200 ease-in-out hover:bg-opacity-80 hover:text-secondary",
                    canNextPage
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-50"
                  )}
                >
                  <ChevronRightIcon className="h-5 w-5 " />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);
