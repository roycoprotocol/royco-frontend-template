import {
  isSolidityAddressType,
  isSolidityArrayWithoutTuple,
  isSolidityBoolType,
  isSolidityBytesType,
  isSolidityIntType,
  isSolidityStringType,
  isSolidityTupleType,
} from "./validators";

export const findBaseInputType = (
  type: string
): ["address" | "int" | "bool" | "string" | "bytes" | "tuple", boolean] => {
  if (isSolidityAddressType(type)) return ["address", false];
  if (isSolidityIntType(type)) return ["int", false];
  if (isSolidityBoolType(type)) return ["bool", false];
  if (isSolidityStringType(type)) return ["string", false];
  if (isSolidityBytesType(type)) return ["bytes", false];
  if (isSolidityTupleType(type)) return ["tuple", false];

  if (isSolidityArrayWithoutTuple(type)) {
    const baseType = type.replace("[]", "");
    return findBaseInputType(baseType);
  }

  return ["tuple", true];
};
