"use client";

import { FallMotion } from "@/components/animations";
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
import React, { Fragment, useEffect } from "react";

import { cn } from "@/lib/utils";
import { useMarketBuilder } from "@/store";
import { isEqual } from "lodash";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { FunctionFormSchema } from "./function-form-schema";
import { toFunctionSelector } from "viem";
import { ScrollArea } from "@/components/ui/scroll-area";

export const FormFunctionSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    functionForm: UseFormReturn<z.infer<typeof FunctionFormSchema>>;
  }
>(({ className, functionForm, ...props }, ref) => {
  // export const FormFunctionSelector = ({
  //   watch,
  //   setValue,
  //   control,
  // }: {
  //   setValue: any;
  //   watch: any;
  //   control: any;
  // }) => {
  const { availableFunctions } = useMarketBuilder();

  const resetContractFunction = () => {
    const matchingContractFunction = availableFunctions.find(
      (contractFunction) =>
        isEqual(contractFunction, functionForm.watch("contract_function"))
    );

    if (!matchingContractFunction) {
      // @ts-ignore
      functionForm.setValue("contract_function", undefined);
    }
  };

  useEffect(() => {
    resetContractFunction();
  }, [availableFunctions]);

  return (
    <div ref={ref} className="contents">
      <FormField
        control={functionForm.control}
        name="contract_function"
        render={({ field }) => (
          <FormItem className="mt-5">
            <FormLabel className="mb-2">Contract Function</FormLabel>
            <Select
              value={
                functionForm.watch("contract_function")
                  ? toFunctionSelector(functionForm.watch("contract_function"))
                  : ""
              }
              // value={functionForm.watch("contract_function")?.name}
              onValueChange={(e) => {
                try {
                  const matchingContractFunction = availableFunctions.find(
                    (contractFunction) =>
                      isEqual(toFunctionSelector(contractFunction), e)
                  );

                  if (matchingContractFunction) {
                    functionForm.setValue(
                      "contract_function",
                      matchingContractFunction
                    );
                  }
                } catch (error) {
                  console.log(error);
                }
              }}
              defaultValue=""
            >
              <FormControl>
                <SelectTrigger
                  disabled={availableFunctions.length === 0}
                  className="body-2 mt-2 h-10 w-full bg-z2 text-primary"
                >
                  <div className="w-full">
                    <FallMotion
                      height="2.5rem"
                      motionClassName="flex flex-col items-start"
                      contentClassName="body-2 text-left"
                    >
                      {availableFunctions.length === 0
                        ? "No Functions Available"
                        : functionForm.watch("contract_function")
                          ? functionForm.watch("contract_function").name
                          : "Select Function"}
                    </FallMotion>
                  </div>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <ScrollArea className={cn("h-[200px] w-full")}>
                  <ul className="list gap-0">
                    {availableFunctions.map((contractFunction, index) => {
                      const BASE_KEY = toFunctionSelector(contractFunction);
                      // const BASE_KEY = `${index}:${contractFunction.name}`;

                      return (
                        <SelectItem
                          key={BASE_KEY}
                          className={cn(
                            "body-2 z-10 transition-colors duration-200 ease-in-out"
                          )}
                          value={BASE_KEY}
                        >
                          {contractFunction.name}{" "}
                          {contractFunction.inputs.length > 0 &&
                            `(${contractFunction.inputs.map((input) => input.type).join(", ")})`}
                        </SelectItem>
                      );
                    })}
                  </ul>
                </ScrollArea>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
});
