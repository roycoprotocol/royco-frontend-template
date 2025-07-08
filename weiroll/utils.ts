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
  type: string,
  isArray: boolean = false
): ["address" | "int" | "bool" | "string" | "bytes" | "tuple", boolean] => {
  if (isSolidityAddressType(type)) return ["address", isArray];
  if (isSolidityIntType(type)) return ["int", isArray];
  if (isSolidityBoolType(type)) return ["bool", isArray];
  if (isSolidityStringType(type)) return ["string", isArray];
  if (isSolidityBytesType(type)) return ["bytes", isArray];
  if (isSolidityTupleType(type)) return ["tuple", isArray];

  if (isSolidityArrayWithoutTuple(type)) {
    const baseType = type.replace("[]", "");
    return findBaseInputType(baseType, true);
  }

  return ["tuple", true];
};
