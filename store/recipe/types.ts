import { CommandFlags } from "@/weiroll/planner";

export type RecipeFunctionStateMutability =
  | "pure"
  | "view"
  | "nonpayable"
  | "payable";

export type RecipeFunctionType =
  | "constructor"
  | "error"
  | "event"
  | "fallback"
  | "function"
  | "receive";

export type RecipeFunctionInput = {
  name: string;
  type: string;
  internalType: string;
  components?: RecipeFunctionInput[];
};

export type RecipeFunctionOutput = {
  name: string;
  type: string;
  internalType: string;
  components?: RecipeFunctionOutput[];
};

export type RecipeFunction = {
  id: string; // function signature
  chainId: number; // chain id
  address: string; // contract address
  name: string; // function name
  inputs: RecipeFunctionInput[];
  outputs: RecipeFunctionOutput[];
  stateMutability: RecipeFunctionStateMutability; // function state mutability, valid values: pure, view, nonpayable, payable
  type: RecipeFunctionType; // function type, valid values: function, constructor, event, error
};

export class RecipeActionStatus {
  static INVALID = "invalid" as const;
  static VALID = "valid" as const;
}

export class RecipeActionCallType {
  static CALL = CommandFlags.CALL as const;
  static STATICCALL = CommandFlags.STATICCALL as const;
  static DELEGATECALL = CommandFlags.DELEGATECALL as const;
}

export class RecipeActionValueType {
  static STATIC = 0 as const;
  static DYNAMIC = 1 as const;
}

export type RecipeActionInput = {
  name: string; // input name
  baseType: string; // base type (e.g. address, int, bool, string, bytes, etc.)
  type: string; // input type (e.g. address, int, bool, string, bytes, etc.)
  internalType: string; // internal type (e.g. address, uint256, bool, string, bytes, etc.)
  valueType: RecipeActionValueType; // value type
  components?: RecipeActionInput[]; // if type is tuple, this will be the components
  staticValue: string | RecipeActionInput[] | RecipeActionInput[][]; // if valueType is static, this will be the value
  dynamicValue: number; // if valueType is dynamic, this will be the index of some action
  status: RecipeActionStatus; // status codes like VALID, INVALID_INT, etc. -- tbd, on what all the status codes will be, so we can just use a string for now
  isArray: boolean;
  isEmpty: boolean;
};

export type RecipeAction = {
  id: string; // uuidv4

  chainId: number; // chain id
  address: string; // contract address
  name: string; // function name

  inputs: RecipeActionInput[];
  outputs: {
    name: string; // output name
    type: string; // output type (e.g. address, int, bool, string, bytes, etc.)
    internalType: string; // internal type (e.g. address, uint256, bool, string, bytes, etc.)
  }[];

  stateMutability: RecipeFunctionStateMutability; // function state mutability, valid values: pure, view, nonpayable, payable
  type: RecipeFunctionType; // function type, valid values: function, constructor, event, error

  callType: RecipeActionCallType;
  callValue: string; // call value for payable function
};
