"use client";

import React, { Fragment } from "react";
import { cn } from "@/lib/utils";

import { useMarketBuilderManager } from "@/store";
import { ActionsType, MarketBuilderSteps } from "@/store";
import { Draggable, Droppable } from "@hello-pangea/dnd";

import { AnimatePresence, motion } from "framer-motion";

import { PoolFormType, ZodAction } from "../../market-builder-form";
import { OutputBadge, OutputBadgeClone } from "./output-badge";
import { InputTypeSelector } from "./input-type-selector";
import { InputValueSelector } from "./input-value-selector";

import { NoInputsIndicator, NoOutputsIndicator } from "./empty-state-indicator";
import { UseFormWatch } from "react-hook-form";
import { z } from "zod";
import { CircleAlertIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isFixedValueValid } from "royco/market";

export const InputOutputLists = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    actionIndex: number;
    action: z.infer<typeof ZodAction>;
    marketBuilderForm: PoolFormType;
  }
>(({ actionIndex, marketBuilderForm, action, className, ...props }, ref) => {
  const { activeStep, forceClose, actionsType } = useMarketBuilderManager();

  return (
    <div ref={ref} className="contents">
      {activeStep === MarketBuilderSteps.params.id && forceClose === false && (
        <div
          // initial={{
          //   opacity: 0,
          //   height: 0,
          // }}
          // animate={{
          //   opacity: 1,
          //   height: "auto", // height fit content
          // }}
          // exit={{
          //   opacity: 0,
          //   height: 0,
          //   transition: {
          //     delay: 0,
          //     duration: 0.2,
          //     ease: "easeInOut",
          //     type: "spring",
          //     bounce: 0,
          //   },
          // }}
          // transition={{
          //   delay: 0.1 + 0.1 * actionIndex,
          //   duration: 0.4,
          //   ease: "easeInOut",
          //   type: "spring",
          //   bounce: 0,
          // }}
          className="mt-3 grid w-full grid-cols-12 flex-row items-start gap-3 overflow-hidden" // height 3
        >
          <div
            className={cn(
              "body-2 col-span-8 flex h-fit w-full flex-col divide-y divide-divider rounded-xl border border-divider bg-white",
              "overflow-hidden" // this is needed for rounded-corners
            )}
          >
            {action.contract_function.inputs.length !== 0 && (
              <Fragment>
                <div className="caption divide- grid w-full grid-cols-12 divide-x border-b border-divider bg-z2 text-secondary">
                  <div className="col-span-3 px-3 py-1">Input Name</div>

                  <div className="col-span-6 px-3 py-1">Input Value</div>

                  <div className="col-span-3 px-3 py-1">Input Type</div>
                </div>

                <div
                  key={`input-container:${action.id}:${actionIndex}`}
                  className="-mt-[1px] h-fit w-full"
                >
                  {action.contract_function.inputs.map(
                    (input, inputIndex: number) => {
                      const inputType =
                        marketBuilderForm.watch(actionsType)[actionIndex]
                          .inputs[inputIndex].input_type;

                      const fixedValue =
                        marketBuilderForm.watch(actionsType)[actionIndex]
                          .inputs[inputIndex].fixed_value;
                      const dynamicValue =
                        marketBuilderForm.watch(actionsType)[actionIndex]
                          .inputs[inputIndex].dynamic_value;

                      let isValid = true;
                      let message = "Invalid Input";

                      if (inputType === "fixed") {
                        const res = isFixedValueValid({
                          type: input.type,
                          value: fixedValue,
                        });

                        isValid = res.status;
                        message = res.message;
                      } else if (inputType === "dynamic") {
                        if (dynamicValue === undefined) {
                          isValid = false;
                          message = "Dynamic value is not provided";
                        }
                      }

                      return (
                        <div
                          key={`input-value-type-container:${action.id}:${actionIndex}:${inputIndex}`}
                          className={cn(
                            "body-2 grid w-full grid-cols-12 divide-x divide-divider bg-white",
                            inputIndex !==
                              action.contract_function.inputs.length - 1 &&
                              "border-b border-divider"
                          )}
                        >
                          <div className="col-span-3 flex flex-row items-center justify-between gap-3 px-3 py-1">
                            <div className="grow overflow-hidden truncate text-ellipsis">
                              {input.name === "" ? "Unknown" : input.name}
                            </div>

                            {isValid === false && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <div className="flex h-4 w-4 shrink-0 flex-col place-content-center items-center">
                                    <CircleAlertIcon
                                      strokeWidth={1.5}
                                      className="h-4 w-4 text-error"
                                    />
                                  </div>
                                </TooltipTrigger>

                                <TooltipContent>{message}</TooltipContent>
                              </Tooltip>
                            )}
                          </div>

                          <div
                            id={`input-value:${action.id}:${actionIndex}:${inputIndex}`}
                            className="col-span-6"
                          >
                            <InputValueSelector
                              marketBuilderForm={marketBuilderForm}
                              action={
                                marketBuilderForm.watch(actionsType)[
                                  actionIndex
                                ]
                              }
                              actionIndex={actionIndex}
                              inputIndex={inputIndex}
                            />
                          </div>

                          <div className="col-span-3">
                            <InputTypeSelector
                              marketBuilderForm={marketBuilderForm}
                              actionIndex={actionIndex}
                              inputIndex={inputIndex}
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </Fragment>
            )}

            <NoInputsIndicator
              stateLength={action.contract_function.inputs.length}
            />
          </div>

          <Droppable
            type="input-output"
            isDropDisabled={true}
            droppableId={`output-list:${action.id}`}
            renderClone={(provided, snapshot, rubric) => (
              <OutputBadge
                draggableProvidedOutput={provided}
                draggableSnapshotOutput={snapshot}
                outputIndex={rubric.source.index}
                actionIndex={actionIndex}
                output={action.contract_function.outputs[rubric.source.index]}
              />
            )}
          >
            {(droppableProvidedOutput, droppableSnapshotOutput) => (
              <div
                ref={droppableProvidedOutput.innerRef}
                {...droppableProvidedOutput.droppableProps}
                className={cn(
                  "col-span-4 flex w-full list-none flex-row flex-wrap gap-2 rounded-xl border border-divider bg-z2 p-2",
                  "h-fit" // @test fix for undectable dropping
                )}
              >
                {action.contract_function.outputs.length === 1 &&
                  action.contract_function.outputs.map(
                    (output, outputIndex) => {
                      const draggableKey = `output:${action.id}:${actionIndex}:${outputIndex}:${
                        output.type
                      }`;
                      // const draggableKey = `output:${action.id}:${actionIndex}:${outputIndex}`;

                      const shouldRenderClone =
                        draggableKey ===
                        droppableSnapshotOutput.draggingFromThisWith;

                      // console.log("shouldRenderClone", shouldRenderClone);

                      return (
                        <Fragment key={draggableKey}>
                          {shouldRenderClone ? (
                            <div className="opacity-50">
                              <OutputBadgeClone
                                output={output}
                                outputIndex={outputIndex}
                                actionIndex={actionIndex}
                              />
                            </div>
                          ) : (
                            <div className="relative overflow-hidden">
                              <Draggable
                                key={draggableKey}
                                draggableId={draggableKey}
                                index={outputIndex}
                              >
                                {(
                                  draggableProvidedOutput,
                                  draggableSnapshotOutput
                                ) => (
                                  <OutputBadge
                                    className="opacity-0"
                                    draggableProvidedOutput={
                                      draggableProvidedOutput
                                    }
                                    draggableSnapshotOutput={
                                      draggableSnapshotOutput
                                    }
                                    outputIndex={outputIndex}
                                    actionIndex={actionIndex}
                                    output={output}
                                  />
                                )}
                              </Draggable>

                              <div
                                className={cn(
                                  "pointer-events-none absolute left-0 top-0 h-full w-full"
                                )}
                              >
                                <OutputBadgeClone
                                  output={output}
                                  outputIndex={outputIndex}
                                  actionIndex={actionIndex}
                                />
                              </div>
                            </div>
                            // <Draggable
                            //   key={draggableKey}
                            //   draggableId={draggableKey}
                            //   index={outputIndex}
                            // >
                            //   {(
                            //     draggableProvidedOutput,
                            //     draggableSnapshotOutput
                            //   ) => (
                            //     <OutputBadge
                            //       draggableProvidedOutput={draggableProvidedOutput}
                            //       draggableSnapshotOutput={draggableSnapshotOutput}
                            //       outputIndex={outputIndex}
                            //       actionIndex={actionIndex}
                            //       output={output}
                            //     />
                            //   )}
                            // </Draggable>
                          )}
                        </Fragment>
                      );

                      return (
                        // <div className="relative">
                        //   <div className="h-fit w-fit opacity-0">
                        //     <OutputBadgeClone
                        //       output={output}
                        //       outputIndex={outputIndex}
                        //       actionIndex={actionIndex}
                        //     />
                        //   </div>

                        //   <div className="absolute inset-0 h-full w-full overflow-hidden bg-red-500">
                        <Draggable
                          disableInteractiveElementBlocking={true}
                          key={draggableKey}
                          draggableId={draggableKey}
                          index={outputIndex}
                        >
                          {(
                            draggableProvidedOutput,
                            draggableSnapshotOutput
                          ) => {
                            return shouldRenderClone ? (
                              <div className="opacity-50">
                                <OutputBadgeClone
                                  output={output}
                                  outputIndex={outputIndex}
                                  actionIndex={actionIndex}
                                />
                              </div>
                            ) : (
                              <OutputBadge
                                draggableProvidedOutput={
                                  draggableProvidedOutput
                                }
                                draggableSnapshotOutput={
                                  draggableSnapshotOutput
                                }
                                outputIndex={outputIndex}
                                actionIndex={actionIndex}
                                output={output}
                              />
                            );
                            // <OutputBadge
                            //   draggableProvidedOutput={draggableProvidedOutput}
                            //   draggableSnapshotOutput={draggableSnapshotOutput}
                            //   outputIndex={outputIndex}
                            //   actionIndex={actionIndex}
                            //   output={output}
                            // />
                          }}
                        </Draggable>

                        // <div className="bg-blue-500 ">
                        //   {droppableProvidedOutput.placeholder}
                        // </div>

                        //   </div>
                        // </div>
                      );
                    }
                  )}

                <div className="hidden h-0">
                  {droppableProvidedOutput.placeholder}
                </div>

                <NoOutputsIndicator
                  stateLength={action.contract_function.outputs.length}
                />
              </div>
            )}
          </Droppable>
        </div>
      )}
    </div>
  );
});

{
  /* {shouldRenderClone ? (
                          <div className="opacity-50">
                            <OutputBadgeClone
                              output={output}
                              outputIndex={outputIndex}
                              actionIndex={actionIndex}
                            />
                          </div>
                        ) : (
                          <Draggable
                            disableInteractiveElementBlocking={true}
                            key={draggableKey}
                            draggableId={draggableKey}
                            index={outputIndex}
                          >
                            {(
                              draggableProvidedOutput,
                              draggableSnapshotOutput
                            ) => (
                              <OutputBadge
                                draggableProvidedOutput={
                                  draggableProvidedOutput
                                }
                                draggableSnapshotOutput={
                                  draggableSnapshotOutput
                                }
                                outputIndex={outputIndex}
                                actionIndex={actionIndex}
                                output={output}
                              />
                            )}
                          </Draggable>
                        )} */
}
