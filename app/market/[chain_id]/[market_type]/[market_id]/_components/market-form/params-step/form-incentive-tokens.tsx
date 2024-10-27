import React, { useEffect } from "react";

import { cn } from "@/lib/utils";

import { z } from "zod";
import { FormField, FormItem } from "@/components/ui/form";
import { type UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { MarketFormSchema } from ".././market-form-schema";
import { AlertIndicator, TokenDisplayer } from "@/components/common";
import { useActiveMarket } from "../../hooks";
import {
  BASE_MARGIN_TOP,
  FormInputLabel,
  InputLabel,
  SecondaryLabel,
  TertiaryLabel,
} from "../../composables";

import { AnimatePresence } from "framer-motion";
import { useSupportedTokens } from "@/sdk/hooks";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react";
import { SpringNumber } from "@/components/composables";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FallMotion } from "@/components/animations";
import {
  MarketActionType,
  MarketType,
  MarketUserType,
  useMarketManager,
} from "@/store";
import { isSolidityIntValid } from "@/sdk/utils";
import { BigNumber, ethers } from "ethers";

import { motion } from "framer-motion";
import { DateTimePicker } from "@/components/ui/date-time-picker";

export const FormIncentiveTokens = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketForm: UseFormReturn<z.infer<typeof MarketFormSchema>>;
  }
