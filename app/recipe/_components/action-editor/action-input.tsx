"use client";

import React, { Fragment } from "react";
import { useAtom } from "jotai";
import {
  RecipeAction,
  RecipeActionInput,
  recipeActionsAtom,
  RecipeActionValueType,
} from "@/store/recipe";
import { InputAddress } from "./input-address";
import {
  ALargeSmallIcon,
  ArrowLeftRightIcon,
  CaseSensitiveIcon,
  CheckIcon,
  CodeIcon,
  GrabIcon,
  HashIcon,
  Layers2Icon,
  MapPinIcon,
  PilcrowIcon,
  PlusIcon,
  RouteIcon,
  ToggleRightIcon,
  Trash2Icon,
  TypeIcon,
  XIcon,
} from "lucide-react";
import { findBaseInputType } from "@/weiroll/utils";
import { ActionInputStatus } from "../constants";
import { cn } from "@/lib/utils";
import {
  getUpdatedStaticValue,
  getUpdatedValueType,
} from "./action-manipulators";
import { InputBytes } from "./input-bytes";
import { InputString } from "./input-string";
import { InputInt } from "./input-int";
import { InputBool } from "./input-bool";

export type AccessPathType =
  | "action_index"
  | "input_index"
  | "array_index"
  | "tuple_array_index"
  | "tuple_component_index"
  | "base";

export const ActionInput = React.forwardRef<
  HTMLInputElement,
  React.HTMLAttributes<HTMLDivElement> & {
    accessPath: {
      type: AccessPathType;
      value: number;
    }[];
  }
