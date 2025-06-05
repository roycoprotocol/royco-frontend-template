import React from "react";
import EnsoWidget, { SystemConfig } from "@ensofinance/shortcuts-widget";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SlideUpWrapper } from "@/components/animations";
import { FormInputLabel } from "@/components/composables/form/form-input-labels";
import { TertiaryLabel } from "../../../../../../composables/common-labels";
import { XIcon } from "lucide-react";
import { useAtom, useAtomValue } from "jotai";
import { showEnsoShortcutsWidgetAtom } from "@/store/global";
import {
  isCrossChainZapDisabled,
  loadableEnrichedMarketAtom,
} from "@/store/market";

const ENSO_KEY = process.env.NEXT_PUBLIC_ENSO_API_KEY;

// Paste styling according to the design system
// https://www.chakra-ui.com/docs/theming/customization/overview
const themeConfig: SystemConfig = {
  theme: {
    tokens: {
      radii: {
        sm: { value: "0.125rem" },
        md: { value: "0.125rem" },
        lg: { value: "0.125rem" },
        xl: { value: "0.125rem" },
      },
    },
  },
};

export const EnsoShortcutsWidget = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    token: string;
    symbol: string;
    chainId?: number;
  }
>(({ className, token, symbol, chainId, children, ...props }, ref) => {
  const [showEnsoWidget, setShowEnsoWidget] = useAtom(
    showEnsoShortcutsWidgetAtom
  );
  const { data: enrichedMarket } = useAtomValue(loadableEnrichedMarketAtom);

  return (
    <div ref={ref} className={cn("mb-1", className)} {...props}>
      <div className={"flex w-full items-start gap-2"}>{children}</div>

      {showEnsoWidget && (
        <SlideUpWrapper>
          <div className="mt-4">
            <div className="flex items-start justify-between">
              <div>
                <FormInputLabel size="sm" label={`Get ${symbol} with Enso`} />
                <TertiaryLabel className="mt-1">
                  Use Enso Shortcuts to easily swap into assets.
                </TertiaryLabel>
              </div>

              <Button
                size="sm"
                variant="ghost"
                className="p-2"
                onClick={() => setShowEnsoWidget(!showEnsoWidget)}
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>

            <div className={"mt-2"}>
              <EnsoWidget
                obligateSelection
                themeConfig={themeConfig}
                apiKey={ENSO_KEY}
                outChainId={
                  isCrossChainZapDisabled(enrichedMarket?.id)
                    ? undefined
                    : chainId
                }
                chainId={chainId}
                tokenOut={token}
              />
            </div>
          </div>
        </SlideUpWrapper>
      )}
    </div>
  );
});
