"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  RecipeAction,
  RecipeActionCallType,
  recipeActionsAtom,
  RecipeActionValueType,
} from "@/store/recipe";
import { useAtom } from "jotai";
import {
  ArrowLeftRightIcon,
  CheckIcon,
  CircleIcon,
  ExternalLinkIcon,
  GripHorizontalIcon,
  GripIcon,
  GripVerticalIcon,
  Trash2Icon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { toFunctionSelector, toFunctionSignature } from "viem";
import { getExplorerUrl, shortAddress } from "royco/utils";
import { ActionInput } from "./action-input";
import { ActionInputStatus, ActionInputStatusMessage } from "../constants";
import { CopyButton } from "@/components/animate-ui/buttons/copy";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import {
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DragOverlay } from "@dnd-kit/core";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { isNumeric } from "validator";

export const RecipeActionRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    className?: string;
    action: RecipeAction;
    actionIndex: number;
    isDragging?: boolean;
    dragOverIndex?: number;
    dragInProgress?: boolean;
  }
>(
  (
    {
      className,
      action,
      actionIndex,
      isDragging = false,
      dragOverIndex,
      dragInProgress = false,
      ...props
    },
    ref
  ) => {
    const [recipeActions, setRecipeActions] = useAtom(recipeActionsAtom);

    console.log("recipeActions", recipeActions);

    const functionSignature = toFunctionSignature({
      ...action,
      type: "function" as const,
      stateMutability: action.stateMutability as
        | "pure"
        | "view"
        | "nonpayable"
        | "payable",
    });

    const hexSignature = toFunctionSelector(functionSignature);

    const deleteAction = () => {
      setRecipeActions(
        recipeActions.filter((_, index) => index !== actionIndex)
      );
    };

    const { setNodeRef, attributes, listeners, transition, transform } =
      useSortable({
        id: action.id,
        transition: {
          duration: 200,
          easing: "cubic-bezier(0.25, 1, 0.5, 1)",
        },
      });

    const style = {
      transform: CSS.Translate.toString(transform),
      transition,
    };

    const changeActionCallType = (
      actionIndex: number,
      callType: RecipeActionCallType
    ) => {
      setRecipeActions(
        recipeActions.map((action, index) =>
          index === actionIndex ? { ...action, callType } : action
        )
      );
    };

    return (
      <div
        ref={setNodeRef}
        style={{
          ...style,
        }}
        {...props}
        className={cn(
          "flex w-full flex-col border border-_divider_ bg-white px-2 py-2 transition-opacity duration-200 ease-out",
          isDragging && "z-10",
          dragInProgress && (isDragging ? "" : "bg-white/70")
        )}
      >
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            <GripIcon
              strokeWidth={1.5}
              {...listeners}
              {...attributes}
              className={cn(
                "h-5 w-5 cursor-grab text-_tertiary_ focus:border-0 focus:outline-none focus:ring-0",
                isDragging && "cursor-grabbing"
              )}
              style={{
                outline: "none",
                border: "none",
                boxShadow: "none",
              }}
            />

            {/**
             * @note Action Index
             */}
            <div className="flex h-7 w-7 flex-col items-center justify-center bg-_brand_custom_cherry_ text-base text-white">
              {(dragOverIndex !== undefined ? dragOverIndex : actionIndex) + 1}
            </div>

            <div className="flex flex-col">
              <div className="font-normal text-_primary_">
                {functionSignature}
              </div>

              <div className="mt-[0.1rem] flex flex-row flex-wrap items-center gap-1 text-_secondary_">
                <div className="font-normal">{action.stateMutability}</div>
                <CircleIcon className="h-1 w-1 fill-_divider_ stroke-_divider_" />

                <div className="italic">{hexSignature}</div>
                <CopyButton
                  onClick={(e) => {
                    navigator.clipboard.writeText(hexSignature);
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="-ml-1 -mr-1"
                  variant="ghost"
                  size="xs"
                  content={hexSignature}
                />

                <CircleIcon className="h-1 w-1 fill-_divider_ stroke-_divider_" />

                <div>{shortAddress(action.address)}</div>
                <CopyButton
                  onClick={(e) => {
                    navigator.clipboard.writeText(action.address);
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="-ml-1 -mr-1"
                  variant="ghost"
                  size="xs"
                  content={action.address}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center gap-2">
            <ExternalLinkIcon
              // onClick={() => {
              //   const explorerUrl = getExplorerUrl({
              //     chainId:
              //   })
              // }}
              className="h-4 w-4 cursor-pointer text-_tertiary_"
            />
            <Trash2Icon
              onClick={deleteAction}
              className="h-4 w-4 cursor-pointer text-_tertiary_"
            />
          </div>
        </div>

        {/**
         * @note Call Type Selector
         */}
        <div className="mt-3 flex h-6 w-fit flex-row items-center gap-1">
          <div className="flex h-6 w-16 flex-col items-center justify-center bg-_secondary_ text-center text-white">
            CALL
          </div>

          {[
            {
              id: RecipeActionCallType.CALL,
              name: "Regular",
            },
            {
              id: RecipeActionCallType.STATICCALL,
              name: "Static",
            },
            {
              id: RecipeActionCallType.DELEGATECALL,
              name: "Delegate",
            },
          ].map((callType) => (
            <div
              key={`${action.id}-callType-${callType.id}`}
              onClick={() => changeActionCallType(actionIndex, callType.id)}
              className={cn(
                "flex h-6 w-20 cursor-pointer flex-col items-center justify-center bg-_surface_tertiary hover:opacity-80",
                action.callType === callType.id &&
                  "bg-_brand_custom_blue_ text-white"
              )}
            >
              {callType.name}
            </div>
          ))}

          {action.callType === RecipeActionCallType.CALL &&
            action.stateMutability === "payable" && (
              <Input
                containerClassName="bg-_surface_tertiary rounded-none h-6 text-xs w-96 px-2 border-none"
                className=""
                placeholder="Call Value"
                value={action.callValue ?? ""}
                onChange={(e) => {
                  if (isNumeric(e.target.value)) {
                    setRecipeActions(
                      recipeActions.map((action, index) =>
                        index === actionIndex
                          ? {
                              ...action,
                              callValue: e.target.value,
                            }
                          : action
                      )
                    );
                  } else if (e.target.value === "") {
                    setRecipeActions(
                      recipeActions.map((action, index) =>
                        index === actionIndex
                          ? {
                              ...action,
                              callValue: "",
                            }
                          : action
                      )
                    );
                  }
                }}
              />
            )}
        </div>

        <div className="mt-3 flex w-full flex-col items-center justify-between gap-1">
          {action.inputs.length > 0 && (
            <div className="flex w-full flex-row  items-start gap-1">
              <div className="flex h-6 w-16 flex-col items-center justify-center bg-_brand_bronze_ text-center text-white">
                INPUTS
              </div>

              <div className="flex h-fit w-fit flex-1 grow flex-col gap-1">
                {action.inputs.map((input, inputIndex) => (
                  <div
                    key={inputIndex}
                    className="flex flex-row items-center gap-1"
                  >
                    {/* <div className="flex h-6 w-fit shrink-0 flex-col items-center justify-center bg-_surface_tertiary px-2 font-mono text-_primary_">
                      .{inputIndex + 1}
                    </div> */}

                    {/* <div className="h-6 w-20 shrink-0 place-content-center overflow-hidden truncate text-ellipsis bg-_surface_tertiary px-2 text-center text-_primary_">
                      {input.type}
                    </div> */}

                    {/* <div
                      onClick={() => {
                        setRecipeActions(
                          recipeActions.map((action, index) =>
                            index === actionIndex
                              ? {
                                  ...action,
                                  inputs: action.inputs.map(
                                    (input, subIndex) =>
                                      subIndex === inputIndex
                                        ? {
                                            ...input,
                                            valueType:
                                              input.valueType ===
                                              RecipeActionValueType.STATIC
                                                ? RecipeActionValueType.DYNAMIC
                                                : RecipeActionValueType.STATIC,
                                          }
                                        : input
                                  ),
                                }
                              : action
                          )
                        );
                      }}
                      className="flex h-6 w-24 shrink-0 cursor-pointer flex-row items-center justify-between bg-_secondary_ px-2 text-white transition-all duration-200 ease-in-out hover:bg-_secondary_/80"
                    >
                      <div className="flex w-fit flex-col items-center justify-center">
                        {input.valueType === RecipeActionValueType.STATIC
                          ? "Static"
                          : "Dynamic"}
                      </div>

                      <ArrowLeftRightIcon
                        strokeWidth={1.5}
                        className="h-4 w-4"
                      />
                    </div>

                    <div
                      className={cn(
                        "flex h-6 w-6 shrink-0 flex-col items-center justify-center",
                        input.status === ActionInputStatus.VALID
                          ? "bg-success text-white"
                          : "bg-error text-white"
                      )}
                    >
                      {input.status === ActionInputStatus.VALID ? (
                        <CheckIcon className="text-_success_ h-4 w-4" />
                      ) : (
                        <XIcon className="text-_error_ h-4 w-4" />
                      )}
                    </div>

                    <div className="h-6 w-fit shrink-0 place-content-center overflow-hidden truncate text-ellipsis bg-_surface_secondary px-2 text-center font-normal text-_primary_">
                      {input.name ?? "Unknown"}
                    </div> */}

                    <ActionInput
                      accessPath={[
                        {
                          type: "action",
                          value: actionIndex,
                        },
                        {
                          type: "input",
                          value: inputIndex,
                        },
                      ]}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {action.outputs.length > 0 && (
            <div className="grid w-full grid-cols-12 items-start gap-1">
              <div className="col-span-1 flex h-6 flex-col items-center justify-center bg-_brand_gold_ text-center text-white">
                OUTPUT
              </div>

              <div className="col-span-11 flex h-6 w-fit flex-row items-center gap-1 bg-_surface_tertiary px-2">
                <GripIcon
                  strokeWidth={1}
                  className="h-4 w-4 cursor-pointer text-_tertiary_"
                />

                {action.outputs.length === 1 ? (
                  <div>{action.outputs[0].type}</div>
                ) : (
                  <div>bytes</div>
                )}

                {action.outputs.length > 1 && <div className="">( )</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export const ActionEditor = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    className?: string;
  }
>(({ className, ...props }, ref) => {
  const [recipeActions, setRecipeActions] = useAtom(recipeActionsAtom);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [overId, setOverId] = React.useState<string | null>(null);
  const [dragInProgress, setDragInProgress] = React.useState(false);

  const { setNodeRef } = useDroppable({
    id: "recipe-actions-order",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragEndEvent) => {
    setActiveId(event.active.id as string);
    setDragInProgress(true);
  };

  const handleDragOver = (event: DragEndEvent) => {
    setOverId(event.over?.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setRecipeActions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
    setOverId(null);
    setDragInProgress(false);
  };

  // Calculate the new index for each item during dragging
  const getDragOverIndex = (itemId: string, currentIndex: number) => {
    if (!activeId || !overId) {
      return currentIndex;
    }

    const activeIndex = recipeActions.findIndex((item) => item.id === activeId);
    const overIndex = recipeActions.findIndex((item) => item.id === overId);

    if (activeIndex === -1 || overIndex === -1) {
      return currentIndex;
    }

    // If the dragged item is moving down
    if (activeIndex < overIndex) {
      if (itemId === activeId) {
        return overIndex;
      } else if (currentIndex > activeIndex && currentIndex <= overIndex) {
        return currentIndex - 1;
      }
    }
    // If the dragged item is moving up
    else if (activeIndex > overIndex) {
      if (itemId === activeId) {
        return overIndex;
      } else if (currentIndex >= overIndex && currentIndex < activeIndex) {
        return currentIndex + 1;
      }
    }

    return currentIndex;
  };

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "flex flex-col gap-1 bg-_surface_secondary py-2 text-xs",
        className
      )}
    >
      <div>Recipe Actions</div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <ScrollArea className="h-[70vh] px-2 drop-shadow-sm">
          <div ref={setNodeRef} className="flex flex-col gap-1">
            <SortableContext
              items={recipeActions}
              strategy={verticalListSortingStrategy}
            >
              {recipeActions.map((action, actionIndex) => {
                return (
                  <RecipeActionRow
                    key={action.id}
                    action={action}
                    actionIndex={actionIndex}
                    isDragging={activeId === action.id}
                    dragOverIndex={getDragOverIndex(action.id, actionIndex)}
                    dragInProgress={dragInProgress}
                  />
                );
              })}
            </SortableContext>
          </div>

          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </DndContext>
    </div>
  );
});

ActionEditor.displayName = "ActionEditor";