>(({ className, marketForm, ...props }, ref) => {
  const { userType } = useMarketManager();
  const { marketMetadata, currentMarketData } = useActiveMarket();

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
    chain_id: marketMetadata.chain_id,
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

  useEffect(() => {
    updatePlaceholderPage();
  }, [page]);

  useEffect(() => {
    updatePlaceholderTotalPages();
  }, [totalPages]);

  useEffect(() => {
    resetPlaceholders();
  }, [open]);

  const changeIncentiveValue = ({
    index,
    type,
    value,
  }: {
    index: number;
    type:
      | "amount"
      | "aip"
      | "distribution"
      | "fdv"
      | "start_timestamp"
      | "end_timestamp"
      | "allocation";
    value: string | Date | undefined;
  }) => {
    // console.log("changeIncentiveValue", index, type, value);

    try {
      let newIncentives = marketForm.watch("incentive_tokens");
      // @ts-ignore
      newIncentives[index][type] = value;
      marketForm.setValue("incentive_tokens", newIncentives);
    } catch (err) {}

    // try {
    //   let newIncentives = marketForm.watch("incentive_tokens");

    //   if (!!newIncentives && index < newIncentives.length) {
    //     if (value === undefined && value === "") {
    //       newIncentives[index][type] = undefined;

    //       if (type === "amount") {
    //         newIncentives[index]["raw_amount"] = undefined;
    //         newIncentives[index]["amount"] = value;
    //         newIncentives[index]["raw_amount"] = value;
    //       }

    //       marketForm.setValue("incentive_tokens", newIncentives);
    //     } else {
    //       if (type === "amount") {
    //         try {
    //           const decimals = newIncentives[index].decimals;
    //           // @ts-ignore
    //           const rawAmount = ethers.utils.formatUnits(
    //             value?.toString() || "0",
    //             decimals
    //           );

    //           // const rawAmount = BigNumber.from(value.toString())
    //           //   .mul(BigNumber.from(10).pow(decimals))
    //           //   .toString();
    //           const amount = value;

    //           if (isSolidityIntValid("uint256", rawAmount)) {
    //             newIncentives[index]["raw_amount"] = rawAmount;
    //             // @ts-ignore
    //             newIncentives[index]["amount"] = amount;
    //           }
    //         } catch (e) {
    //           // @ts-ignore
    //           newIncentives[index]["raw_amount"] = value;
    //           // @ts-ignore
    //           newIncentives[index]["amount"] = value;
    //         }
    //       } else {
    //         // @ts-ignore
    //         newIncentives[index][type] = value;
    //       }

    //       marketForm.setValue("incentive_tokens", newIncentives);
    //     }
    //   }
    // } catch (e) {
    //   let newIncentives = marketForm.watch("incentive_tokens");
    //   newIncentives[index][type] = value;
    //   marketForm.setValue("incentive_tokens", newIncentives);

    //   // console.log("e", e);
    // }
  };

  if (!!currentMarketData) {
    return (
      <FormField
        control={marketForm.control}
        name="incentive_tokens"
        render={({ field }) => (
          <FormItem className={cn("", className)}>
            <FormInputLabel
              size="sm"
              label={
                userType === MarketUserType.ap.id
                  ? "Incentives Asked"
                  : "Incentives Offered"
              }
              info={
                userType === MarketUserType.ap.id
                  ? "The amount of incentives you are asking to perform the action"
                  : "The amount of incentives you are offering to perform the action"
              }
            />

            <div className="mt-1 h-fit">
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
                        const baseKey = `form-asset-select:${token.id}`;
                        const incentiveTokens =
                          marketForm.watch("incentive_tokens") ?? [];

                        return (
                          <div
                            key={`container:input-asset-select:${index}`}
                            className="contents"
                          >
                            <FallMotion
                              height="1.75rem"
                              customKey={`form-asset-select:${token.id}`}
                            >
                              <div
                                onClick={() => {
                                  marketForm.setValue(
                                    "incentive_tokens",
                                    incentiveTokens.some(
                                      (incentive_token) =>
                                        incentive_token.id.toLowerCase() ===
                                        token.id.toLowerCase()
                                    )
                                      ? incentiveTokens.filter(
                                          (incentive_token) =>
                                            incentive_token.id.toLowerCase() !==
                                            token.id.toLowerCase()
                                        )
                                      : [
                                          ...incentiveTokens,
                                          {
                                            ...token,
                                            amount: "",
                                          },
                                        ]
                                  );
                                }}
                                key={`form-asset-select:${token.id}`}
                                tabIndex={0}
                                className="relative h-7 w-full cursor-pointer rounded-md px-1 py-1 text-center text-primary transition-all duration-200 ease-in-out hover:bg-focus hover:text-black"
                              >
                                <div
                                  key={index}
                                  className={cn(
                                    "body-2 z-10 grow overflow-hidden truncate text-ellipsis transition-colors duration-200 ease-in-out focus:bg-transparent",
                                    focusedId === baseKey
                                      ? "text-black"
                                      : "text-primary"
                                  )}
                                >
                                  <TokenDisplayer
                                    symbolClassName="truncate text-ellipsis"
                                    tokens={[token]}
                                    symbols={true}
                                  />

                                  {incentiveTokens.some(
                                    (incentive_token) =>
                                      incentive_token.id === token.id
                                  ) && (
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

            <div className="mt-2 h-fit min-h-10 w-full overflow-y-scroll rounded-xl border border-divider bg-z2 p-1 text-sm font-300 text-secondary">
              {marketForm.watch("incentive_tokens").length > 0 ? (
                <div className="flex flex-row flex-wrap gap-1">
                  {marketForm
                    .watch("incentive_tokens")
                    .map((incentive_token, index) => {
                      const BASE_KEY = `incentive:${incentive_token.id}:input-amount`;

                      return (
                        <motion.div
                          layout="position"
                          key={BASE_KEY}
                          className={cn(
                            "flex w-full flex-col items-center gap-1",
                            marketMetadata.market_type ===
                              MarketType.vault.id &&
                              "rounded-lg border border-divider bg-white p-1"
                          )}
                        >
                          {/**
                           * Amount and market cap
                           */}
                          <div className="flex w-full flex-row items-center gap-1">
                            <Input
                              type="number"
                              step="any"
                              containerClassName="h-9 text-sm bg-white grow text-black"
                              className=""
                              placeholder={
                                marketMetadata.market_type ===
                                  MarketType.vault.id &&
                                userType === MarketUserType.ap.id
                                  ? "Market Cap"
                                  : "Amount"
                              }
                              defaultValue={undefined}
                              value={
                                marketMetadata.market_type ===
                                  MarketType.vault.id &&
                                userType === MarketUserType.ap.id
                                  ? marketForm.watch("incentive_tokens")[index]
                                      .fdv
                                  : marketForm.watch("incentive_tokens")[index]
                                      .amount
                              }
                              onChange={(e) => {
                                changeIncentiveValue({
                                  index,
                                  type:
                                    marketMetadata.market_type ===
                                      MarketType.vault.id &&
                                    userType === MarketUserType.ap.id
                                      ? "fdv"
                                      : "amount",
                                  value: e.target.value,
                                });
                              }}
                              min="0"
                              Suffix={() => {
                                return (
                                  <TokenDisplayer
                                    size={4}
                                    className="gap-1"
                                    tokens={[
                                      {
                                        ...incentive_token,
                                        symbol: `${incentive_token.symbol.toUpperCase()}${
                                          marketMetadata.market_type ===
                                            MarketType.vault.id &&
                                          userType === MarketUserType.ap.id
                                            ? ""
                                            : ""
                                        }`,
                                      },
                                    ]}
                                    symbols={true}
                                  />
                                );
                              }}
                            />

                            <div
                              onClick={() => {
                                if (
                                  marketForm.watch("incentive_tokens") ===
                                  undefined
                                ) {
                                  marketForm.setValue("incentive_tokens", []);
                                }

                                if (
                                  marketForm.watch("incentive_tokens") !==
                                  undefined
                                ) {
                                  marketForm.setValue(
                                    "incentive_tokens",
                                    // @ts-ignore
                                    marketForm.watch("incentive_tokens").filter(
                                      // @ts-ignore
                                      (_incentive_token) =>
                                        // @ts-ignore
                                        _incentive_token.id !==
                                        incentive_token.id
                                    )
                                  );
                                }
                              }}
                              className="flex h-8  w-8 shrink-0 cursor-pointer flex-col place-content-center items-center rounded-md bg-error text-white transition-all duration-200 ease-in-out hover:opacity-80"
                            >
                              <Trash2Icon strokeWidth={2} className="h-4 w-4" />
                            </div>
                          </div>

                          {/**
                           * AIP and Distribution
                           */}
                          {marketMetadata.market_type === MarketType.vault.id &&
                            userType === MarketUserType.ap.id && (
                              <div className="flex w-full flex-row items-center gap-1">
                                <Input
                                  type="number"
                                  step="any"
                                  containerClassName={cn(
                                    "h-9 text-sm bg-white grow text-black",
                                    marketMetadata.market_type ===
                                      MarketType.vault.id &&
                                      userType === MarketUserType.ip.id &&
                                      "hidden"
                                  )}
                                  className=""
                                  placeholder="AIP"
                                  defaultValue={undefined}
                                  value={
                                    marketForm.watch("incentive_tokens")[index]
                                      .aip
                                  }
                                  onChange={(e) => {
                                    changeIncentiveValue({
                                      index,
                                      type: "aip",
                                      value: e.target.value,
                                    });
                                  }}
                                  min="0"
                                  Suffix={() => {
                                    return (
                                      <SecondaryLabel className="font-light text-black">
                                        %
                                      </SecondaryLabel>
                                    );
                                  }}
                                />

                                <Input
                                  type="number"
                                  step="any"
                                  containerClassName="h-9 text-sm bg-white grow text-black"
                                  className=""
                                  placeholder="Distribution"
                                  defaultValue={undefined}
                                  value={
                                    marketForm.watch("incentive_tokens")[index]
                                      .distribution
                                  }
                                  onChange={(e) => {
                                    changeIncentiveValue({
                                      index,
                                      type: "distribution",
                                      value: e.target.value,
                                    });
                                  }}
                                  min="0"
                                  Suffix={() => {
                                    return (
                                      <SecondaryLabel className="font-light text-black">
                                        {`${marketForm.watch("incentive_tokens")[index].symbol.toUpperCase()}/year`}
                                      </SecondaryLabel>
                                    );
                                  }}
                                />
                              </div>
                            )}

                          {/**
                           * Start Timestamp
                           */}
                          {marketMetadata.market_type === MarketType.vault.id &&
                            userType === MarketUserType.ip.id && (
                              <div className="flex w-full flex-row items-center gap-1">
                                <SecondaryLabel className="flex h-full w-14 flex-col place-content-center items-center rounded-lg border border-divider bg-z2 font-normal leading-6">
                                  Start
                                </SecondaryLabel>

                                <div className="grow">
                                  <DateTimePicker
                                    className="text-sm font-300 text-black"
                                    date={
                                      marketForm.watch("incentive_tokens")[
                                        index
                                      ].start_timestamp
                                    }
                                    setDate={(date: Date | undefined) => {
                                      changeIncentiveValue({
                                        index,
                                        type: "start_timestamp",
                                        value: date,
                                      });
                                    }}
                                  />
                                </div>
                              </div>
                            )}

                          {/**
                           * End Timestamp
                           */}
                          {marketMetadata.market_type === MarketType.vault.id &&
                            userType === MarketUserType.ip.id && (
                              <div className="flex w-full flex-row items-center gap-1">
                                <SecondaryLabel className="flex h-full w-14 flex-col place-content-center items-center rounded-lg border border-divider bg-z2 font-normal leading-6">
                                  End
                                </SecondaryLabel>

                                <div className="grow">
                                  <DateTimePicker
                                    className="text-sm font-300 text-black"
                                    date={
                                      marketForm.watch("incentive_tokens")[
                                        index
                                      ].end_timestamp
                                    }
                                    setDate={(date: Date | undefined) => {
                                      changeIncentiveValue({
                                        index,
                                        type: "end_timestamp",
                                        value: date,
                                      });
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                        </motion.div>
                      );
                    })}
                </div>
              ) : (
                <AlertIndicator className="h-full">
                  No incentives added
                </AlertIndicator>
              )}
            </div>
          </FormItem>
        )}
      />
    );
  }
});
