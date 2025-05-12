import React from "react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketActionFormSchema } from "../market-action-form-schema";
import { SlideUpWrapper } from "@/components/animations/slide-up-wrapper";
import { SecondaryLabel } from "../../../composables";
import { MarketSteps, useMarketManager } from "@/store";
import { BASE_UNDERLINE } from "../../../composables";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { ErrorAlert } from "@/components/composables";
import { useAccount, useChainId } from "wagmi";
import { useConnectWallet } from "@/app/_containers/providers/connect-wallet-provider";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { PreviewStep } from "./preview-step";
import { useAtomValue } from "jotai";
import { loadableEnrichedMarketAtom } from "@/store/market";
import { useMarketFormDetailsApi } from "../use-market-form-details-api";
import { enrichTxOptions } from "royco/transaction";

export const ActionPreview = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { address } = useAccount();
  const chainId = useChainId();

  const { connectWalletModal } = useConnectWallet();
  const { setMarketStep, setTransactions } = useMarketManager();
  const { data: enrichedMarket } = useAtomValue(loadableEnrichedMarketAtom);

  const propsAction = useMarketFormDetailsApi(marketActionForm);

  return (
    <div ref={ref} className={cn("flex grow flex-col", className)} {...props}>
      <SlideUpWrapper
        className={cn(
          "mt-5 flex w-full flex-row place-content-start items-center text-left"
        )}
      >
        <div
          onClick={() => setMarketStep(MarketSteps.params.id)}
          className={cn(
            BASE_UNDERLINE.MD,
            "flex flex-row place-content-start items-center space-x-1 text-left decoration-transparent",
            "transition-all duration-200 ease-in-out hover:text-black hover:decoration-tertiary"
          )}
        >
          <ChevronLeftIcon strokeWidth={1} className="h-5 w-5 text-secondary" />
          <SecondaryLabel className="mt-[0.15rem] flex h-4 leading-none">
            OFFER PARAMS
          </SecondaryLabel>
        </div>
      </SlideUpWrapper>

      <PreviewStep marketActionForm={marketActionForm} className={cn("mt-5")} />

      <div className="mt-5">
        {(() => {
          if (!address) {
            return (
              <Button
                onClick={() => {
                  try {
                    connectWalletModal();
                  } catch (error) {
                    toast.custom(
                      <ErrorAlert message="Error submitting offer" />
                    );
                  }
                }}
                size="sm"
                className="w-full"
              >
                Connect Wallet
              </Button>
            );
          }

          if (chainId !== enrichedMarket?.chainId) {
            return (
              <Button
                onClick={async () => {
                  try {
                    // @ts-ignore
                    await switchChain(config, {
                      chainId: enrichedMarket?.chainId,
                    });
                  } catch (error) {
                    toast.custom(
                      <ErrorAlert message="Error submitting offer" />
                    );
                    console.log("Failed:", error);
                  }
                }}
                size="sm"
                className="w-full"
              >
                Switch Chain
              </Button>
            );
          }

          return (
            <Button
              onClick={() => {
                try {
                  if (
                    propsAction.data?.fillStatus === "partial" ||
                    propsAction.data?.fillStatus === "full"
                  ) {
                    const enrichedTxOptions = enrichTxOptions({
                      txOptions: propsAction.data.rawTxOptions,
                    });

                    setTransactions(enrichedTxOptions);
                  }
                } catch (error) {
                  toast.custom(<ErrorAlert message="Error submitting offer" />);
                }
              }}
              size="sm"
              className="w-full"
              disabled={propsAction.isLoading}
            >
              <span>Confirm offer</span>
            </Button>
          );
        })()}
      </div>
    </div>
  );
});
