import { ReactNode, useState } from "react";
import Link from "next/link";
import { ButtonIcon } from "@radix-ui/react-icons";
import EnsoWidget, { SystemConfig } from "@ensofinance/shortcuts-widget";

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
        sm: { value: "0.375rem" },
      },
    },
  },
};

const UniRedirectLink = ({ children }: { children: ReactNode }) => (
  <Link target={"_blank"} href={"https://app.uniswap.org/positions/create/v2"}>
    {children}
  </Link>
);

export default function ShortcutsWidget({
  token,
  symbol,
  chainId,
}: {
  token: string;
  symbol: string;
  chainId?: number;
}) {
  const [zapInEnabled, setZapInEnabled] = useState(false);

  const zapDisabled = DISABLED_ZAPS.includes(token);
  const Wrapper = zapDisabled ? UniRedirectLink : "div";

  return (
    <div className={"mb-1"}>
      <div className={"flex w-full items-center justify-end gap-2"}>
        <Wrapper>
          <div
            className={
              "flex cursor-pointer items-center gap-1 text-sm font-light text-secondary underline"
            }
            onClick={
              zapDisabled ? undefined : () => setZapInEnabled((val) => !val)
            }
          >
            <ButtonIcon />
            Get {symbol}
          </div>
        </Wrapper>
      </div>

      {zapInEnabled && (
        <div className={"mt-1"}>
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
}
