"use client";

import React from "react";
import { useState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

export const RoyaltyFormPopUp = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const royaltyForm = useForm<z.infer<typeof RoyaltyFormSchema>>({
    resolver: zodResolver(RoyaltyFormSchema),
    defaultValues: {
      username: "",
      email: "",
      wallets: [],
    },
  });

  const onSubmit = (data: z.infer<typeof RoyaltyFormSchema>) => {
    console.log(data);
  };

  return (
    <Form {...royaltyForm}>
      <form
        onSubmit={royaltyForm.handleSubmit(onSubmit)}
        className="flex w-full flex-col bg-[#FBFBF8]"
      >
        <div className="sticky top-0 border-b border-divider bg-[#FBFBF8] px-[25px] py-2 font-gt text-lg font-medium text-black">
          Join the Royco Royalty
        </div>

        <div className="w-full !bg-white px-7 pb-8 pt-6">
          <FormEmail royaltyForm={royaltyForm} />

          <FormUsername className="mt-6" royaltyForm={royaltyForm} />

          <FormWallets className="mt-6" royaltyForm={royaltyForm} />
        </div>
      </form>
    </Form>
  );
});
