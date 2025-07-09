import { RecipeActionInput, RecipeActionValueType } from "@/store/recipe/types";
import { AccessPathType } from "./action-input";

export const getUpdatedValueType = ({
  idx,
  newValue,
  accessPath,
  currAccessObj,
}: {
  idx: number;
  newValue: RecipeActionValueType;
  accessPath: {
    type: AccessPathType;
    value: number;
  }[];
  currAccessObj: any;
}): any => {
  if (idx === accessPath.length - 1) {
    return {
      ...currAccessObj,
      valueType: newValue,
    };
  } else {
    if (accessPath[idx].type === "array_index") {
      return {
        ...currAccessObj,
        staticValue: (
          currAccessObj.staticValue as unknown as RecipeActionInput[]
        ).map((arrayItem: RecipeActionInput, arrayIndex: number) => {
          if (arrayIndex !== accessPath[idx].value) return arrayItem;
          else {
            return getUpdatedValueType({
              idx: idx + 1,
              newValue,
              accessPath,
              currAccessObj: arrayItem,
            });
          }
        }),
      };
    } else if (accessPath[idx].type === "tuple_array_index") {
      return {
        ...currAccessObj,
        staticValue: (
          currAccessObj.staticValue as unknown as RecipeActionInput[][]
        ).map(
          (tupleArrayItem: RecipeActionInput[], tupleArrayIndex: number) => {
            if (tupleArrayIndex !== accessPath[idx].value)
              return tupleArrayItem;
            else {
              return (tupleArrayItem as unknown as RecipeActionInput[]).map(
                (
                  tupleComponentItem: RecipeActionInput,
                  tupleComponentIndex: number
                ) => {
                  if (tupleComponentIndex !== accessPath[idx + 1].value)
                    return tupleComponentItem;
                  else {
                    return getUpdatedValueType({
                      idx: idx + 2,
                      newValue,
                      accessPath,
                      currAccessObj: tupleComponentItem,
                    });
                  }
                }
              );
            }
          }
        ),
      };
    } else if (accessPath[idx].type === "tuple_component_index") {
      return {
        ...currAccessObj,
        staticValue: (
          currAccessObj.staticValue as unknown as RecipeActionInput[]
        ).map(
          (
            tupleComponentItem: RecipeActionInput,
            tupleComponentIndex: number
          ) => {
            if (tupleComponentIndex !== accessPath[idx].value)
              return tupleComponentItem;
            else {
              return getUpdatedValueType({
                idx: idx + 1,
                newValue,
                accessPath,
                currAccessObj: tupleComponentItem,
              });
            }
          }
        ),
      };
    }
  }
};

export const getUpdatedStaticValue = ({
  idx,
  newValue,
  accessPath,
  currAccessObj,
}: {
  idx: number;
  newValue: string;
  accessPath: {
    type: AccessPathType;
    value: number;
  }[];
  currAccessObj: any;
}): any => {
  if (idx === accessPath.length - 1) {
    return {
      ...currAccessObj,
      staticValue: newValue,
    };
  } else {
    if (accessPath[idx].type === "array_index") {
      return {
        ...currAccessObj,
        staticValue: (
          currAccessObj.staticValue as unknown as RecipeActionInput[]
        ).map((arrayItem: RecipeActionInput, arrayIndex: number) => {
          if (arrayIndex !== accessPath[idx].value) return arrayItem;
          else {
            return getUpdatedStaticValue({
              idx: idx + 1,
              newValue,
              accessPath,
              currAccessObj: arrayItem,
            });
          }
        }),
      };
    } else if (accessPath[idx].type === "tuple_array_index") {
      return {
        ...currAccessObj,
        staticValue: (
          currAccessObj.staticValue as unknown as RecipeActionInput[][]
        ).map(
          (tupleArrayItem: RecipeActionInput[], tupleArrayIndex: number) => {
            if (tupleArrayIndex !== accessPath[idx].value)
              return tupleArrayItem;
            else {
              return (tupleArrayItem as unknown as RecipeActionInput[]).map(
                (
                  tupleComponentItem: RecipeActionInput,
                  tupleComponentIndex: number
                ) => {
                  if (tupleComponentIndex !== accessPath[idx + 1].value)
                    return tupleComponentItem;
                  else {
                    return getUpdatedStaticValue({
                      idx: idx + 2,
                      newValue,
                      accessPath,
                      currAccessObj: tupleComponentItem,
                    });
                  }
                }
              );
            }
          }
        ),
      };
    } else if (accessPath[idx].type === "tuple_component_index") {
      return {
        ...currAccessObj,
        staticValue: (
          currAccessObj.staticValue as unknown as RecipeActionInput[]
        ).map(
          (
            tupleComponentItem: RecipeActionInput,
            tupleComponentIndex: number
          ) => {
            if (tupleComponentIndex !== accessPath[idx].value)
              return tupleComponentItem;
            else {
              return getUpdatedStaticValue({
                idx: idx + 1,
                newValue,
                accessPath,
                currAccessObj: tupleComponentItem,
              });
            }
          }
        ),
      };
    }
  }
};
