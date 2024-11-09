"use client";

import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { LockupTimeMap, MarketBuilderFormSchema } from "../market-builder-form";
import { cn } from "@/lib/utils";
import { useMarketBuilderManager } from "@/store";
import { Button } from "@/components/ui/button";
import { MarketBuilderSteps } from "@/store";
import { MotionWrapper } from "../market-builder-flow/animations";
import { ErrorAlert, LoadingSpinner } from "@/components/composables";
import { useAccount, useConnectorClient, useSimulateContract } from "wagmi";
import { config } from "@/components/web3-modal/modal-config";
import { switchChain } from "@wagmi/core";
import { useWeb3Modal, useWeb3ModalState } from "@web3modal/wagmi/react";
import toast from "react-hot-toast";
import { ContractMap } from "@/sdk/contracts";
import { useCreateRecipeMarket, useCreateVaultMarket } from "@/sdk/hooks";
import { REWARD_STYLE } from "@/sdk/constants";
import { BuilderSectionWrapper } from "../composables";
import { useConnectWallet } from "../../../_components/provider/connect-wallet-provider";

export const BottomNavigator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketBuilderForm: UseFormReturn<z.infer<typeof MarketBuilderFormSchema>>;
    writeContract: any;
    txStatus: string;
  }
>(
  (
    { className, marketBuilderForm, writeContract, txStatus, ...props },
    ref
  ) => {
    const { data: clientConnector } = useConnectorClient();

    const [forceLoader, setForceLoader] = React.useState(false);
    const [isStepValid, setIsStepValid] = React.useState(true);
    const [checkingValidity, setCheckingValidity] = React.useState(false);

    const { activeStep, setActiveStep, setForceClose } =
      useMarketBuilderManager();

    const { open, close } = useWeb3Modal();
    const { selectedNetworkId, open: isModalOpen } = useWeb3ModalState();
    const { address, isConnected, isConnecting, isDisconnected } = useAccount();

    const { connectWallet } = useConnectWallet();

    const {
      isReady: isReadyRecipe,
      writeContractOptions: writeContractOptionsRecipe,
    } = useCreateRecipeMarket({
      chainId: marketBuilderForm.watch("chain").id,
      enterMarketActions: marketBuilderForm.watch("enter_actions"),
      exitMarketActions: marketBuilderForm.watch("exit_actions"),
      lockupTime: (
        parseInt(marketBuilderForm.watch("lockup_time").duration ?? "0") *
        LockupTimeMap[marketBuilderForm.watch("lockup_time").duration_type]
          .multiplier
      ).toString(),
      inputToken: marketBuilderForm.watch("asset")?.contract_address,
      frontendFee: process.env.NEXT_PUBLIC_FRONTEND_FEE as string,
      rewardStyle:
        marketBuilderForm.watch("incentive_schedule") === "upfront"
          ? REWARD_STYLE.Upfront
          : marketBuilderForm.watch("incentive_schedule") === "arrear"
            ? REWARD_STYLE.Arrear
            : REWARD_STYLE.Forfeitable,
    });

    const {
      isReady: isReadyVault,
      writeContractOptions: writeContractOptionsVault,
    } = useCreateVaultMarket({
      chainId: marketBuilderForm.watch("chain").id,
      frontendFee: process.env.NEXT_PUBLIC_FRONTEND_FEE as string,
      vaultAddress: marketBuilderForm.watch("vault_address"),
      vaultName: marketBuilderForm.watch("market_name"),
      vaultOwner: address,
    });

    const handleNextStep = async () => {
      if (activeStep === MarketBuilderSteps.info.id) {
        if (marketBuilderForm.watch("action_type") === "recipe") {
          setActiveStep(MarketBuilderSteps.actions.id);
        } else {
          setActiveStep(MarketBuilderSteps.vault.id);
        }
      } else if (activeStep === MarketBuilderSteps.actions.id) {
        setActiveStep(MarketBuilderSteps.params.id);
      } else if (activeStep === MarketBuilderSteps.params.id) {
        setActiveStep(MarketBuilderSteps.review.id);
      } else if (activeStep === MarketBuilderSteps.vault.id) {
        setActiveStep(MarketBuilderSteps.review.id);
      } else {
        // wallet not connected
        if (!isConnected) {
          connectWallet();
        }

        // wrong chain
        // @ts-ignore
        else if (selectedNetworkId !== marketBuilderForm.watch("chain").id) {
          setForceLoader(true);
          try {
            await switchChain(config, {
              chainId: marketBuilderForm.watch("chain").id,
            });
          } catch (error) {
            console.log(error);
          }
          setForceLoader(false);
        }
        // submit tx
        else {
          if (marketBuilderForm.watch("action_type") === "recipe") {
            if (writeContractOptionsRecipe !== null) {
              try {
                writeContract(writeContractOptionsRecipe);
              } catch (error) {
                console.log("error", error);
                toast.custom(
                  <ErrorAlert message="Error submitting transaction" />
                );
              }
            }
          } else if (writeContractOptionsVault !== null) {
            try {
              writeContract(writeContractOptionsVault);
            } catch (error) {
              console.log("error", error);
              toast.custom(
                <ErrorAlert message="Error submitting transaction" />
              );
            }
          }
        }
      }
    };

    const nextLabel = () => {
      if (activeStep === MarketBuilderSteps.info.id) {
        return "Next";
      } else if (activeStep === MarketBuilderSteps.actions.id) {
        return "Proceed";
      } else if (activeStep === MarketBuilderSteps.vault.id) {
        return "Review";
      } else if (activeStep === MarketBuilderSteps.params.id) {
        return "Review";
      } else if (activeStep === MarketBuilderSteps.review.id) {
        const RecipeMarketHub =
          ContractMap[
            marketBuilderForm.watch("chain").id as keyof typeof ContractMap
          ] ?? undefined;

        if (RecipeMarketHub === undefined) {
          return "Contracts not deployed yet.";
        }

        if (isDisconnected || isConnecting) {
          return "Connect Wallet";
        }

        // @ts-ignore
        else if (selectedNetworkId !== marketBuilderForm.watch("chain").id) {
          return "Switch Chain";
        } else {
          return "Submit";
        }
      }
    };

    const checkValidity = async () => {
      setCheckingValidity(true);

      if (activeStep === MarketBuilderSteps.info.id) {
        if (marketBuilderForm.watch("action_type") === "recipe") {
          const market_name = await marketBuilderForm.trigger("market_name");
          const market_description =
            await marketBuilderForm.trigger("market_description");
          const chain = await marketBuilderForm.trigger("chain");
          const lockup_time = await marketBuilderForm.trigger("lockup_time");
          const asset = await marketBuilderForm.trigger("asset");
          const isValid =
            market_name && market_description && chain && lockup_time && asset;

          if (isValid === false) {
            toast.custom((t) => (
              <ErrorAlert message="Invalid Market Details" />
            ));
          }

          return isValid;
        } else {
          const market_name = await marketBuilderForm.trigger("market_name");
          const market_description =
            await marketBuilderForm.trigger("market_description");
          const chain = await marketBuilderForm.trigger("chain");

          const isValid = market_name && market_description && chain;

          if (isValid === false) {
            toast.custom((t) => (
              <ErrorAlert message="Invalid Market Details" />
            ));
          }

          return isValid;
        }
      } else if (activeStep === MarketBuilderSteps.actions.id) {
        if (marketBuilderForm.watch("exit_actions").length <= 0) {
          toast.custom((t) => (
            <ErrorAlert message="Please define an Exit script so users may withdraw their positions. By default, Markets without an Exit script will be flagged and will not be listed." />
          ));
        }
        if (marketBuilderForm.watch("enter_actions").length <= 0) {
          toast.custom((t) => (
            <ErrorAlert message="Enter market script is empty" />
          ));

          return false;
        }
      } else if (activeStep === MarketBuilderSteps.params.id) {
        const isEnterActionsValid =
          await marketBuilderForm.trigger("enter_actions");
        const isExitActionsValid =
          await marketBuilderForm.trigger("exit_actions");

        const isValid = isEnterActionsValid && isExitActionsValid;

        if (isValid === false) {
          if (isEnterActionsValid === false) {
            toast.custom(
              <ErrorAlert message="Params for enter market script are invalid" />
            );
          } else {
            toast.custom(
              <ErrorAlert message="Params for exit market script are invalid" />
            );
          }
        }

        return isValid;
      } else if (activeStep === MarketBuilderSteps.vault.id) {
        const vault_address = await marketBuilderForm.trigger("vault_address");

        const isValid = vault_address;

        return isValid;
      } else if (activeStep === MarketBuilderSteps.review.id) {
        if (marketBuilderForm.watch("action_type") === "recipe") {
          const RecipeMarketHub =
            ContractMap[
              marketBuilderForm.watch("chain").id as keyof typeof ContractMap
            ] ?? undefined;

          if (RecipeMarketHub === undefined) {
            return false;
          }
        } else {
          const VaultMarketHub =
            ContractMap[
              marketBuilderForm.watch("chain").id as keyof typeof ContractMap
            ] ?? undefined;

          if (VaultMarketHub === undefined) {
            return false;
          }
        }
      }

      return true;
    };

    const { isLoading: isLoadingSimulation, status: statusSimulation } =
      useSimulateContract({
        enabled:
          marketBuilderForm.watch("action_type") === "recipe"
            ? isReadyRecipe
            : isReadyVault,
        ...(marketBuilderForm.watch("action_type") === "recipe"
          ? writeContractOptionsRecipe
          : writeContractOptionsVault),
        account: address,
        // @ts-ignore
        connector: clientConnector,
      });

    const resetIsStepValid = () => {
      setIsStepValid(true);
    };

    useEffect(() => {
      resetIsStepValid();
    }, [isStepValid]);

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex shrink-0 flex-col items-center",
          className
        )}
        {...props}
      >
        {/**
         * @note SimulationBox is disabled for now
         */}
        {/* {activeStep === MarketBuilderSteps.review.id && (
        <MotionWrapper className="w-full" delay={0.4}>
          <h4 className="font-gt text-base font-medium text-black">
            Deployment Simulation
          </h4>

          <SimulationBox
            className="mt-3"
            errorMessage={
              marketBuilderForm.watch("action_type") === "vault"
                ? "Transaction will fail. Please check your ERC-4626 vault compliancy."
                : "Transaction will fail. Please check your market details."
            }
            successMessage="Simulation shows market is valid and will be deployed successfully."
            infoMessage="Connect Wallet to see if market can be deployed."
            enabled={
              marketBuilderForm.watch("action_type") === "recipe"
                ? isReadyRecipe
                : isReadyVault
            }
            simulateContractOptions={
              marketBuilderForm.watch("action_type") === "recipe"
                ? writeContractOptionsRecipe
                : writeContractOptionsVault
            }
          />
        </MotionWrapper>
      )} */}

        {activeStep === MarketBuilderSteps.review.id && (
          <MotionWrapper delay={0.4}>
            <div className="mb-3 mt-5 w-full text-center font-gt text-base font-light text-secondary">
              Royco markets are immutable.
            </div>
          </MotionWrapper>
        )}

        <BuilderSectionWrapper
          className="w-full"
          delay={
            activeStep === MarketBuilderSteps.review.id
              ? marketBuilderForm.watch("action_type") === "recipe"
                ? 0.4
                : 0.4
              : 0
          }
        >
          <Button
            key={`next-button-${activeStep}`}
            disabled={isStepValid === false || txStatus === "pending"}
            onClick={async () => {
              const isValid = await checkValidity();

              setCheckingValidity(false);

              setIsStepValid(isValid);

              if (isValid === true) {
                // if (window) {
                //   await new Promise((resolve) => {
                //     window.scrollTo({
                //       top: 0,
                //       behavior: "smooth",
                //     });
                //     // Use setTimeout to wait for the scrolling to complete (assuming 500ms for smooth scrolling)
                //     setTimeout(resolve, 500);
                //   });
                // }

                handleNextStep();
              }
            }}
            className="flex max-w-screen-md flex-row items-center self-center"
          >
            {txStatus === "pending" ? (
              <div className="flex h-6 flex-col place-content-center items-center">
                <LoadingSpinner className="h-5 w-5" />
              </div>
            ) : (
              <div className="shrink-0">{nextLabel()}</div>
            )}

            {/* {checkingValidity === true ||
        forceLoader === true ||
        activeStep === MarketBuilderSteps.review.id ? (
          <div className="flex h-6 flex-col place-content-center items-center">
            <LoadingSpinner className="h-5 w-5" />
          </div>
        ) : (
          <div className="shrink-0">{nextLabel()}</div>
        )} */}

            {/* <div className="flex h-6 w-6 flex-col place-content-center items-center">
          <ChevronRightIcon strokeWidth={2} className="h-6 w-6 text-white" />
        </div> */}
          </Button>
        </BuilderSectionWrapper>
      </div>
    );
  }
);
