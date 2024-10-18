"use client";

import React, { useEffect } from "react";
import { PoolFormType } from "../../market-builder-form";
import { cn } from "@/lib/utils";
import { MotionWrapper } from "../animations";
import { useMarketBuilderManager } from "@/store";
import { MarketBuilderSteps } from "@/store";
import { ExternalLinkIcon, GripVerticalIcon, Trash2Icon } from "lucide-react";
import { getExplorerUrl } from "@/sdk/utils";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

import { AnimatePresence } from "framer-motion";
import { FallMotion } from "@/components/animations";

import { isEqual } from "lodash";
import { ActionsTypeSelector } from "./actions-type-selector";
import { NoActionsIndicator } from "./empty-state-indicator";
import { InputOutputLists } from "./input-output-lists";
import { FillQuantity } from "./fill-quantity";
import { BuilderSectionWrapper } from "../../composables";

export const ActionsStep = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketBuilderForm: PoolFormType;
  }
>(({ className, marketBuilderForm, ...props }, ref) => {
  const [isAnimationDelayed, setIsAnimationDelayed] = React.useState(true);

  const { activeStep, actionsType, setDraggingKey } = useMarketBuilderManager();

  const validateActionInputs = () => {
    const originalActions = marketBuilderForm.watch(actionsType);
    let newActions = marketBuilderForm.watch(actionsType);

    for (let i = 0; i < originalActions.length; i++) {
      for (let j = 0; j < originalActions[i].inputs.length; j++) {
        if (!!originalActions[i].inputs[j].dynamic_value) {
          const inputActionId =
            originalActions[i].inputs[j].dynamic_value?.action_id;
          const inputActionIndex =
            originalActions[i].inputs[j].dynamic_value?.action_index;
          const inputOutputIndex =
            originalActions[i].inputs[j].dynamic_value?.output_index;

          let outputActionIndex = -1;

          for (let k = 0; k < originalActions.length; k++) {
            if (originalActions[k].id === inputActionId) {
              outputActionIndex = k;
              break;
            }
          }

          if (outputActionIndex === -1 || outputActionIndex >= i) {
            newActions[i].inputs[j].dynamic_value = undefined;
          } else if (outputActionIndex !== inputActionIndex) {
            if (
              inputActionId !== undefined &&
              inputActionIndex !== undefined &&
              inputOutputIndex !== undefined
            ) {
              newActions[i].inputs[j].dynamic_value = {
                action_id: inputActionId,
                action_index: outputActionIndex,
                output_index: inputOutputIndex,
              };
            }
          }
        }
      }
    }

    if (!isEqual(newActions, marketBuilderForm.watch(actionsType))) {
      marketBuilderForm.setValue(actionsType, newActions);
      marketBuilderForm.setValue(actionsType, newActions);
    }
  };

  useEffect(() => {
    if (
      activeStep === MarketBuilderSteps.actions.id ||
      activeStep === MarketBuilderSteps.params.id
    ) {
      setTimeout(() => {
        setIsAnimationDelayed(false);
      }, 1000);
    } else {
      setIsAnimationDelayed(true);
    }
  }, [activeStep]);

  return (
    <div ref={ref} className={cn("contents", className)} {...props}>
      <BuilderSectionWrapper
        key={`actions-type-selector:${activeStep}`}
        className="flex flex-col items-center"
      >
        <ActionsTypeSelector className="max-w-72" />
      </BuilderSectionWrapper>

      <DragDropContext
        onDragEnd={(e) => {
          // console.log("onDragEnd", e);

          // action reordering
          if (e.source.droppableId === "action-list") {
            if (!!e.destination) {
              let newActions = [...marketBuilderForm.watch(actionsType)];
              const [reorderedItem] = newActions.splice(e.source.index, 1);
              newActions.splice(e.destination.index, 0, reorderedItem);
              marketBuilderForm.setValue(actionsType, newActions);

              marketBuilderForm.trigger("enter_actions");
              marketBuilderForm.trigger("exit_actions");
            }
          }

          // output drag and drop
          if (e.source.droppableId.includes("output-list")) {
            if (!!e.destination) {
              const [
                inputName,
                inputActionId,
                inputActionIndex,
                inputIndex,
                inputType,
              ] = e.destination.droppableId.split(":");
              const [
                outputName,
                outputActionId,
                outputActionIndex,
                outputIndex,
                outputType,
              ] = e.draggableId.split(":");

              if (
                outputType === inputType &&
                parseInt(outputActionIndex) < parseInt(inputActionIndex)
              ) {
                if (inputType === "tuple") {
                  const inputAction =
                    marketBuilderForm.watch(actionsType)[
                      parseInt(inputActionIndex)
                    ];
                  const outputAction =
                    marketBuilderForm.watch(actionsType)[
                      parseInt(outputActionIndex)
                    ];

                  if (outputAction && inputAction) {
                    const outputActionFullType =
                      outputAction.contract_function.outputs[
                        parseInt(outputIndex)
                      ];
                    const inputActionFullType =
                      inputAction.contract_function.inputs[
                        parseInt(inputIndex)
                      ];

                    // we want to ensure that all the types are the same
                    if (
                      // @ts-ignore
                      outputActionFullType.components.length ===
                      // @ts-ignore
                      inputActionFullType.components.length
                    ) {
                      let tempIsValid = true;

                      for (
                        let i = 0;
                        // @ts-ignore
                        i < outputActionFullType.components.length;
                        i++
                      ) {
                        if (
                          // @ts-ignore
                          outputActionFullType.components[i].type !==
                            // @ts-ignore
                            inputActionFullType.components[i].type ||
                          // @ts-ignore
                          outputActionFullType.components[i].internalType !==
                            // @ts-ignore
                            inputActionFullType.components[i].internalType
                        ) {
                          tempIsValid = false;
                          break;
                        }
                      }

                      if (tempIsValid === true) {
                        let newActions = [
                          ...marketBuilderForm.watch(actionsType),
                        ];

                        newActions[parseInt(inputActionIndex)].inputs[
                          parseInt(inputIndex)
                        ].input_type = "dynamic";

                        newActions[parseInt(inputActionIndex)].inputs[
                          parseInt(inputIndex)
                        ].dynamic_value = {
                          action_id: outputActionId,
                          action_index: parseInt(outputActionIndex),
                          output_index: parseInt(outputIndex),
                        };

                        marketBuilderForm.setValue(actionsType, newActions);
                      }
                    }
                  }
                } else {
                  let newActions = [...marketBuilderForm.watch(actionsType)];

                  newActions[parseInt(inputActionIndex)].inputs[
                    parseInt(inputIndex)
                  ].input_type = "dynamic";

                  newActions[parseInt(inputActionIndex)].inputs[
                    parseInt(inputIndex)
                  ].dynamic_value = {
                    action_id: outputActionId,
                    action_index: parseInt(outputActionIndex),
                    output_index: parseInt(outputIndex),
                  };

                  marketBuilderForm.setValue(actionsType, newActions);
                }
              }
            }
          }

          validateActionInputs();
          setDraggingKey(null);
        }}
        onDragStart={(e) => {
          setDraggingKey(e.draggableId);
        }}
      >
        <div
          className={cn(
            "mt-5 flex w-full grow flex-col",
            "overflow-hidden"
            // (activeStep === MarketBuilderSteps.actions.id ||
            //   activeStep === MarketBuilderSteps.params.id) &&
            //   "rounded-2xl"
          )}
        >
          <BuilderSectionWrapper
            key={`actions-list:${activeStep}`}
            className={cn(
              "flex w-full grow flex-col items-center rounded-2xl border border-divider bg-z2 pt-0",
              "px-3",
              "overflow-hidden"
            )}
          >
            {/**
             * Fill Quantity Output
             *
             * @todo Make it live
             * @notice Currently hidden
             */}
            {/* {activeStep === MarketBuilderSteps.params.id && (
              <FillQuantity marketBuilderForm={marketBuilderForm} />
            )} */}

            {/* <div className="w-full shrink-0 border-t border-divider bg-divider drop-shadow-sm"></div> */}

            <Droppable type="action" droppableId="action-list">
              {(droppableProvided, droppableSnapshot) => (
                <ul
                  ref={droppableProvided.innerRef}
                  {...droppableProvided.droppableProps}
                  className={cn(
                    "flex w-full max-w-5xl flex-grow flex-col overflow-x-hidden pb-3",
                    // "min-h-[18px]"
                    "overflow-y-scroll"
                  )}
                >
                  {marketBuilderForm
                    .watch(actionsType)
                    .map((action, actionIndex) => {
                      // if (actionIndex === 0) return null;

                      return (
                        <Draggable
                          key={action.id}
                          draggableId={action.id}
                          index={actionIndex}
                        >
                          {(draggableProvided, draggableSnapshot) => (
                            <li
                              ref={draggableProvided.innerRef}
                              {...draggableProvided.draggableProps}
                            >
                              <MotionWrapper
                                // {...(droppableSnapshot.draggingFromThisWith ===
                                //   null && {
                                //   layout: "preserve-aspect",
                                //   layoutId: `${action.id}`,
                                // })}
                                delay={
                                  isAnimationDelayed
                                    ? 0.2 + 0.1 * actionIndex
                                    : 0
                                }
                                duration={0.2}
                                // duration={forceClose === true ? 0.4 : 0.2}
                              >
                                <div
                                  className={cn(
                                    "body-2 mt-3 flex h-auto w-full flex-col items-center rounded-2xl border border-divider bg-white px-3 py-3 transition-all duration-200 ease-in-out",
                                    draggableSnapshot.isDragging &&
                                      "drop-shadow-md"
                                  )}
                                >
                                  <div className="flex w-full shrink-0 flex-row items-center justify-between space-x-2">
                                    <div className="flex w-fit flex-row items-center">
                                      {/**
                                       * @description Drag Handle
                                       */}
                                      <div
                                        className="h-6 w-6"
                                        {...draggableProvided.dragHandleProps}
                                      >
                                        <GripVerticalIcon className="h-6 w-6 cursor-grab fill-tertiary stroke-tertiary" />
                                      </div>

                                      {/**
                                       * @description Action Index
                                       */}
                                      <div className="body-2 ml-2 flex h-8 w-8 flex-col items-center rounded-full border border-divider bg-z2 font-gt text-secondary">
                                        <FallMotion
                                          customKey={`action-index:${
                                            droppableSnapshot.draggingFromThisWith ===
                                            null
                                              ? actionIndex + 1
                                              : `undefined:${actionIndex + 1}`
                                          }`}
                                          height="2rem"
                                          containerClassName="w-8"
                                          contentClassName="flex flex-col items-center justify-center h-8"
                                        >
                                          <span className="leading-8">
                                            {droppableSnapshot.draggingFromThisWith ===
                                            null
                                              ? actionIndex + 1
                                              : ""}
                                          </span>
                                        </FallMotion>
                                      </div>

                                      {/**
                                       * @description Action Function Name and Contract Address
                                       */}
                                      <div className="ml-4 flex w-3/12 shrink-0 flex-col items-start">
                                        <div className="body-2 text-primary">
                                          {action.contract_function.name === ""
                                            ? "Unknown"
                                            : action.contract_function.name}
                                        </div>
                                        <div className="text-xs leading-5 text-tertiary">
                                          {action.contract_address.slice(0, 6)}
                                          ...
                                          {action.contract_address.slice(-4)}
                                        </div>
                                      </div>
                                    </div>

                                    {/**
                                     * @description Action Link and Delete Button
                                     */}
                                    <div className="flex w-fit flex-row items-center space-x-3">
                                      <ExternalLinkIcon
                                        onClick={() => {
                                          const explorerUrl = getExplorerUrl({
                                            chainId:
                                              marketBuilderForm.watch("chain")
                                                .id,
                                            value: action.contract_address,
                                            type: "address",
                                          });

                                          window.open(
                                            explorerUrl,
                                            "_blank",
                                            "noopener,noreferrer"
                                          );
                                        }}
                                        className="h-6 w-6 cursor-pointer text-tertiary transition-all duration-200 ease-in-out hover:text-secondary"
                                      />
                                      <Trash2Icon
                                        onClick={() => {
                                          const newActions = marketBuilderForm
                                            .watch(actionsType)
                                            .filter((item, idx) => {
                                              if (
                                                item.contract_address ===
                                                  action.contract_address &&
                                                idx === actionIndex
                                              ) {
                                                return false;
                                              } else {
                                                return true;
                                              }
                                            });

                                          marketBuilderForm.setValue(
                                            actionsType,
                                            newActions
                                          );
                                        }}
                                        className="h-6 w-6 cursor-pointer text-tertiary transition-all duration-200 ease-in-out hover:text-secondary"
                                      />
                                    </div>
                                  </div>

                                  <InputOutputLists
                                    marketBuilderForm={marketBuilderForm}
                                    action={action}
                                    actionIndex={actionIndex}
                                  />
                                </div>
                              </MotionWrapper>
                            </li>
                          )}
                        </Draggable>
                      );
                    })}

                  {droppableProvided.placeholder}

                  <NoActionsIndicator
                    stateLength={marketBuilderForm.watch(actionsType).length}
                  />
                </ul>
              )}
            </Droppable>
          </BuilderSectionWrapper>
        </div>
      </DragDropContext>
    </div>
  );
});
