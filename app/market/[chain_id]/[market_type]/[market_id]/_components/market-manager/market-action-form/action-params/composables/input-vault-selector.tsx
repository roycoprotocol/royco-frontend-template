import React from "react";
import { cn } from "@/lib/utils";
import { isSolidityAddressValid } from "royco/utils";
import { Input } from "@/components/ui/input";
import { useErc4626VaultChecker } from "royco/hooks";
import { LoadingSpinner } from "@/components/composables";
import { BadgeAlertIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BadgeCheckIcon } from "lucide-react";
import { useAtomValue } from "jotai";
import { loadableEnrichedMarketAtom } from "@/store/market";

export const InputVaultSelector = React.forwardRef<
  HTMLInputElement,
  React.HTMLAttributes<HTMLDivElement> & {
    currentValue: string;
    setCurrentValue: (value: string) => void;
    containerClassName?: string;
    Prefix?: React.FC;
  }
>(
  (
    { className, currentValue, setCurrentValue, containerClassName, ...props },
    ref
  ) => {
    const { data: enrichedMarket } = useAtomValue(loadableEnrichedMarketAtom);

    const { data, isLoading } = useErc4626VaultChecker({
      chain_id: enrichedMarket?.chainId ?? 1,
      contract_address: currentValue,
    });

    return (
      <Input
        ref={ref}
        type="text"
        containerClassName={cn(
          "h-9 text-sm bg-white rounded-lg grow",
          containerClassName
        )}
        className={cn("", className)}
        placeholder="Enter Vault Address"
        value={currentValue}
        onChange={(e) => {
          setCurrentValue(e.target.value);
        }}
        Suffix={() => {
          if (isSolidityAddressValid("address", currentValue) && isLoading) {
            return <LoadingSpinner className="h-4 w-4" />;
          }

          if (isSolidityAddressValid("address", currentValue) && !isLoading) {
            return (
              <Tooltip>
                <TooltipTrigger>
                  {data === true ? (
                    <BadgeCheckIcon
                      strokeWidth={1.5}
                      className="h-5 w-5 text-success"
                    />
                  ) : (
                    <BadgeAlertIcon
                      strokeWidth={1.5}
                      className="h-5 w-5 text-error"
                    />
                  )}
                </TooltipTrigger>
                <TooltipContent className="">
                  {data === true
                    ? "It may be an ERC-4626 vault."
                    : "We couldn't verify vault validity."}
                </TooltipContent>
              </Tooltip>
            );
          }
        }}
        {...props}
      />
    );
  }
);
