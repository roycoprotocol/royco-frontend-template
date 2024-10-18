import { cn } from "@/lib/utils";

export const BASE_PADDING_LEFT = cn("pl-5");
export const BASE_PADDING_RIGHT = cn("pr-5");

export const BASE_PADDING_TOP = cn("pt-5");
export const BASE_PADDING_BOTTOM = cn("pb-5");

export const BASE_MARGIN_TOP = {
  XS: cn("mt-1"),
  SM: cn("mt-2"),
  MD: cn("mt-3"),
  LG: cn("mt-4"),
  XL: cn("mt-5"),
};

export const INFO_ROW_CLASSES = cn("text-sm items-start");

export const BASE_PADDING = cn(
  BASE_PADDING_LEFT,
  BASE_PADDING_RIGHT,
  BASE_PADDING_TOP,
  BASE_PADDING_BOTTOM
);

export const BASE_ANIMATION = cn("transition-all duration-200 ease-in-out");

export const BASE_UNDERLINE = {
  SM: cn(
    "underline decoration-tertiary decoration-dotted underline-offset-[3px] cursor-pointer hover:opacity-80"
  ),
  MD: cn(
    "underline decoration-tertiary decoration-dotted underline-offset-[6px] cursor-pointer hover:opacity-80"
  ),
};

export const BASE_LABEL_BORDER = cn(
  "border-spacing-6 border-b border-divider text-black"
);
