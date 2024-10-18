"use client";

import React, { Fragment } from "react";
import { PoolFormType } from "../../market-builder-form";
import { cn } from "@/lib/utils";
import { useMarketBuilderManager } from "@/store";
import { Draggable, Droppable } from "@hello-pangea/dnd";

import { OutputBadge, OutputBadgeClone } from "./output-badge";
import { DollarSignIcon } from "lucide-react";

export const FillQuantity = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketBuilderForm: PoolFormType;
  }
>(({ marketBuilderForm, className, ...props }, ref) => {
  const { actionsType } = useMarketBuilderManager();

  return (
    <div ref={ref} className="bg-z2 py-3">
      <Droppable
        type="input-output"
        isDropDisabled={true}
        droppableId={`output-list:base-quantity`}
        renderClone={(provided, snapshot, rubric) => (
          <OutputBadge
            draggableProvidedOutput={provided}
            draggableSnapshotOutput={snapshot}
            outputIndex={0}
            actionIndex={0}
            output={
              marketBuilderForm.watch(actionsType)[0].contract_function
                .outputs[0]
            }
          />
        )}
      >
        {(droppableProvidedOutput, droppableSnapshotOutput) => (
          <ul
            ref={droppableProvidedOutput.innerRef}
            {...droppableProvidedOutput.droppableProps}
            className={cn(
              "col-span-4 flex w-fit list-none flex-row flex-wrap place-content-center items-center rounded-xl bg-white px-2 py-2 drop-shadow-sm",
              "h-fit" // @test fix for undectable dropping
            )}
          >
            <div className="-mt-[0.15rem] mr-2 flex h-6 w-6 flex-col place-content-center items-center rounded-md border border-divider bg-z2 text-tertiary">
              <DollarSignIcon strokeWidth={2} className="h-4 w-4" />
            </div>

            <div className="h-6 border-r border-divider pr-3 text-primary">
              <span className="leading-6">
                Fill Quantity
                <span className="ml-1 text-sm text-secondary">(in wei)</span>
              </span>
            </div>

            <div className="ml-3">
              {marketBuilderForm
                .watch(actionsType)[0]
                .contract_function.outputs.map((output, outputIndex) => {
                  const actionIndex = 0;
                  const actionId =
                    marketBuilderForm.watch(actionsType)[actionIndex].id;

                  const draggableKey = `output:${actionId}:${actionIndex}:${outputIndex}:${
                    output.type
                  }`;
                  // const draggableKey = `output:${action.id}:${actionIndex}:${outputIndex}`;
                  const shouldRenderClone =
                    draggableKey ===
                    droppableSnapshotOutput.draggingFromThisWith;

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
                              draggableProvidedOutput={draggableProvidedOutput}
                              draggableSnapshotOutput={draggableSnapshotOutput}
                              outputIndex={outputIndex}
                              actionIndex={actionIndex}
                              output={output}
                            />
                          )}
                        </Draggable>
                      )}
                    </Fragment>
                  );
                })}
            </div>

            <div className="hidden h-0">
              {droppableProvidedOutput.placeholder}
            </div>
          </ul>
        )}
      </Droppable>
    </div>
  );
});
