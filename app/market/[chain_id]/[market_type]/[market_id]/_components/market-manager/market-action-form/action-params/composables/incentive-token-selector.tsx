import React, { Fragment, useEffect, useState } from "react";
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
import { AnimatePresence } from "framer-motion";
import { LoadingSpinner } from "@/components/composables";
import { Badge } from "@/components/ui/badge";
import { useAccount } from "wagmi";
import { loadableEnrichedMarketAtom } from "@/store/market";
import { useAtomValue } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/api/royco";
import { Filter } from "royco/api";
import { defaultQueryOptions } from "@/utils/query";

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
    const { data: enrichedMarket } = useAtomValue(loadableEnrichedMarketAtom);

    const { address } = useAccount();

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [pageIndex, setPageIndex] = useState(1);
    const [type, setType] = useState<"point" | "token" | "lp">("token");

    const { data: propsTokens, isLoading } = useQuery({
      queryKey: [
        "allowed-tokens",
        {
          enrichedMarketId: enrichedMarket?.id,
          type,
          token_ids,
          not_token_ids,
          search,
          pageIndex,
        },
      ],
      queryFn: async () => {
        if (!enrichedMarket) throw new Error("Enriched market not found");

        let filters: Filter[] = [
          {
            id: "chainId",
            value: enrichedMarket.chainId,
          },
          {
            id: "type",
            value: type,
          },
        ];

        if (token_ids && token_ids.length > 0) {
          filters.push({
            id: "id",
            value: token_ids,
            condition: "inArray",
          });
        } else if (not_token_ids && not_token_ids.length > 0) {
          filters.push({
            id: "id",
            value: not_token_ids,
            condition: "notInArray",
          });
        }

        return api
          .tokenControllerGetTokenDirectory({
            filters,
            searchKey: search.trim().length > 0 ? search : undefined,
            page: {
              index: pageIndex,
              size: 20,
            },
          })
          .then((res) => res.data);
      },
      ...defaultQueryOptions,
    });

    const canPrevPage = pageIndex > 1;
    const canNextPage = pageIndex < (propsTokens?.page.total ?? 1);

    const handleNextPage = () => {
      if (canNextPage) {
        setPageIndex(pageIndex + 1);
      }
    };

    const handlePrevPage = () => {
      if (canPrevPage) {
        setPageIndex(pageIndex - 1);
      }
    };

    useEffect(() => {
      setPageIndex(1);
    }, [type]);

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
              "-mt-2 flex h-72 w-full flex-col p-1",
              "max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width]"
            )}
          >
            {isLoading ? (
              <div className="flex h-full w-full flex-col items-center justify-center">
                <LoadingSpinner className="h-5 w-5" />
              </div>
            ) : (
              <Fragment>
                <div className="mb-2 flex flex-row items-center gap-1">
                  <Badge
                    variant={
                      type === "token" || type === "lp"
                        ? "default"
                        : "secondary"
                    }
                    onClick={() => {
                      setType("token");
                    }}
                  >
                    Tokens
                  </Badge>

                  <Badge
                    variant={type === "point" ? "default" : "secondary"}
                    onClick={() => {
                      setType("point");
                    }}
                  >
                    Points
                  </Badge>
                </div>

                <Input
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPageIndex(1);
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
                  containerClassName="h-8 font-light px-2 gap-2 bg-z2"
                  placeholder="Search..."
                />

                <ul className="list mt-1 flex w-full grow flex-col gap-0 overflow-x-hidden overflow-y-scroll">
                  {propsTokens?.data.length === 0 && (
                    <AlertIndicator className="h-full">
                      No{" "}
                      {type === "token" || type === "lp" ? "tokens" : "points"}{" "}
                      found
                    </AlertIndicator>
                  )}

                  <AnimatePresence mode="popLayout">
                    {propsTokens?.data.map((token, index) => {
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
                                onSelect?.(token);
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
                    Page {propsTokens?.page.index} of {propsTokens?.page.total}
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
              </Fragment>
            )}
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);
