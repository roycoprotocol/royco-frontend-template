"use client";

import React from "react";
import { motion } from "framer-motion";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { TokenDisplayer } from "@/components/common";

import { useSupportedChains } from "royco/hooks";
import { type MarketBuilderFormSchema } from "../../market-builder-form";
import { FormInputLabel } from "@/components/composables";
import { getFrontendTag } from "@/store";

const getSupportedChainsOptions = () => {
  const frontendTag =
    typeof window !== "undefined" ? getFrontendTag() : "default";

  if (frontendTag === "dev") {
    return {
      testnet: true,
    };
  }

  return {
    testnet: false,
  };
};

export const FormChain = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketBuilderForm: UseFormReturn<z.infer<typeof MarketBuilderFormSchema>>;
  }
>(({ className, marketBuilderForm, ...props }, ref) => {
  const { data } = useSupportedChains(getSupportedChainsOptions());

  return (
    <FormField
      control={marketBuilderForm.control}
      name="chain"
      render={({ field }) => (
        <FormItem className={cn("", className)}>
          <FormInputLabel className="mb-2" label="Chain" />

          <Select
            onValueChange={(e) => {
              const newChain = data.find((chain) => chain.id === parseInt(e));

              if (newChain) {
                // @ts-ignore
                marketBuilderForm.setValue("chain", newChain);
              }
            }}
            defaultValue={marketBuilderForm.watch("chain").id.toString()}
          >
            <FormControl>
              <SelectTrigger className="body-2 h-10 w-full text-primary">
                <div className="w-full">
                  <FallMotion
                    height="2.5rem"
                    motionClassName="flex flex-col items-start"
                    contentClassName="body-2 text-left"
                  >
                    <TokenDisplayer
                      tokens={[
                        {
                          id: marketBuilderForm.watch("chain").name,
                          symbol:
                            marketBuilderForm.watch("chain").nativeCurrency
                              .symbol,
                          image: marketBuilderForm.watch("chain").image,
                          name: marketBuilderForm.watch("chain").name,
                        },
                      ]}
                      symbols={true}
                      name={true}
                    />
                  </FallMotion>
                </div>
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <ul className="list-none gap-0">
                {data.map((chain, index) => {
                  const baseKey = `form-chain-select:${chain.id}`;

                  return (
                    <SelectItem
                      key={index}
                      className={cn(
                        "body-2 z-10 transition-colors duration-200 ease-in-out"
                      )}
                      value={chain.id.toString()}
                    >
                      <TokenDisplayer
                        tokens={[
                          {
                            id: chain.name,
                            symbol: chain.nativeCurrency.symbol,
                            image: chain.image,
                            name: chain.name,
                          },
                        ]}
                        symbols={true}
                        name={true}
                      />
                    </SelectItem>
                  );
                })}
              </ul>
            </SelectContent>

            <FormDescription className="mt-2">
              Chain that the market is deployed on.
            </FormDescription>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
});
