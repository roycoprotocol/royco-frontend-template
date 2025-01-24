import React from "react";
import Link from "next/link";
import EnsoWidget, { SystemConfig } from "@ensofinance/shortcuts-widget";
import { cn } from "@/lib/utils";
import { DottedBracket } from "../../../../../../icons/dotted-bracket";
import { TertiaryLabel } from "../../../../../../composables/common-labels";

const ENSO_KEY = process.env.NEXT_PUBLIC_ENSO_API_KEY;

const DISABLED_ZAPS = [
  "0x42a094364bbdca0efac8af2cf7d6b9ec885ee554", // WABTC/WBTC uni-v2
];

// Paste styling according to the design system
// https://www.chakra-ui.com/docs/theming/customization/overview
const themeConfig: SystemConfig = {
  theme: {
    tokens: {
      radii: {
        sm: { value: "0.5rem" },
      },
    },
  },
};

const UniRedirectLink = React.forwardRef<
  HTMLAnchorElement,
  {
    children: React.ReactNode;
  }
>(({ children, ...props }, ref) => (
  <Link
    ref={ref}
    target="_blank"
    href="https://app.uniswap.org/positions/create/v2"
    {...props}
  >
    {children}
  </Link>
));

export const EnsoShortcutsWidget = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    token: string;
    symbol: string;
    chainId?: number;
  }
>(({ className, token, symbol, chainId, ...props }, ref) => {
  const [zapInEnabled, setZapInEnabled] = React.useState(false);

  const zapDisabled = DISABLED_ZAPS.includes(token);
  const Wrapper = zapDisabled ? UniRedirectLink : "div";

  return (
    <div ref={ref} className={cn("mb-1", className)} {...props}>
      <div className={"flex w-full items-center justify-end gap-2"}>
        <Wrapper>
          <TertiaryLabel
            className={"cursor-pointer gap-1 underline"}
            onClick={
              zapDisabled ? undefined : () => setZapInEnabled((val) => !val)
            }
          >
            <DottedBracket className="h-4 w-4" />
            Get {symbol}
          </TertiaryLabel>
        </Wrapper>
      </div>

      {zapInEnabled && (
        <div className={"mt-2"}>
          <EnsoWidget
            obligateSelection
            apiKey={ENSO_KEY}
            tokenOut={token}
            chainId={chainId}
            themeConfig={themeConfig}
          />
        </div>
      )}
    </div>
  );
});
