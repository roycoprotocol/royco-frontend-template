"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { useAtom } from "jotai";
import { recipeActionsAtom, recipeChainIdAtom } from "@/store/recipe";
import { isAlphanumeric } from "validator";

export const InputAddress = React.forwardRef<
  HTMLInputElement,
  React.HTMLAttributes<HTMLDivElement> & {
    recipeIndex: number;
    actionIndex: number;
    isArray: boolean;
  }
>(({ recipeIndex, actionIndex, isArray, ...props }, ref) => {
  const [recipeActions, setRecipeActions] = useAtom(recipeActionsAtom);

  return <div>InputAddress</div>;

  // return (
  //   <Input
  //     {...props}
  //     ref={ref}
  //     newHeight="h-6"
  //     placeholder={isArray ? "address[]" : "address"}
  //     containerClassName="w-full rounded-none bg-_surface_ border-_divider_ text-xs bg-_surface_tertiary px-0 border-none"
  //     className="px-2"
  //     value={recipeActions[recipeIndex].inputs[actionIndex].staticValue}
  //     onChange={(e) => {
  //       if (isAlphanumeric(e.target.value)) {
  //         setRecipeActions(
  //           recipeActions.map((action, index) =>
  //             index === recipeIndex
  //               ? {
  //                   ...action,
  //                   inputs: action.inputs.map((input, inputIndex) =>
  //                     inputIndex === actionIndex
  //                       ? { ...input, fixedValue: e.target.value }
  //                       : input
  //                   ),
  //                 }
  //               : action
  //           )
  //         );
  //       } else if (e.target.value === "") {
  //         setRecipeActions(
  //           recipeActions.map((action, index) =>
  //             index === recipeIndex
  //               ? {
  //                   ...action,
  //                   inputs: action.inputs.map((input, inputIndex) =>
  //                     inputIndex === actionIndex
  //                       ? { ...input, fixedValue: "" }
  //                       : input
  //                   ),
  //                 }
  //               : action
  //           )
  //         );
  //       }
  //     }}
  //   />
  // );
});