>(({ accessPath, ...props }, ref) => {
  const [recipeActions, setRecipeActions] = useAtom(recipeActionsAtom);

  let actionIndex = accessPath[0].value;
  let inputIndex = accessPath[1].value;

  let accessObj: any = recipeActions[actionIndex].inputs[inputIndex];

  let accessPathLength = accessPath.length;
  let lastAccessType: AccessPathType = "input_index";
  let lastAccessValue: number = -1;
  let lastAccessIndex: number = 1;

  let i = 2;
  while (i < accessPath.length) {
    if (accessPath[i].type === "array_index") {
      accessObj = accessObj.staticValue[accessPath[i].value];
    } else if (accessPath[i].type === "tuple_array_index") {
      accessObj =
        accessObj.staticValue[accessPath[i].value][accessPath[i + 1].value];

      i += 1;
    } else if (accessPath[i].type === "tuple_component_index") {
      accessObj = accessObj[accessPath[i].value];
    }

    lastAccessType = accessPath[i].type;
    lastAccessValue = accessPath[i].value;
    lastAccessIndex = i;

    i += 1;
  }

  const currAccessObj = accessObj as unknown as RecipeActionInput;

  const changeValueType = ({
    newValueType,
  }: {
    newValueType: RecipeActionValueType;
  }) => {
    let newActions = recipeActions.map((action, _actionIndex) => {
      if (_actionIndex !== actionIndex) return action;
      else {
        return {
          ...action,
          inputs: action.inputs.map((input, _inputIndex) => {
            if (_inputIndex !== inputIndex) return input;
            else {
              return getUpdatedValueType({
                idx: 2,
                newValue: newValueType,
                accessPath,
                currAccessObj: input,
              });
            }
          }),
        };
      }
    });

    setRecipeActions(newActions);
  };

  const changeStaticValue = ({ newValue }: { newValue: string }) => {
    let newActions = recipeActions.map((action, _actionIndex) => {
      if (_actionIndex !== actionIndex) return action;
      else {
        return {
          ...action,
          inputs: action.inputs.map((input, _inputIndex) => {
            if (_inputIndex !== inputIndex) return input;
            else {
              return getUpdatedStaticValue({
                idx: 2,
                newValue,
                accessPath,
                currAccessObj: input,
              });
            }
          }),
        };
      }
    });

    setRecipeActions(newActions);
  };

  if (accessPath[accessPathLength - 1].type === "base") {
    return (
      <div className="flex flex-col items-start gap-1 text-left">
        {/**
         * @note Input info
         */}
        <div className="flex h-6 flex-row items-center gap-1">
          {/**
           * @note Input access path
           */}
          <div className="flex h-6 w-fit shrink-0 flex-row items-center gap-1 bg-_surface_tertiary px-2 text-left text-_primary_">
            <RouteIcon className="h-3 w-3" />
            <div>
              {accessPath
                .filter(
                  (path) => path.type !== "action_index" && path.type !== "base"
                )
                .map(
                  (path) => "[" + path.type.slice(0, 1) + "," + path.value + "]"
                )
                .join(":")}
            </div>
          </div>

          {/**
           * @note Input base type
           */}
          <div className="flex h-6 w-fit shrink-0 flex-row items-center gap-1 bg-_surface_tertiary px-2 text-left text-_primary_">
            {currAccessObj.baseType === "address" ? (
              <MapPinIcon className="h-3 w-3" />
            ) : currAccessObj.baseType === "int" ? (
              <HashIcon className="h-3 w-3" />
            ) : currAccessObj.baseType === "bool" ? (
              <ToggleRightIcon className="h-3 w-3" />
            ) : currAccessObj.baseType === "string" ? (
              <TypeIcon className="h-3 w-3" />
            ) : currAccessObj.baseType === "bytes" ? (
              <CodeIcon className="h-3 w-3" />
            ) : currAccessObj.baseType === "tuple" ? (
              <Layers2Icon className="h-3 w-3" />
            ) : (
              <Fragment />
            )}

            <div>{currAccessObj.baseType}</div>
          </div>

          {/**
           * @note Input name
           */}
          <div className="flex h-6 w-fit shrink-0 flex-row items-center gap-1 bg-_surface_tertiary px-2 text-left text-_primary_">
            <PilcrowIcon className="h-3 w-3" />
            <div>{currAccessObj.name}</div>
          </div>
        </div>

        <div className="flex flex-row items-center gap-1">
          <div
            className={cn(
              "flex h-6 w-6 shrink-0 flex-col items-center justify-center",
              currAccessObj.status === ActionInputStatus.VALID
                ? "bg-success text-white"
                : "bg-error text-white"
            )}
          >
            {currAccessObj.status === ActionInputStatus.VALID ? (
              <CheckIcon className="text-_success_ h-4 w-4" />
            ) : (
              <XIcon className="text-_error_ h-4 w-4" />
            )}
          </div>

          <div
            onClick={() => {
              changeValueType({
                newValueType:
                  currAccessObj.valueType === RecipeActionValueType.STATIC
                    ? RecipeActionValueType.DYNAMIC
                    : RecipeActionValueType.STATIC,
              });
            }}
            className="flex h-6 w-24 shrink-0 cursor-pointer flex-row items-center justify-between bg-_surface_tertiary px-2 text-_primary_ transition-all duration-200 ease-in-out hover:bg-_surface_tertiary/80"
          >
            <div className="flex w-fit flex-col items-center justify-center">
              {currAccessObj.valueType === RecipeActionValueType.STATIC
                ? "Static"
                : "Dynamic"}
            </div>

            <ArrowLeftRightIcon strokeWidth={1} className="h-4 w-4" />
          </div>

          {currAccessObj.valueType === RecipeActionValueType.DYNAMIC && (
            <div className="flex h-6 w-96 shrink-0 flex-row items-center gap-1 bg-_surface_tertiary px-2 text-left text-_tertiary_">
              <GrabIcon className="h-3 w-3" />
              <div>drag & drop</div>
            </div>
          )}

          {currAccessObj.valueType === RecipeActionValueType.STATIC &&
            (currAccessObj.baseType === "address" ? (
              <InputAddress
                value={currAccessObj.staticValue as string}
                onChange={(value) =>
                  changeStaticValue({
                    newValue: value as string,
                  })
                }
              />
            ) : currAccessObj.baseType === "bytes" ? (
              <InputBytes
                value={currAccessObj.staticValue as string}
                onChange={(value) =>
                  changeStaticValue({
                    newValue: value as string,
                  })
                }
              />
            ) : currAccessObj.baseType === "string" ? (
              <InputString
                value={currAccessObj.staticValue as string}
                onChange={(value) =>
                  changeStaticValue({
                    newValue: value as string,
                  })
                }
              />
            ) : currAccessObj.baseType === "int" ? (
              <InputInt
                value={currAccessObj.staticValue as string}
                onChange={(value) =>
                  changeStaticValue({
                    newValue: value as string,
                  })
                }
              />
            ) : currAccessObj.baseType === "bool" ? (
              <InputBool
                value={currAccessObj.staticValue as string}
                onChange={(value) =>
                  changeStaticValue({
                    newValue: value as string,
                  })
                }
              />
            ) : (
              <Fragment />
            ))}
        </div>
      </div>
    );
  }

  if (currAccessObj.isArray) {
    if (currAccessObj.isEmpty) {
      return <Fragment />;
    } else {
      if (currAccessObj.baseType === "tuple") {
        return (
          currAccessObj.staticValue as unknown as RecipeActionInput[][]
        ).map((tupleArrayItem, tupleArrayIndex) => {
          const newParentAccessPath: {
            type: AccessPathType;
            value: number;
          }[] = [
            ...accessPath,
            {
              type: "tuple_array_index",
              value: tupleArrayIndex,
            },
          ];

          const uniqueTupleArrayKey = newParentAccessPath
            .map((path) => path.type + ":" + path.value)
            .join("->");

          return (
            <div
              key={uniqueTupleArrayKey}
              {...props}
              className="flex flex-col gap-1 border-b border-_divider_ pb-1"
            >
              (
              {tupleArrayItem.map((tupleComponentItem, tupleComponentIndex) => {
                const newAccessPath: {
                  type: AccessPathType;
                  value: number;
                }[] = [
                  ...accessPath,
                  {
                    type: "tuple_array_index",
                    value: tupleArrayIndex,
                  },
                  {
                    type: "tuple_component_index",
                    value: tupleComponentIndex,
                  },
                ];

                const uniqueTupleComponentKey = newAccessPath
                  .map((path) => path.type + ":" + path.value)
                  .join("->");

                return (
                  <div key={uniqueTupleComponentKey} className="contents">
                    <ActionInput accessPath={newAccessPath} />
                  </div>
                );
              })}
              )
            </div>
          );
        });
      } else {
        return (
          <div
            ref={ref}
            {...props}
            className="flex flex-col gap-1 border-b border-_divider_ pb-1"
          >
            {(currAccessObj.staticValue as unknown as RecipeActionInput[]).map(
              (arrayItem, arrayIndex) => {
                const newArrayAccessPath: {
                  type: AccessPathType;
                  value: number;
                }[] = [
                  ...accessPath,
                  {
                    type: "array_index",
                    value: arrayIndex,
                  },
                ];

                const uniqueArrayInputKey =
                  newArrayAccessPath
                    .map((path) => path.type + ":" + path.value)
                    .join("->") + "->base";

                return (
                  <div key={uniqueArrayInputKey} className="contents">
                    {/* <div className="flex h-6 w-6 shrink-0 flex-col items-center justify-center bg-_tertiary_ text-white">
                      <Trash2Icon className="h-4 w-4" />
                    </div> */}

                    <ActionInput accessPath={newArrayAccessPath} />
                  </div>
                );
              }
            )}

            {/* <div className="flex h-6 w-6 shrink-0 flex-col items-center justify-center bg-_tertiary_ text-white">
              <PlusIcon className="h-4 w-4" />
            </div> */}
          </div>
        );
      }
    }
  } else {
    if (currAccessObj.baseType === "tuple") {
      return (currAccessObj.staticValue as unknown as RecipeActionInput[]).map(
        (tupleComponentItem, tupleComponentIndex) => {
          const newAccessPath: {
            type: AccessPathType;
            value: number;
          }[] = [
            ...accessPath,
            {
              type: "tuple_component_index",
              value: tupleComponentIndex,
            },
          ];

          const uniqueKey = newAccessPath
            .map((path) => path.type + ":" + path.value)
            .join("->");

          return (
            <div key={uniqueKey} className="contents">
              <ActionInput accessPath={newAccessPath} />
            </div>
          );
        }
      );
    } else {
      const newAccessPath: {
        type: AccessPathType;
        value: number;
      }[] = [
        ...accessPath,
        {
          type: "base",
          value: -1,
        },
      ];

      const uniqueKey = newAccessPath
        .map((path) => path.type + ":" + path.value)
        .join("->");

      return (
        <div key={uniqueKey} className="contents">
          <ActionInput accessPath={newAccessPath} />
        </div>
      );
    }
  }
});
