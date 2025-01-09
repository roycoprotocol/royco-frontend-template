"use client";

import React from "react";
import { useState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useWeb3Modal } from "@web3modal/wagmi/react";

import clsx from "clsx";

import { useAccount, useDisconnect } from "wagmi";
import { useSignMessage, useVerifyMessage } from "wagmi";
import { verifyMessage } from "@wagmi/core";

import { switchChain } from "@wagmi/core";
import { mainnet } from "@wagmi/core/chains";

import { useSwitchChain } from "wagmi";

import toast from "react-hot-toast";

import { useWeb3ModalState } from "@web3modal/wagmi/react";
import { CaretRightIcon, CaretDownIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { matcher } from "./matcher";
import { RoyaltyFormSchema } from "./royality-form-schema";
import { FormEmail } from "./form-email";
import { FormUsername } from "./form-username";
import { FormWallets } from "./form-wallets";
import { ExpectedSpot } from "./expected-spot";
import { FormTelegram } from "./form-telegram";
import { useJoin } from "@/store";

export const RoyaltyFormPopUp = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    royaltyForm: UseFormReturn<z.infer<typeof RoyaltyFormSchema>>;
  }
>(({ className, royaltyForm, ...props }, ref) => {
  const onSubmit = (data: z.infer<typeof RoyaltyFormSchema>) => {
    console.log(data);
  };

  const { openRoyaltyForm } = useJoin();

  const { disconnectAsync } = useDisconnect();

  const disconnectWalletIfProofNotRequired = async () => {
    if (
      !openRoyaltyForm &&
      !royaltyForm
        .getValues("wallets")
        .some((wallet) => wallet.proof.length === 0)
    ) {
      await disconnectAsync();
    }
  };

  useEffect(() => {
    disconnectWalletIfProofNotRequired();
  }, [openRoyaltyForm]);

  return (
    <Form {...royaltyForm}>
      <form
        onSubmit={royaltyForm.handleSubmit(onSubmit)}
        className="flex w-full flex-col bg-[#FBFBF8]"
      >
        <div className="sticky top-0 border-b border-divider bg-[#FBFBF8] px-[25px] py-2 text-lg font-semibold text-black">
          Join the Royco Royalty
        </div>

        <div className="w-full !bg-white px-7 pb-8 pt-6">
          <FormEmail royaltyForm={royaltyForm} />

          <FormUsername className="mt-6" royaltyForm={royaltyForm} />

          <FormWallets className="mt-6" royaltyForm={royaltyForm} />

          <ExpectedSpot className="mt-6" royaltyForm={royaltyForm} />

          <Button
            type="submit"
            onClick={() => {}}
            className={cn(
              "mt-8 h-12 w-full rounded-lg bg-mint font-inter text-sm font-normal shadow-none hover:bg-opacity-90"
              // isPendingSignMessage ? "border border-divider bg-z2" : "bg-mint"
            )}
          >
            {/* {isPendingSignMessage ? (
                <LoadingSpinner className="h-5 w-5" />
              ) : (
                "Prove Funds"
              )} */}
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
});
