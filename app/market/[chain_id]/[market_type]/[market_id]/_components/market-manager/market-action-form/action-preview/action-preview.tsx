import React from "react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketActionFormSchema } from "../market-action-form-schema";
import { SlideUpWrapper } from "@/components/animations/slide-up-wrapper";
import { SecondaryLabel, TertiaryLabel } from "../../../composables";
import { MarketSteps, useMarketManager } from "@/store";
import { BASE_UNDERLINE } from "../../../composables";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { ErrorAlert } from "@/components/composables";
import { useAccount, useChainId } from "wagmi";
import { useMarketFormDetails } from "../use-market-form-details";
import { useConnectWallet } from "@/app/_components/provider/connect-wallet-provider";
import { Button } from "@/components/ui/button";
import { useActiveMarket } from "../../../hooks";
import toast from "react-hot-toast";
import { PreviewStep } from "./preview-step";

export const ActionPreview = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { address } = useAccount();
  const chainId = useChainId();

  const { connectWalletModal } = useConnectWallet();

  const { marketStep, setMarketStep, setTransactions } = useMarketManager();
  const { marketMetadata } = useActiveMarket();

  const { writeContractOptions, canBePerformedPartially } =
    useMarketFormDetails(marketActionForm);

  return (
    <div ref={ref} className={cn("flex grow flex-col", className)} {...props}>
      <SlideUpWrapper
        layout="position"
        layoutId={`motion:market:back-button:${marketStep}`}
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

          if (chainId !== marketMetadata.chain_id) {
            return (
              <Button
                onClick={async () => {
                  try {
                    // @ts-ignore
                    await switchChain(config, {
                      chainId: marketMetadata.chain_id,
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
                  if (canBePerformedPartially) {
                    setTransactions(writeContractOptions);
                  }
                } catch (error) {
                  toast.custom(<ErrorAlert message="Error submitting offer" />);
                }
              }}
              size="sm"
              className="w-full"
            >
              <span>Confirm offer</span>
            </Button>
          );
        })()}
      </div>
    </div>
  );
});
