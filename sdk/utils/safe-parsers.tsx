import { BigNumber, ethers } from "ethers";

export const parseNumber = (value: number | undefined | null): number => {
  try {
    if (!value) throw new Error("Value is undefined");

    if (isNaN(value)) throw new Error("Value is NaN");

    return value;
  } catch (err) {
    return 0;
  }
};

export const parseRawAmount = (value: string | undefined | null): string => {
  try {
    if (!value) throw new Error("Value is undefined");

    const refinedValue = BigNumber.from(value).toString();

    return refinedValue;
  } catch (err) {
    return BigNumber.from("0").toString();
  }
};

export const parseRawAmountToTokenAmount = (
  value: string | undefined | null,
  decimals: number
): number => {
  try {
    if (!value) throw new Error("Value is undefined");

    const refinedValue = parseFloat(
      ethers.utils.formatUnits(BigNumber.from(value), decimals)
    );

    if (isNaN(refinedValue)) throw new Error("Value is NaN");

    return refinedValue;
  } catch (err) {
    return 0;
  }
};

export const parseTokenAmountToTokenAmountUsd = (
  value: number | undefined | null,
  price: number
): number => {
  try {
    if (!value) throw new Error("Value is undefined");

    const refinedValue = value * price;

    if (isNaN(refinedValue)) throw new Error("Value is NaN");

    return refinedValue;
  } catch (err) {
    return 0;
  }
};
