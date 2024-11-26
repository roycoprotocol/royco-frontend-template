"use client";

import { cn } from "@/lib/utils";

import {
  FormField,
  FormItem,
  FormLabel,
  useFormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Droppable } from "@hello-pangea/dnd";
import { useMarketBuilder, useMarketBuilderManager } from "@/store";

import { RotatingCheckmark } from "./rotating-checkmark";
import { FormInputLabel } from "@/components/composables";

const dataType = "address";
const droppableId = "contract-address-droppable";

export const FormContractAddress = ({ control }: { control: any }) => {
  const { dragData } = useMarketBuilder();

  const { isContractAddressUpdated } = useMarketBuilderManager();

  return (
    <FormField
      control={control}
      name="contract_address"
      render={({ field }) => {
        const { error } = useFormField();

        return (
          <FormItem>
            <FormLabel className="mb-2 flex flex-row items-center justify-between">
              <div className="flex h-5">
                <span className="leading-5">Contract Address</span>
              </div>

              <div className="h-5 w-5">
                <RotatingCheckmark display={isContractAddressUpdated} />
              </div>
            </FormLabel>

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
                    className="relative"
                  >
                    <Input
                      data-type={dataType}
                      placeholder="0xa59f...7f17"
                      containerClassName={cn(
                        "bg-z2 text-primary",
                        error && "border-error",
                        "outline-dashed outline-[2px] -outline-offset-4 outline-transparent transition-all duration-200 ease-in-out",
                        isValid === true && "outline-success",
                        snapshot.isDraggingOver &&
                          "animate-pulse duration-[1500] bg-focus",
                        snapshot.isDraggingOver &&
                          isValid === false &&
                          "outline-error"
                      )}
                      value={field.value?.trim() ?? ""}
                      onChange={(e) => field.onChange(e.target.value.trim())}
                    />

                    {/**
                     * @description Working white flash animation
                     */}
                    <div
                      className={cn(
                        "pointer-events-none absolute top-0 z-20 flex h-10 w-full grow flex-col place-content-center items-center overflow-hidden rounded-lg bg-white transition-all duration-200 ease-in-out",
                        isContractAddressUpdated === true
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
  );
};
