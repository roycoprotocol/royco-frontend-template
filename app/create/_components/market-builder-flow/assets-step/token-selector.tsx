"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useBaseTokens } from "@/sdk/hooks";
import { PoolFormUtilities } from "../../market-builder-form";
import { Button } from "@/components/ui/button";
import { CheckIcon, CirclePlusIcon } from "lucide-react";
import { FormControl, FormField, FormItem } from "@/components/ui/form";

export const TokenSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & PoolFormUtilities
>(
  (
    {
      className,
      watchMarketBuilderForm,
      setValueMarketBuilderForm,
      controlMarketBuilderForm,
      ...props
    },
    ref
  ) => {
    const {
      data: baseTokens,
      isLoading: isLoadingBaseTokens,
      isError: isErrorBaseTokens,
      isRefetching: isRefetchingBaseTokens,
    } = useBaseTokens();

    const baseTokenOptions = baseTokens
      ?.filter(
        (token) =>
          token.chain_id.toString() ===
          watchMarketBuilderForm("chain").id.toString()
      )
      .sort((a, b) => a.symbol.localeCompare(b.symbol));

    return (
      <FormField
        control={controlMarketBuilderForm}
        name="assets"
        render={({ field }) => {
          return (
            <FormItem>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      onClick={() => console.log("add asset")}
                      className={cn(
                        "body-2 group z-10 h-8 w-fit rounded-lg border border-divider bg-z2 px-3 text-primary hover:bg-focus",
                        "mt-[2px]"
                      )}
                    >
                      <div>Add Asset</div>
                      <CirclePlusIcon
                        strokeWidth={1.5}
                        className="ml-[0.3rem] h-5 w-5"
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-56 p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search tokens..."
                        className="body-2 h-10"
                      />
                      <CommandEmpty>No tokens found.</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {!!baseTokenOptions &&
                            baseTokenOptions.map((token) => {
                              return (
                                <CommandItem
                                  className="cursor-pointer rounded-md"
                                  key={`token:${token.id}`}
                                  value={token.symbol}
                                  onSelect={() => {
                                    if (
                                      watchMarketBuilderForm("assets").some(
                                        (value) =>
                                          value.address.toLowerCase() ===
                                          token.contract_address.toLowerCase()
                                      )
                                    ) {
                                      setValueMarketBuilderForm(
                                        "assets",
                                        watchMarketBuilderForm("assets").filter(
                                          (value) =>
                                            value.address.toLowerCase() !==
                                            token.contract_address.toLowerCase()
                                        )
                                      );
                                    } else {
                                      setValueMarketBuilderForm("assets", [
                                        /**
                                         * @TODO Strictly type this
                                         */
                                        // @ts-ignore
                                        ...field.value,
                                        // @ts-ignore
                                        {
                                          address:
                                            token.contract_address as `0x${string}`,
                                          symbol: token.symbol,
                                          image: token.image,
                                          // @TODO: Add real decimals to token object
                                          decimals: 18,
                                          price_type: "hardcoded_price",
                                        },
                                      ]);
                                    }
                                  }}
                                >
                                  <div className="flex w-full flex-row items-center space-x-3">
                                    <img
                                      src={token.image}
                                      className="h-5 w-5 rounded-full"
                                      alt={`Logo of ${token.symbol} token.`}
                                    />

                                    <div className="body-2 h-5 grow uppercase">
                                      <span className="leading-5">
                                        {token.symbol}
                                      </span>
                                    </div>

                                    <CheckIcon
                                      className={cn(
                                        "h-4 w-4 shrink-0",
                                        watchMarketBuilderForm("assets").some(
                                          (value) =>
                                            value.address ===
                                            token.contract_address
                                        )
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </div>
                                </CommandItem>
                              );
                            })}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
            </FormItem>
          );
        }}
      />
    );
  }
);
