"use client";

import React, { Fragment } from "react";
import { useAtom } from "jotai";
import { recipeActionsAtom, RecipeActionValueType } from "@/store/recipe";
import { InputAddress } from "./input-address";
import { GrabIcon } from "lucide-react";
import { findBaseInputType } from "@/weiroll/utils";

export const ActionInput = React.forwardRef<
  HTMLInputElement,
  React.HTMLAttributes<HTMLDivElement> & {
    recipeIndex: number;
    actionIndex: number;
  }
>(({ recipeIndex, actionIndex, ...props }, ref) => {
  const [recipeActions] = useAtom(recipeActionsAtom);

  if (
    recipeActions[recipeIndex].inputs[actionIndex].valueType ===
    RecipeActionValueType.DYNAMIC
  ) {
    if (recipeActions[recipeIndex].inputs[actionIndex].dynamicValue === -1) {
      return (
        <div className="flex h-6 w-full flex-1 grow flex-row items-center gap-1 bg-_surface_tertiary px-2 text-_tertiary_">
          <GrabIcon className="h-4 w-4" strokeWidth={1.5} />
          <span className="text-xs">drag & drop</span>
        </div>
      );
    }

    return (
      <div className="flex h-6 w-full flex-1 grow flex-row items-center gap-2 bg-_surface_tertiary px-2 text-_tertiary_">
        Action {recipeActions[recipeIndex].inputs[actionIndex].dynamicValue + 1}{" "}
        Output
      </div>
    );
  }

  const [baseType, isArray] = findBaseInputType(
    recipeActions[recipeIndex].inputs[actionIndex].type
  );

  if (baseType === "address") {
    return (
      <InputAddress
        recipeIndex={recipeIndex}
        actionIndex={actionIndex}
        isArray={isArray}
      />
    );
  }

  // else if (baseType === "int") {
  //   return (
  //     <InputInt
  //       recipeIndex={recipeIndex}
  //       actionIndex={actionIndex}
  //       isArray={isArray}
  //     />
  //   );
  // }

  // else if (baseType === "bool") {
  //   return <InputBool recipeIndex={recipeIndex} actionIndex={actionIndex} isArray={isArray} />;
  // } else if (baseType === "string") {
  //   return <InputString recipeIndex={recipeIndex} actionIndex={actionIndex} isArray={isArray} />;
  // } else if (baseType === "bytes") {
  //   return <InputBytes recipeIndex={recipeIndex} actionIndex={actionIndex} isArray={isArray} />;
  // } else if (baseType === "tuple") {
  //   return <InputTuple recipeIndex={recipeIndex} actionIndex={actionIndex} isArray={isArray} />;
  // }

  return (
    <div ref={ref} {...props}>
      {recipeActions[recipeIndex].inputs[actionIndex].type}
    </div>
  );
});
