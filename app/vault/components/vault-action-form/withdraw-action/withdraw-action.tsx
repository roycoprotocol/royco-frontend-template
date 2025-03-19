import React from "react";
import { useAccount } from "wagmi";

import { cn } from "@/lib/utils";
import { WithdrawActionForm } from "./withdraw-action-form/withdraw-action-form";
import {
  SecondaryLabel,
  TertiaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  VAULT_DECIMALS,
  VAULT_DEPOSIT_TOKENS,
} from "@/app/vault/providers/boring-vault/boring-vault-provider";
import { ErrorAlert } from "@/components/composables/alerts";
import { useConnectWallet } from "@/app/_components/provider/connect-wallet-provider";
import toast from "react-hot-toast";
import { useEthersSigner } from "@/app/vault/hook/useEthersSigner";
import { useBoringVaultV1 } from "boring-vault-ui";
import { useAtomValue } from "jotai";
import { boringVaultAtom } from "@/store/vault/atom/boring-vault";

export const withdrawFormSchema = z.object({
  token: z.object({
    address: z.string(),
    decimals: z.number(),
  }),
  amount: z.string(),
  discount: z.string(),
  validDays: z.string(),
});

export const WithdrawAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  // TODO: Implement Hook
  const incentivesTokens = [
    {
      id: 1,
      label: "GHO",
      value: "100,000 GHO",
    },
    {
      id: 2,
      label: "GHO",
      value: "100,000 GHO",
    },
    {
      id: 3,
      label: "GHO",
      value: "100,000 GHO",
    },
  ];

  const incentivesPoints = [
    {
      id: 1,
      label: "GHO",
      value: "100,000 GHO",
    },
    {
      id: 2,
      label: "GHO",
      value: "200,000 GHO",
    },
  ];

  const boringVault = useAtomValue(boringVaultAtom);

  const { address } = useAccount();
  const { connectWalletModal } = useConnectWallet();

  const { queueBoringWithdraw } = useBoringVaultV1();
  const signer = useEthersSigner();

  const withdrawForm = useForm<z.infer<typeof withdrawFormSchema>>({
    resolver: zodResolver(withdrawFormSchema),
    defaultValues: {
      token: VAULT_DEPOSIT_TOKENS[0],
      amount: "",
      discount: "0.001",
      validDays: "4",
    },
  });

  const handleWithdraw = async () => {
    if (!signer) {
      toast.custom(<ErrorAlert message="Error connecting wallet" />);
      return;
    }

    if (!boringVault) {
      return;
    }

    const amount = parseFloat(withdrawForm.getValues("amount") || "0");
    const shares =
      (amount * 10 ** VAULT_DEPOSIT_TOKENS[0].decimals) /
      (boringVault.share_price * 10 ** VAULT_DECIMALS);

    const token = withdrawForm.getValues("token");
    const discount = parseFloat(withdrawForm.getValues("discount") || "0");
    const validDays = parseInt(withdrawForm.getValues("validDays") || "0");

    console.log({
      shares,
      token,
      discount,
      validDays,
    });

    // @ts-ignore
    await queueBoringWithdraw(signer, shares, token, discount, validDays);
  };

  return (
    <div ref={ref} className={cn("", className)} {...props}>
      <WithdrawActionForm withdrawForm={withdrawForm} />

      <>
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
                        <ErrorAlert message="Error connecting wallet" />
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

            return (
              <Button
                onClick={() => {
                  try {
                    handleWithdraw();
                  } catch (error) {
                    toast.custom(
                      <ErrorAlert message="Error submitting offer" />
                    );
                  }
                }}
                size="sm"
                className="w-full"
              >
                <span>Claim</span>
              </Button>
            );
          })()}
        </div>
      </>

      <div className="mt-5">
        <SecondaryLabel>Incentives - Tokens</SecondaryLabel>

        <div className="mt-3 space-y-2">
          {incentivesTokens.map((token) => (
            <div key={token.id} className="flex justify-between gap-2">
              <SecondaryLabel className="font-medium text-black">
                {token.label}
              </SecondaryLabel>

              <div className="flex items-center gap-2">
                <SecondaryLabel className="text-black">
                  {token.value}
                </SecondaryLabel>

                <Button className="h-fit w-fit px-5 py-1 text-sm">Claim</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <SecondaryLabel>Incentives - Points</SecondaryLabel>
        <TertiaryLabel className="mt-1 text-sm">
          Claimable once the points are transferrable.
        </TertiaryLabel>

        <div className="mt-3 space-y-2">
          {incentivesPoints.map((point) => (
            <div key={point.id} className="flex justify-between gap-2">
              <SecondaryLabel className="font-medium text-black">
                {point.label}
              </SecondaryLabel>

              <SecondaryLabel className="text-black">
                {point.value}
              </SecondaryLabel>
            </div>
          ))}
        </div>
      </div>

      <SecondaryLabel className="mt-10 break-normal text-center">
        Note: It may take up to 7 days to withdraw the principal. Incentives may
        take 7 days to appear.
      </SecondaryLabel>
    </div>
  );
});
