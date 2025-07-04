export const SafeBigInt = (
  value: string | number | bigint | null | undefined
): bigint => {
  try {
    if (value === null || value === undefined) return BigInt(0);

    if (typeof value === "bigint") return value;

    if (typeof value === "string" && value === "") return BigInt(0);

    // For strings, check if they contain scientific notation
    if (
      typeof value === "string" &&
      (value.includes("e") || value.includes("E"))
    ) {
      // Use a direct approach for strings with scientific notation
      const [base, exponent] = value.split(/[eE]/);
      const exp = parseInt(exponent);

      // Split the base into integer and decimal parts
      const [intPart, decPart = ""] = base.split(".");

      // Create a string with all digits (no decimal point)
      let fullNumber = intPart + decPart;

      // Adjust the exponent based on decimal places
      const adjustedExp = exp - decPart.length;

      // Add zeros if needed
      if (adjustedExp > 0) {
        fullNumber += "0".repeat(adjustedExp);
      } else if (adjustedExp < 0) {
        // For negative exponents, we need to move the decimal point
        const absExp = Math.abs(adjustedExp);
        if (absExp >= fullNumber.length) {
          // If exponent is larger than the number, result is 0
          return BigInt(0);
        }
        // Move decimal point left by absExp places
        fullNumber = fullNumber.slice(0, -absExp);
      }

      // Now strip any remaining decimals
      const [finalIntPart] = fullNumber.split(".");
      return BigInt(finalIntPart);
    }

    // For numbers, convert to string first to handle scientific notation
    if (typeof value === "number") {
      // Convert to string with full precision and strip decimals
      const strValue = value.toLocaleString("fullwide", { useGrouping: false });
      // Split on decimal point and take only the integer part
      const [intPart] = strValue.split(".");
      return BigInt(intPart);
    }

    // For regular strings, check if it contains a decimal point
    if (typeof value === "string" && value.includes(".")) {
      const [intPart] = value.split(".");
      return BigInt(intPart);
    }

    // For regular strings without decimals, convert directly
    return BigInt(value);
  } catch (error) {
    return BigInt(0);
  }
};
