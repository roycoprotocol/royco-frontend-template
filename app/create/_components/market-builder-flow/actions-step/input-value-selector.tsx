"use client";

import React, { Fragment, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { BanIcon, GrabIcon, Star, StarIcon } from "lucide-react";

import {
  SolidityAddress,
  SolidityArray,
  SolidityBool,
  SolidityBytes,
  SolidityInt,
  SolidityString,
  SolidityTuple,
} from "abitype";
import { SolidityInt as ZodSolidityInt } from "abitype/zod";

import { ethers } from "ethers";

import { isAddress } from "viem";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { createPortal } from "react-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMarketBuilderManager } from "@/store";

type SolidityType =
  | SolidityAddress
  | SolidityBool
  | SolidityBytes
  | SolidityInt
  | SolidityString
  | SolidityTuple;

const isSolidityIntType = (type: any) => {
  try {
    ZodSolidityInt.parse(type);
    return true;
  } catch (error) {
    return false;
  }
};

const isSolidityInt = (type: any, value: any) => {
  try {
    if (!isSolidityIntType(type)) return false;

    const coder = ethers.utils.defaultAbiCoder._getCoder(
      ethers.utils.ParamType.from(type)
    );

    // console.log("coder", coder.maxValue());
  } catch (error) {
    return false;
  }
};

export const InputValueSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    actionIndex: number;
    inputIndex: number;
    action: any;
  } & {
    marketBuilderForm: PoolFormType;
  }
