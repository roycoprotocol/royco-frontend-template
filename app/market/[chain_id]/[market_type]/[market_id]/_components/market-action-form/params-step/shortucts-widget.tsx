import React from "react";
import { ButtonIcon, CaretSortIcon } from "@radix-ui/react-icons";
import EnsoWidget, { SystemConfig } from "@ensofinance/shortcuts-widget";

const ENSO_KEY = process.env.NEXT_PUBLIC_ENSO_API_KEY;

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

export default function ShortcutsWidget({
  token,
  symbol,
  chainId,
}: {
  token: string;
  symbol: string;
  chainId?: number;
}) {
  const [zapInEnabled, setZapInEnabled] = React.useState(false);

  return (
    <div className={"mb-1"}>
      <div className={"flex w-full items-center justify-end gap-2"}>
        <div
          className={
            "flex cursor-pointer items-center gap-1 text-sm font-light text-secondary underline"
          }
          onClick={() => setZapInEnabled((val) => !val)}
        >
          <ButtonIcon />
          Get {symbol}
        </div>
      </div>
      {zapInEnabled && (
        <div className={"mt-1"}>
          <EnsoWidget
            obligateSelection
            apiKey={ENSO_KEY ?? "b4d83fec-53ff-48b4-96b9-e7ac64de2123"}
            tokenOut={token}
            chainId={chainId}
            themeConfig={themeConfig}
          />
        </div>
      )}
    </div>
  );
}
