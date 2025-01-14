"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { isAddress } from "viem";
import React, { useState } from "react";
import { AddWalletModal } from "./add-wallet-modal";
import { AlertIndicator } from "@/components/common/alert-indicator";

type ProfileForm = {
  username: string;
  email: string;
  wallets: `0x${string}`[];
};

const validation = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  wallets: z
    .array(
      z
        .string()
        .refine(
          (address) => isAddress(address),
          "Invalid Ethereum wallet address"
        )
    )
    .min(1, "Add a wallet"),
});

const initialValues = {
  username: "",
  email: "",
  wallets: [] as `0x${string}`[],
};

export const Profile = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);
  const {
    control,
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(validation),
    defaultValues: initialValues,
  });

  const { append, remove } = useFieldArray({
    control,
    name: "wallets" as never,
  });

  const onSubmit = (data: ProfileForm) => {
    console.log(data);
  };

  const walletAddresses = watch("wallets");

  return (
    <div className={cn("", className)}>
      <Card>
        <CardContent className="p-5 md:p-6 ">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Username <span className="text-red-500">*</span>
              </label>
              <Input {...register("username")} placeholder="Enter username" />
              {errors.username && (
                <p className="text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input {...register("email")} placeholder="Enter email address" />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">
                  Connected Wallets
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddWalletOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>

              {walletAddresses.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed">
                  <AlertIndicator>
                    <span>No wallet found.</span>
                  </AlertIndicator>
                </div>
              ) : (
                walletAddresses.map((address, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2"
                  >
                    <>
                      <div className="flex-1">
                        {`${address.slice(0, 6)}...${address.slice(-4)}`}
                      </div>
                      <div className="w-32 text-right text-sm text-secondary">
                        $1,234.56
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="flex w-10 items-center justify-center"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  </div>
                ))
              )}
            </div>

            <Button type="submit" className="w-full">
              Save
            </Button>
          </form>
        </CardContent>
      </Card>

      <AddWalletModal
        isOpen={isAddWalletOpen}
        onClose={() => setIsAddWalletOpen(false)}
        onConfirm={(address) => append(address)}
      />
    </div>
  );
});