>(
  (
    { className, action, actionIndex, inputIndex, marketBuilderForm, ...props },
    ref
  ) => {
    const { actionsType, draggingKey } = useMarketBuilderManager();

    const [focusedType, setFocusedType] = React.useState<string | null>(
      marketBuilderForm.watch(actionsType)[actionIndex].inputs[inputIndex]
        .input_type
    );

    const [displayIndicator, setDisplayIndicator] = React.useState(false);

    const input_type =
      marketBuilderForm.watch(actionsType)[actionIndex].inputs[inputIndex]
        .input_type;
    const input_value_type = marketBuilderForm.watch(actionsType)[actionIndex]
      .contract_function.inputs[inputIndex].type as any;

    // console.log("input_value_type", input_value_type);

    const coder = ethers.utils.defaultAbiCoder._getCoder(
      ethers.utils.ParamType.from("uint256")
    );

    // console.log("coder", coder);

    // console.log("is solidity int", isSolidityInt(input_value_type));

    // ethers.utils.ParamType.from(
    //   "string"
    // )

    // console.log(
    //   "typed",
    //   ethers.utils.defaultAbiCoder._getCoder(
    //     ethers.utils.ParamType.from("string")
    //   )
    // );

    // console.log("is solidity int", isSolidityInt("uint256", "1"));

    let isValid = false;

    const draggingData = draggingKey?.split(":") || [];

    if (draggingData.length === 5) {
      const [type, outputActionId, outputActionIndex, outputIndex, outputType] =
        draggingData;

      if (
        parseInt(outputActionIndex) < actionIndex &&
        outputType === input_value_type
      ) {
        // console.log("outputType", outputType);
        // console.log("input_value_type", input_value_type);

        if (input_value_type === "tuple") {
          const outputAction = marketBuilderForm
            .watch(actionsType)
            .find((action) => {
              return action.id === outputActionId;
            });
          const inputAction = marketBuilderForm.watch(actionsType)[actionIndex];

          if (outputAction && inputAction) {
            const outputActionFullType =
              outputAction.contract_function.outputs[parseInt(outputIndex)];
            const inputActionFullType =
              inputAction.contract_function.inputs[inputIndex];

            // we want to ensure that all the types are the same
            if (
              outputActionFullType.components.length ===
              inputActionFullType.components.length
            ) {
              let tempIsValid = true;

              for (let i = 0; i < outputActionFullType.components.length; i++) {
                if (
                  outputActionFullType.components[i].type !==
                    inputActionFullType.components[i].type ||
                  outputActionFullType.components[i].internalType !==
                    inputActionFullType.components[i].internalType
                ) {
                  tempIsValid = false;
                  break;
                }
              }

              isValid = tempIsValid;
            }
          }
        } else {
          isValid = true;
        }
      }
    }

    // if (action.id === "f81b808d-b8e0-426e-b6bf-8cca63cd01b3") {
    //   console.log("action inputs:", action.inputs[0]);
    // }

    useEffect(() => {
      if (draggingKey === null) {
        setDisplayIndicator(false);
      }
    }, [draggingKey]);

    return (
      <FormField
        control={marketBuilderForm.control}
        name={actionsType}
        render={({ field }) => (
          <FormItem
          // onMouseOver={() => {
          //   if (draggingKey === null) return;
          //   setDisplayIndicator(true);
          // }}
          // onMouseOut={() => {
          //   setDisplayIndicator(false);
          // }}
          >
            <FormControl>
              {/* <FallMotion
                customKey={`input-value:${action.id}:${inputIndex}`}
                height="2rem"
                contentClassName=""
              > */}
              <Droppable
                // isDropDisabled={!isValid}
                droppableId={`input:${action.id}:${actionIndex}:${inputIndex}:${input_value_type}`}
                type="input-output"
              >
                {(droppableProvidedInput, droppableSnapshotInput) => {
                  return (
                    <div
                      ref={droppableProvidedInput.innerRef}
                      className={cn(
                        "relative flex h-8 w-full flex-row place-content-start items-center",
                        // "text-placeholder",
                        droppableSnapshotInput.isDraggingOver && "animate-pulse"
                      )}
                    >
                      {/* {!!document.getElementById(
                          `input-value:${action.id}:${actionIndex}:${inputIndex}`
                        ) &&
                          (isValid === true || displayIndicator === true) &&
                          createPortal(
                            <div
                              className={cn(
                                "pointer-events-none relative -mt-8 h-full w-full p-1"
                              )}
                            >
                              <div
                                className={cn(
                                  "pointer-events-none h-full w-full rounded-sm outline-dashed outline-2 outline-offset-0 transition-all duration-200 ease-in-out",
                                  isValid === true
                                    ? "outline-success"
                                    : "cursor-no-drop outline-error",
                                  droppableSnapshotInput.isDraggingOver &&
                                    isValid === false &&
                                    "bg-error",
                                  droppableSnapshotInput.isDraggingOver &&
                                    isValid === true &&
                                    "bg-success"
                                )}
                              ></div>
                            </div>,

                            // @ts-ignore
                            document.getElementById(
                              `input-value:${action.id}:${actionIndex}:${inputIndex}`
                            )
                          )} */}

                      {/* <div className="absolute top-0 h-8 w-full bg-red-500"></div> */}

                      {(isValid === true ||
                        droppableSnapshotInput.isDraggingOver) && (
                        <div
                          className={cn(
                            "pointer-events-none absolute top-0 h-8 w-full p-1"
                          )}
                        >
                          <div
                            className={cn(
                              "pointer-events-none h-full w-full rounded-sm outline-dashed outline-2 outline-offset-0 transition-all duration-200 ease-in-out",
                              isValid === true
                                ? "outline-success"
                                : "cursor-no-drop outline-error",
                              droppableSnapshotInput.isDraggingOver &&
                                isValid === false &&
                                "bg-error",
                              droppableSnapshotInput.isDraggingOver &&
                                isValid === true &&
                                "bg-success"
                            )}
                          ></div>
                        </div>
                      )}

                      {marketBuilderForm.watch(actionsType)[actionIndex].inputs[
                        inputIndex
                      ].input_type === "fixed" ? (
                        <Input
                          containerClassName="border-0 p-0 px-3 h-8 grow rounded-none"
                          className="border-0"
                          placeholder={
                            marketBuilderForm.watch(actionsType)[actionIndex]
                              .contract_function.inputs[inputIndex].type
                          }
                          value={
                            marketBuilderForm.watch(actionsType)[actionIndex]
                              .inputs[inputIndex].fixed_value
                          }
                          onChange={(e) => {
                            let newActions =
                              marketBuilderForm.watch(actionsType);
                            newActions[actionIndex].inputs[
                              inputIndex
                            ].fixed_value = e.target.value;

                            marketBuilderForm.setValue(actionsType, newActions);
                            // marketBuilderForm.setValue(
                            //   `${actionsType}.${actionIndex}.inputs.${inputIndex}.fixed_value`,
                            //   e.target.value
                            // );
                          }}
                        />
                      ) : !!marketBuilderForm.watch(actionsType)[actionIndex]
                          .inputs[inputIndex].dynamic_value ? (
                        <Fragment>
                          <div className="ml-1 flex h-full w-fit min-w-10 flex-col place-content-center items-center px-2 text-primary">
                            {
                              // @ts-ignore
                              // marketBuilderForm.watch(actionsType)[actionIndex].inputs[
                              //   inputIndex
                              // ].dynamic_value.action_index === 0 ? (
                              //   <StarIcon className="h-4 w-4 fill-success text-success" />
                              // ) : (
                              //   <span className="leading-7">
                              //     {
                              //       // @ts-ignore
                              //       `${marketBuilderForm.watch(actionsType)[actionIndex].inputs[inputIndex].dynamic_value.action_index + 1}.${marketBuilderForm.watch(actionsType)[actionIndex].inputs[inputIndex].dynamic_value.output_index + 1}`
                              //     }
                              //   </span>
                              // )
                              <span className="leading-7">
                                {
                                  // @ts-ignore
                                  `${marketBuilderForm.watch(actionsType)[actionIndex].inputs[inputIndex].dynamic_value.action_index + 1}.${marketBuilderForm.watch(actionsType)[actionIndex].inputs[inputIndex].dynamic_value.output_index + 1}`
                                }
                              </span>
                            }
                          </div>
                          <div className="h-5 border-r border-divider"></div>
                          <div className="ml-2 mr-1 flex h-7 flex-col place-content-center items-center text-primary">
                            <span className="leading-7">
                              {
                                marketBuilderForm.watch(actionsType)[
                                  actionIndex
                                ].contract_function.inputs[inputIndex].type
                              }
                            </span>
                          </div>
                        </Fragment>
                      ) : (
                        <Fragment>
                          <GrabIcon
                            strokeWidth={1}
                            className="-mt-1 ml-3 h-6 w-6 text-tertiary"
                          />
                          <div className="ml-2 text-placeholder">
                            {
                              marketBuilderForm.watch(actionsType)[actionIndex]
                                .contract_function.inputs[inputIndex].type
                            }
                          </div>
                        </Fragment>
                      )}

                      <div className="hidden h-0">
                        {droppableProvidedInput.placeholder}
                      </div>
                    </div>
                  );
                }}
              </Droppable>
              {/* </FallMotion> */}
            </FormControl>
          </FormItem>
        )}
      />
    );
  }
);
