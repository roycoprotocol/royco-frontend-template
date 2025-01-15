"use client";

import React from "react";

import { cn } from "@/lib/utils";

import { z } from "zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";

import { RoyaltyFormSchema } from "./royality-form-schema";
import { FormInputLabel } from "@/components/composables";
import { TelegramConnectButton } from "./telegram-connect-button";

export const FormTelegram = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    royaltyForm: UseFormReturn<z.infer<typeof RoyaltyFormSchema>>;
  }
>(({ className, royaltyForm, ...props }, ref) => {
  const onAuthCallback = (data: any) => {
    // Set form data for telegram field
    royaltyForm.setValue("telegram", {
      id: data.id?.toString(),
      username: data.username,
      hash: data.hash,
      auth_date: data.auth_date?.toString(),
      first_name: data.first_name,
      last_name: data.last_name,
      photo_url: data.photo_url,
    });
  };

  return (
    <FormField
      control={royaltyForm.control}
      name="telegram"
      render={({ field }) => (
        <FormItem className={cn("", className)}>
          <FormInputLabel className="mb-2" label="Telegram" />

          <FormControl>
            {royaltyForm.watch("telegram")?.username ? (
              <div className="flex h-12 flex-col items-center justify-center rounded-lg border border-divider bg-z2">
                Connected: @{royaltyForm.watch("telegram").username}
              </div>
            ) : (
              <TelegramConnectButton
                botUsername="royco_verification_bot"
                onAuthCallback={onAuthCallback}
              />
            )}
          </FormControl>

          <FormDescription className="mt-2">
            Your telegram account. <i>Optional.</i>
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
});
