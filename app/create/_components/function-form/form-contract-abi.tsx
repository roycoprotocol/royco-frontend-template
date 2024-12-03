"use client";

import React from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";

import { FormField, FormItem, useFormField } from "@/components/ui/form";
import { LoadingSpinner } from "@/components/composables";
import { isAbiValid } from "royco/utils";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { useMarketBuilder, useMarketBuilderManager } from "@/store";
import { Droppable } from "@hello-pangea/dnd";

import { RotatingCheckmark } from "./rotating-checkmark";
import { UseFormReturn } from "react-hook-form";
import { FunctionFormSchema } from "./function-form-schema";

const dataType = "abi";
const droppableId = "contract-abi-droppable";

export const FormContractAbi = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    isLoadingContract: boolean;
    control: any;
    functionForm: UseFormReturn<z.infer<typeof FunctionFormSchema>>;
  }
>(({ className, functionForm, isLoadingContract, control, ...props }, ref) => {
  const { dragData } = useMarketBuilder();

  const { isContractAbiUpdated } = useMarketBuilderManager();

  return (
    <div ref={ref} className="contents">
      <FormField
        control={control}
        name="contract_abi"
        render={({ field }) => {
          const { error } = useFormField();

          return (
            <FormItem className="contents">
              <div className="mb-2 mt-5 flex h-5 flex-row items-center justify-between">
                <div className="flex h-5">
                  <span className="leading-5">Contract ABI</span>
                </div>

                {isLoadingContract ? (
                  <LoadingSpinner className="h-5 w-5" />
                ) : (
                  <div className="h-5 w-5">
                    <RotatingCheckmark display={isContractAbiUpdated} />
                  </div>
                )}
              </div>

              <Droppable droppableId={droppableId}>
                {(droppableProvided, snapshot) => {
                  let isValid = null;

                  if (!!dragData && dragData.dataTypes.includes(dataType)) {
                    isValid = true;
                  }

                  return (
                    <div
                      ref={droppableProvided.innerRef}
                      {...droppableProvided.droppableProps}
                      className={cn(
                        "relative flex h-fit w-full grow flex-col overflow-hidden rounded-md",
                        "outline-dashed outline-[2px] -outline-offset-4 outline-transparent transition-all duration-200 ease-in-out",
                        isValid === true && "outline-success",
                        snapshot.isDraggingOver &&
                          "duration-[1500] animate-pulse bg-focus",
                        snapshot.isDraggingOver &&
                          isValid === false &&
                          "outline-error"
                      )}
                    >
                      <AutosizeTextarea
                        data-type={dataType}
                        placeholder={JSON.stringify(
                          [
                            {
                              inputs: [],
                              name: "liquidity",
                              outputs: [
                                {
                                  internalType: "string",
                                  name: "",
                                  type: "string",
                                },
                              ],
                              stateMutability: "view",
                              type: "function",
                            },
                          ],
                          null,
                          4
                        )}
                        className={cn(
                          "grow bg-z2 text-primary"
                          // error && "border-error"
                        )}
                        // {...field}
                        value={
                          isAbiValid(field.value)
                            ? JSON.stringify(JSON.parse(field.value), null, 4)
                            : field.value
                        }
                        onChange={field.onChange}
                        // onChange={(e) => {
                        //   field.onChange(e.target.value);
                        // }}
                      />

                      {/**
                       * @description Working white flash animation
                       */}
                      <div
                        className={cn(
                          "pointer-events-none absolute top-0 z-20 flex h-full w-full grow flex-col place-content-center items-center overflow-hidden rounded-lg bg-white transition-all duration-200 ease-in-out",
                          isContractAbiUpdated === true
                            ? "bg-opacity-70"
                            : "bg-opacity-0"
                        )}
                      ></div>

                      <div className="h-0">{droppableProvided.placeholder}</div>
                    </div>
                  );
                }}
              </Droppable>
            </FormItem>
          );
        }}
      />
    </div>
  );
});
