"use client";

import { cn } from "@/lib/utils";
import { DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd";
import { AbiParameter } from "viem";
import { GripVerticalIcon, StarIcon } from "lucide-react";
import React from "react";

function getStyle(style: any, snapshot: any) {
  if (!snapshot.isDropAnimating) {
    return style;
  }
  return {
    ...style,
    // cannot be 0, but make it super tiny
    // transitionDuration: `0.001s`,
    opacity: 0,
  };
}

export const OutputBadgeClone = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    output: AbiParameter;
    outputIndex: number;
    actionIndex: number;
  }
>(({ className, output, outputIndex, actionIndex, ...props }, ref) => {
  return (
    <div className="body-2 flex h-7 shrink-0 flex-row items-center overflow-hidden rounded-md border border-divider bg-white px-[8px] pl-0 drop-shadow-sm">
      <div className="flex h-7 w-fit flex-col place-content-center items-center border-b border-r border-t border-divider px-2 text-secondary">
        {/* {actionIndex === 0 ? (
          <StarIcon className="h-4 w-4 fill-success text-success" />
        ) : (
          <span className="leading-7">
            {`${actionIndex}.${outputIndex + 1}`}
          </span>
        )} */}

        <span className="leading-7">{`${actionIndex + 1}.${outputIndex + 1}`}</span>
      </div>
      <div className="ml-2 mr-1 flex h-7 flex-col place-content-center items-center text-primary">
        <span className="leading-7">
          {output.type}
          {/* {!!output.name && output.name !== "" ? output.name : "Unknown"} */}
        </span>
      </div>
      <div className="h-4 w-4 cursor-grab">
        <GripVerticalIcon className="h-4 w-4 text-tertiary" />
      </div>
    </div>
  );
});

export const OutputBadge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    draggableProvidedOutput: DraggableProvided;
    draggableSnapshotOutput: DraggableStateSnapshot;
    outputIndex: number;
    actionIndex: number;
    output: AbiParameter;
  }
>(
  (
    {
      className,
      outputIndex,
      draggableProvidedOutput,
      draggableSnapshotOutput,
      actionIndex,
      output,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={draggableProvidedOutput.innerRef}
        {...draggableProvidedOutput.draggableProps}
        {...draggableProvidedOutput.dragHandleProps}
        className={cn("relative cursor-grab", className)}
        style={getStyle(
          draggableProvidedOutput.draggableProps.style,
          draggableSnapshotOutput
        )}
      >
        <div className="bg-red-500 opacity-0">
          <OutputBadgeClone
            output={output}
            outputIndex={outputIndex}
            actionIndex={actionIndex}
          />
        </div>

        <div className="absolute inset-0">
          <OutputBadgeClone
            output={output}
            outputIndex={outputIndex}
            actionIndex={actionIndex}
          />
        </div>
      </div>
    );
  }
);
