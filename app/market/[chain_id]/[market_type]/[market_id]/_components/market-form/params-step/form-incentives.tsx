import React, { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { FallMotion } from "@/components/animations";

import { z } from "zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type UseFormReturn } from "react-hook-form";

import { TokenDisplayer } from "@/components/common";

import { useSupportedTokens } from "@/sdk/hooks";
import { MarketFormSchema } from ".././market-form-schema";
import { Input } from "@/components/ui/input";
import {
  BadgeAlertIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleXIcon,
  DollarSign,
  Minimize2Icon,
  MinimizeIcon,
  PercentIcon,
  SearchIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { SpringNumber } from "@/components/composables";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useActiveMarket } from "../../hooks";
import { DollarInput, InputLabel, PercentInput } from "../../composables";

export const FormIncentives = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketForm: UseFormReturn<z.infer<typeof MarketFormSchema>>;
  }
>(({ className, marketForm, ...props }, ref) => {
  const { data: dataMarket } = useActiveMarket();

  const [open, setOpen] = React.useState(false);

  const [focusedId, setFocusedId] = React.useState<string | null>(null);

  const [search, setSearch] = React.useState<string>("");

  const [placeholderPage, setPlaceholderPage] = React.useState<Array<number>>([
    1, 1,
  ]);
  const [page, setPage] = React.useState<number>(1);

  const [placeholderTotalPages, setPlaceholderTotalPages] = React.useState<
    Array<number>
  >([1, 1]);

  const { data, totalPages } = useSupportedTokens({
    chain_id: dataMarket?.chain_id ?? 1,
    page,
    search,
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

  const resetPage = () => {
    setPage(1);
  };

  const changeIncentiveValue = ({
    index,
    type,
    value,
  }: {
    index: number;
    type: "aip" | "distribution" | "market_cap";
    value: string;
  }) => {
    let newIncentives = marketForm.watch("incentive_tokens");

    if (value === "") {
      newIncentives[index][type] = undefined;
      marketForm.setValue("incentive_tokens", newIncentives);
      return;
    } else if (!isNaN(parseFloat(value))) {
      // Prevent negative values
      if (parseFloat(value) < 0) {
        let newIncentives = marketForm.watch("incentive_tokens");
        newIncentives[index][type] = 0;
        marketForm.setValue("incentive_tokens", newIncentives);
      } else {
        let newIncentives = marketForm.watch("incentive_tokens");
        newIncentives[index][type] = parseFloat(value);
        marketForm.setValue("incentive_tokens", newIncentives);
      }
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
    <FormField
      control={marketForm.control}
      name="incentive_tokens"
      render={({ field }) => (
        <FormItem className={cn("space-y-1", className)}>
          <FormLabel className="subtitle-2 text-sm text-black">
            Incentives
          </FormLabel>

          <FormControl>
            <div className="h-fit">
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
                      height="2.25rem"
                      motionClassName="flex flex-col items-start"
                      contentClassName="body-2 text-left text-sm"
                    >
                      <div>Add Incentive</div>
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
                  className="-mt-2 flex w-64 flex-col p-1"
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
                    Suffix={() => {
                      if (search.length > 0) {
                        return (
                          <div
                            onClick={() => {
                              setSearch("");
                            }}
                            className="h-4 w-4 cursor-pointer text-secondary transition-all duration-200 ease-in-out hover:text-primary"
                          >
                            <CircleXIcon className="h-4 w-4" />
                          </div>
                        );
                      }
                    }}
                    className="mb-1 w-full"
                    containerClassName="h-8 font-light px-2 gap-2 bg-z2"
                    placeholder="Search Token"
                  />

                  <ul className="list mt-1 flex h-44 w-full flex-col gap-0 overflow-x-hidden overflow-y-scroll">
                    {data.length === 0 && (
                      <div className="flex h-full w-full flex-col place-content-center items-center">
                        <div className="h-6 w-6">
                          <BadgeAlertIcon
                            strokeWidth={1.5}
                            className="h-7 w-7 text-tertiary"
                          />
                        </div>

                        <div className="mt-1 font-ortica text-lg text-tertiary">
                          No Tokens Found
                        </div>
                      </div>
                    )}

                    {data.map((token, index) => {
                      const baseKey = `form-asset-select:${token.id}`;

                      return (
                        <div key={`container:${baseKey}`} className="contents">
                          {/* <FallMotion
                          key={`container:${baseKey}`}
                            height="1.75rem"
                            customKey={`form-asset-select:${token.id}`}
                            // delay={index * 0.05}
                          > */}
                          <motion.div
                            initial={{ opacity: 0, filter: "blur(1px)" }}
                            animate={{ opacity: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, filter: "blur(1px)" }}
                            transition={{
                              duration: 0.2,
                              ease: "easeInOut",
                            }}
                          >
                            <div
                              onClick={() => {
                                const incentiveExists = marketForm
                                  .watch("incentives")
                                  .find(
                                    (incentive) => incentive.id === token.id
                                  );

                                if (!incentiveExists) {
                                  marketForm.setValue("incentives", [
                                    ...marketForm.watch("incentives"),
                                    token,
                                  ]);
                                } else {
                                  marketForm.setValue(
                                    "incentives",
                                    marketForm
                                      .watch("incentives")
                                      .filter(
                                        (incentive) => incentive.id !== token.id
                                      )
                                  );
                                }

                                // marketForm.setValue("asset", token);
                              }}
                              // layout
                              // initial={false}
                              key={`form-asset-select:${token.id}`}
                              tabIndex={0}
                              className="relative h-7 w-full cursor-pointer rounded-md px-1 py-1 text-center text-primary transition-all duration-200 ease-in-out hover:bg-focus hover:text-black"
                              // onHoverStart={() => setFocusedId(baseKey)}
                            >
                              <div
                                key={index}
                                className={cn(
                                  "body-2 z-10 grow overflow-hidden truncate text-ellipsis transition-colors duration-200 ease-in-out focus:bg-transparent",
                                  focusedId === baseKey
                                    ? "text-black"
                                    : "text-primary"
                                )}
                                // value={token.id}
                              >
                                <TokenDisplayer
                                  symbolClassName="truncate text-ellipsis"
                                  tokens={[token]}
                                  symbols={true}
                                />

                                {marketForm.watch("incentives") &&
                                  marketForm
                                    .watch("incentives")
                                    .find(
                                      (incentive) => incentive.id === token.id
                                    ) && (
                                    <div className="absolute right-0 top-0 mr-1 flex h-7 w-5 shrink-0 flex-col place-content-center items-center text-tertiary">
                                      <CheckIcon className="h-5 w-5" />
                                    </div>
                                  )}
                              </div>
                            </div>
                          </motion.div>
                          {/* </FallMotion> */}
                        </div>
                      );
                    })}
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
                        previousValue={placeholderPage[0]}
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

              <div className="mt-1 h-48 min-h-10 w-full overflow-y-scroll rounded-md border border-divider bg-z2 p-1 text-sm font-300 text-secondary">
                {marketForm.watch("incentives").length > 0 ? (
                  <div className="flex flex-row flex-wrap gap-1">
                    {marketForm.watch("incentives").map((incentive, index) => {
                      const BASE_KEY = `incentive:${incentive.id}`;
                      return (
                        <div
                          key={index}
                          className="group relative flex w-full flex-col rounded-md border border-divider bg-white px-2 py-2"
                        >
                          <div className="flex w-full flex-row items-center justify-between">
                            <TokenDisplayer
                              size={5}
                              imageClassName="bg-z2"
                              symbolClassName="text-primary h-4 text-sm text-primary"
                              tokens={[incentive]}
                              symbols={true}
                            />

                            <div className="flex flex-row place-content-center items-center space-x-1">
                              <div
                                onClick={() => {
                                  marketForm.setValue(
                                    "incentives",
                                    marketForm
                                      .watch("incentives")
                                      .filter(
                                        (_incentive) =>
                                          _incentive.id !== incentive.id
                                      )
                                  );
                                }}
                                className="flex h-5 w-5 cursor-pointer flex-col place-content-center items-center rounded-md border border-divider bg-z2 transition-all duration-200 ease-in-out hover:bg-focus"
                              >
                                <Trash2Icon
                                  strokeWidth={1.5}
                                  className="h-3 w-3"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex w-full flex-col items-center">
                            <div className="mt-2 flex w-full flex-row items-center space-x-2">
                              <InputLabel label="Market Cap" className="mr-2" />

                              <Input
                                newHeight="h-8"
                                newLeading="leading-8"
                                Prefix={() => {
                                  return (
                                    <div className="flex h-4 w-4 flex-col place-content-center items-center">
                                      <DollarSign
                                        strokeWidth={1.5}
                                        className="h-4 w-4 text-black"
                                      />
                                    </div>
                                  );
                                }}
                                type="number"
                                step="any"
                                placeholder="Enter your value"
                                containerClassName="!h-8 grow gap-2 py-0 px-2 text-black"
                                className="text-sm"
                                value={incentive.market_cap}
                                onChange={(e: any) =>
                                  changeIncentiveValue({
                                    index,
                                    type: "market_cap",
                                    value: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className="mt-2 grid w-full grid-cols-2 items-center gap-2">
                              <div className="col-span-1 flex w-full flex-col items-start">
                                <InputLabel label="Yield" className="mb-1" />

                                <Input
                                  Suffix={() => {
                                    return (
                                      <div className="flex h-4 w-4 flex-col place-content-center items-center">
                                        <PercentIcon
                                          strokeWidth={1.5}
                                          className="h-4 w-4 text-black"
                                        />
                                      </div>
                                    );
                                  }}
                                  newHeight="h-8"
                                  newLeading="leading-8"
                                  type="number"
                                  step="any"
                                  placeholder="Enter your value"
                                  containerClassName="!h-8 grow gap-2 py-0 px-2 text-black"
                                  className="text-sm"
                                  value={incentive.aip}
                                  onChange={(e: any) =>
                                    changeIncentiveValue({
                                      index,
                                      type: "aip",
                                      value: e.target.value,
                                    })
                                  }
                                />
                              </div>

                              <div className="col-span-1 flex w-full flex-col items-start">
                                <InputLabel
                                  label="Distribution"
                                  className="mb-1"
                                />

                                <Input
                                  Suffix={() => {
                                    return (
                                      <div className="flex h-5 w-fit flex-col place-content-center items-center text-sm">
                                        <span className="leading-5">
                                          {`${incentive.symbol.toUpperCase()}/year`}
                                        </span>
                                      </div>
                                    );
                                  }}
                                  newHeight="h-8"
                                  newLeading="leading-8"
                                  type="number"
                                  step="any"
                                  placeholder=""
                                  containerClassName="!h-8 grow gap-2 py-0 px-2 text-black"
                                  className="text-sm"
                                  value={incentive.distribution}
                                  onChange={(e: any) =>
                                    changeIncentiveValue({
                                      index,
                                      type: "distribution",
                                      value: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>

                          {/* <div className="absolute inset-0 flex h-full w-full flex-col place-content-center items-center rounded-full bg-white bg-opacity-50 text-white opacity-0 backdrop-blur-[0.05rem] transition-all duration-200 ease-in-out group-hover:text-primary group-hover:opacity-100">
                            <CircleXIcon
                              onClick={() => {
                                marketForm.setValue(
                                  "incentives",
                                  marketForm
                                    .watch("incentives")
                                    .filter(
                                      (_incentive) =>
                                        _incentive.id !== incentive.id
                                    )
                                );
                              }}
                              className="ml-1 h-4 w-4 cursor-pointer"
                            />
                          </div> */}
                        </div>
                      );
                      // return (
                      //   <div
                      //     key={index}
                      //     className="flex h-5 rounded-md border border-divider bg-white px-1"
                      //   >
                      //     <TokenDisplayer
                      //       size={4}
                      //       symbolClassName="text-primary h-[0.9rem] text-xs -ml-1 text-secondary"
                      //       tokens={[incentive]}
                      //       symbols={true}
                      //     />
                      //   </div>
                      // );
                    })}
                  </div>
                ) : (
                  <div className="flex h-full flex-col place-content-center items-center overflow-hidden px-2 py-1">
                    <div className="flex h-5">
                      <span className="mt-[0.15rem] leading-5">
                        No incentives added
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* <div className="mt-1 min-h-10 w-full rounded-md border border-divider bg-z2 p-1 text-sm font-300 text-secondary">
                {marketForm.watch("incentives").length > 0 ? (
                  <div className="flex flex-row flex-wrap gap-1">
                    {marketForm.watch("incentives").map((incentive, index) => {
                      const BASE_KEY = `incentive:${incentive.id}`;
                      return (
                        <div
                          key={index}
                          className="group relative flex rounded-full border border-divider bg-white p-1 pr-2"
                        >
                          <TokenDisplayer
                            size={5}
                            imageClassName="bg-z2"
                            symbolClassName="text-primary h-4 text-sm text-secondary"
                            tokens={[incentive]}
                            symbols={true}
                          />

                          <div className="absolute inset-0 flex h-full w-full flex-col place-content-center items-center rounded-full bg-white bg-opacity-50 text-white opacity-0 backdrop-blur-[0.05rem] transition-all duration-200 ease-in-out group-hover:text-primary group-hover:opacity-100">
                            <CircleXIcon
                              onClick={() => {
                                marketForm.setValue(
                                  "incentives",
                                  marketForm
                                    .watch("incentives")
                                    .filter(
                                      (_incentive) =>
                                        _incentive.id !== incentive.id
                                    )
                                );
                              }}
                              className="ml-1 h-4 w-4 cursor-pointer"
                            />
                          </div>
                        </div>
                      );
                      // return (
                      //   <div
                      //     key={index}
                      //     className="flex h-5 rounded-md border border-divider bg-white px-1"
                      //   >
                      //     <TokenDisplayer
                      //       size={4}
                      //       symbolClassName="text-primary h-[0.9rem] text-xs -ml-1 text-secondary"
                      //       tokens={[incentive]}
                      //       symbols={true}
                      //     />
                      //   </div>
                      // );
                    })}
                  </div>
                ) : (
                  <div className="flex h-full flex-col place-content-center items-center overflow-hidden px-2 py-1">
                    <div className="flex h-5">
                      <span className="mt-[0.15rem] leading-5">
                        No Preference
                      </span>
                    </div>
                  </div>
                )}
              </div> */}
            </div>
          </FormControl>

          {/* <div>
            <FormDescription className="mt-0">
              What can be deposited into the market
            </FormDescription>
          </div> */}

          <FormMessage />
        </FormItem>
      )}
    />
  );
});
