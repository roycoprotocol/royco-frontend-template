"use client";

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

import { AlertIndicator, TokenDisplayer } from "@/components/common";

import { useSupportedTokens } from "royco/hooks";
import { type MarketBuilderFormSchema } from "../../market-builder-form";
import { Input } from "@/components/ui/input";
import {
  BadgeAlertIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleHelpIcon,
  CircleXIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { FormInputLabel, SpringNumber } from "@/components/composables";
import { MotionWrapper } from "../animations";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const FormAsset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketBuilderForm: UseFormReturn<z.infer<typeof MarketBuilderFormSchema>>;
  }
>(({ className, marketBuilderForm, ...props }, ref) => {
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
    chain_id: marketBuilderForm.watch("chain").id,
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

  useEffect(() => {
    resetPage();
  }, [marketBuilderForm.watch("chain")]);

  return (
    <FormField
      control={marketBuilderForm.control}
      name="asset"
      render={({ field }) => (
        <FormItem className={cn("", className)}>
          <FormInputLabel className="mb-2" label="Input Asset" />

          <FormControl>
            <div className="relative h-10">
              <AnimatePresence mode="popLayout">
                {marketBuilderForm.watch("action_type") !== "recipe" && (
                  <motion.div
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                      type: "spring",
                      damping: 25,
                      stiffness: 300,
                    }}
                    className="absolute left-0 top-0 z-10 h-full w-full cursor-not-allowed bg-white bg-opacity-50 backdrop-saturate-0"
                  ></motion.div>
                )}
              </AnimatePresence>

              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger
                  asChild
                  className="body-2 h-[2.5rem] w-full cursor-pointer rounded-md border border-divider px-3 text-primary"
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
                      height="2.5rem"
                      motionClassName="flex flex-col items-start"
                      contentClassName="body-2 text-left"
                    >
                      {marketBuilderForm.watch("asset") ? (
                        <TokenDisplayer
                          tokens={[marketBuilderForm.watch("asset")]}
                          symbols={true}
                        />
                      ) : (
                        <div>Select Asset</div>
                      )}
                    </FallMotion>

                    <div
                      className={cn(
                        "absolute right-0 top-0 flex h-10 w-10 flex-col place-content-center items-center",
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
                    // Suffix={() => {
                    //   if (search.length > 0) {
                    //     return (
                    //       <div
                    //         onClick={() => {
                    //           setSearch("");
                    //         }}
                    //         className="flex h-4 w-4 cursor-pointer flex-col place-content-center items-center rounded-full bg-tertiary text-white transition-all duration-200 ease-in-out hover:bg-secondary"
                    //       >
                    //         <XIcon strokeWidth={2.5} className="h-3 w-3" />
                    //       </div>
                    //     );
                    //   }
                    // }}
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

                        return (
                          <div
                            key={`container:input-asset-select:${index}`}
                            className="contents"
                          >
                            <FallMotion
                              // key={`container:${baseKey}`}
                              height="1.75rem"
                              customKey={`form-asset-select:${token.id}`}
                              // delay={index * 0.05}
                            >
                              {/* <motion.div
                            initial={{ opacity: 0, filter: "blur(1px)" }}
                            animate={{ opacity: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, filter: "blur(1px)" }}
                            transition={{
                              duration: 0.2,
                              ease: "easeInOut",
                            }}
                          > */}
                              <div
                                onClick={() => {
                                  marketBuilderForm.setValue("asset", token);
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

                                  {marketBuilderForm.watch("asset") &&
                                    marketBuilderForm.watch("asset").id ===
                                      token.id && (
                                      <div className="absolute right-0 top-0 mr-1 flex h-7 w-5 shrink-0 flex-col place-content-center items-center text-tertiary">
                                        <CheckIcon className="h-5 w-5" />
                                      </div>
                                    )}
                                </div>
                              </div>
                              {/* </motion.div> */}
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
          </FormControl>

          <FormDescription className="mt-2">
            Asset that users will provide.
          </FormDescription>

          <FormMessage />
        </FormItem>
      )}
    />
  );
});
