"use client";

import React from "react";
import { PoolFormType, PoolFormUtilities } from "../../market-builder-form";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { FallMotion } from "@/components/animations";
import { motion } from "framer-motion";
import { useMarketBuilderManager } from "@/store";

export const InputTypeSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    actionIndex: number;
    inputIndex: number;
  } & {
    marketBuilderForm: PoolFormType;
  }
>(
  (
    { className, actionIndex, inputIndex, marketBuilderForm, ...props },
    ref
  ) => {
    const { actionsType } = useMarketBuilderManager();

    return (
      <FormField
        control={marketBuilderForm.control}
        name={actionsType}
        render={({ field }) => (
          <FormItem className="space-y-0">
            <Select
              onValueChange={(e) => {
                let newActions = [...marketBuilderForm.watch(actionsType)];
                newActions[actionIndex].inputs[inputIndex].input_type = e as
                  | "fixed"
                  | "dynamic";
                marketBuilderForm.setValue(actionsType, newActions);
              }}
              value={
                marketBuilderForm.watch(actionsType)[actionIndex].inputs[
                  inputIndex
                ].input_type
              }
            >
              <FormControl>
                <SelectTrigger className="body-2 w-full rounded-none border-none p-0 px-3 text-primary">
                  <div className="w-full">
                    <FallMotion
                      customKey={
                        marketBuilderForm.watch(actionsType)[actionIndex]
                          .inputs[inputIndex].input_type
                      }
                      // customKey={
                      //   marketBuilderForm.watch("actions")[actionIndex].inputs[inputIndex]
                      //     .input_type
                      // }
                      height="2rem"
                      motionClassName="flex flex-col items-start"
                      contentClassName="body-2 text-left"
                    >
                      {marketBuilderForm.watch(actionsType)[actionIndex].inputs[
                        inputIndex
                      ].input_type === "fixed"
                        ? "Fixed"
                        : "Dynamic"}
                    </FallMotion>
                  </div>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <ul className="list gap-0">
                  {[
                    {
                      id: "fixed",
                      label: "Fixed",
                    },
                    {
                      id: "dynamic",
                      label: "Dynamic",
                    },
                  ].map((item, index) => {
                    const BASE_KEY = `input-type:${actionIndex}:${inputIndex}:${item.id}`;

                    return (
                      <SelectItem
                        key={BASE_KEY}
                        className={cn(
                          "body-2 z-10 transition-colors duration-200 ease-in-out"
                        )}
                        value={item.id}
                      >
                        {item.label}
                      </SelectItem>
                    );
                  })}
                </ul>
              </SelectContent>
            </Select>
            {/* <FormMessage /> */}
          </FormItem>
        )}
      />
    );
  }
);
