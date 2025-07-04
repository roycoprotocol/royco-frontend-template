"use client";

import { cn } from "@/lib/utils";
import { useAtom } from "jotai";
import { recipeActionsAtom } from "@/store/recipe";
import React, { Fragment, useEffect } from "react";
import { isEqual } from "lodash";
import { isAddress } from "viem";
import { ActionInputStatus } from "./constants";

export const ActionsValidator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [recipeActions, setRecipeActions] = useAtom(recipeActionsAtom);

  const validateActions = () => {
    let newActions = recipeActions.map((action) => {
      return {
        ...action,
        inputs: action.inputs.map((input) => {
          let status = ActionInputStatus.INVALID;

          if (input.inputType === "fixed") {
            if (input.type === "address") {
              if (isAddress(input.fixedValue)) status = ActionInputStatus.VALID;
            }
          } else {
            // Input is dynamic
            if (input.dynamicValue !== -1) status = ActionInputStatus.VALID;
          }

          return {
            ...input,
            status,
          };
        }),
      };
    });

    if (!isEqual(recipeActions, newActions)) {
      setRecipeActions(newActions);
    }
  };

  useEffect(() => {
    validateActions();
  }, [recipeActions]);

  return <Fragment />;
});

ActionsValidator.displayName = "ActionsValidator";
