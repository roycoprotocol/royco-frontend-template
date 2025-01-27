import numbro from "numbro";

const DEFAULT_FORMAT: numbro.Format & { autoForceAverage?: boolean } = {
  average: true,
  mantissa: 3,
  trimMantissa: true,
  thousandSeparated: true,
  autoForceAverage: true,
};

const LEADING_ZEROES_SYMBOLS = [
  "₀",
  "₁",
  "₂",
  "₃",
  "₄",
  "₅",
  "₆",
  "₇",
  "₈",
  "₉",
];
function leadingZeroes(n: number): string {
  return n
    .toString()
    .split("")
    .map((c) => LEADING_ZEROES_SYMBOLS[parseInt(c)])
    .join("");
}

function formatNumber(
  v: string | number | null | undefined,
  options: {
    type?: "number" | "percent" | "currency";
  } = {
    type: "number",
  },
  overrides?: Partial<typeof DEFAULT_FORMAT>
): string | null | undefined {
  if (v === null || v === undefined) return v;
  if ((typeof v === "number" && isNaN(v)) || v === "NaN") {
    return "∞";
  }

  let str: string;
  if (typeof v === "number") {
    if (options.type === "percent") {
      v = v * 100;
    }
    str = v.toLocaleString("en-US", {
      minimumFractionDigits: 18,
      useGrouping: false,
    });
  } else {
    str = v;
  }

  const num = parseFloat(str);

  let format = { ...DEFAULT_FORMAT, ...overrides };
  const autoForceAverage = format.autoForceAverage;
  delete format["autoForceAverage"];

  if (num >= 1_000_000_000 && autoForceAverage) {
    format = { ...format, average: false, forceAverage: "billion" };
  } else if (num >= 1_000_000 && autoForceAverage) {
    format = {
      ...format,
      average: false,
      forceAverage: "million",
    };
  } else if (num < 0.01) {
    const [part0, part1] = str.split(".");
    if (part1 === undefined || parseFloat(part1) === 0) {
      return part0;
    }
    const leadingZerosCount = part1.match(/^0+/)?.[0]?.length || 0;

    const formattedPart1 = part1
      .slice(leadingZerosCount)
      .slice(0, format.mantissa ?? 5)
      .replace(/0+$/, "")
      .padEnd(format.mantissa ?? 5, "0");
    return `${part0}.0${leadingZeroes(leadingZerosCount)}${formattedPart1}`;
  }

  if (options.type === "percent") {
    return `${numbro(str).format(format).toUpperCase()}%`;
  }

  if (options.type === "currency") {
    return `$${numbro(str).format(format).toUpperCase()}`;
  }

  return numbro(str).format(format).toUpperCase();
}

export default formatNumber;
