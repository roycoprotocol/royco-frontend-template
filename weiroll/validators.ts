import {
  SolidityAddress as ZodSolidityAddress,
  SolidityInt as ZodSolidityInt,
  SolidityBytes as ZodSolidityBytes,
  SolidityBool as ZodSolidityBool,
  SolidityString as ZodSolidityString,
  SolidityTuple as ZodSolidityTuple,
  SolidityArrayWithoutTuple as ZodSolidityArrayWithoutTuple,
  SolidityArrayWithTuple as ZodSolidityArrayWithTuple,
} from "abitype/zod";

export const isSolidityIntType = (type: string): boolean => {
  const result = ZodSolidityInt.safeParse(type);
  return result.success;
};

export const isSolidityAddressType = (type: string): boolean => {
  const result = ZodSolidityAddress.safeParse(type);
  return result.success;
};

export const isSolidityBytesType = (type: string): boolean => {
  const result = ZodSolidityBytes.safeParse(type);
  return result.success;
};

export const isSolidityBoolType = (type: string): boolean => {
  const result = ZodSolidityBool.safeParse(type);
  return result.success;
};

export const isSolidityStringType = (type: string): boolean => {
  const result = ZodSolidityString.safeParse(type);
  return result.success;
};

export const isSolidityTupleType = (type: string): boolean => {
  const result = ZodSolidityTuple.safeParse(type);
  return result.success;
};

export const isSolidityArrayWithoutTuple = (type: string): boolean => {
  const result = ZodSolidityArrayWithoutTuple.safeParse(type);
  return result.success;
};

export const isSolidityArrayWithTuple = (type: string): boolean => {
  const result = ZodSolidityArrayWithTuple.safeParse(type);
  return result.success;
};
