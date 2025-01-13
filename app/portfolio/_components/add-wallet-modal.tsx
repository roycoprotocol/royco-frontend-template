"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { isAddress } from "viem";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface AddWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (address: `0x${string}`) => void;
}

const validation = z.object({
  address: z
    .string()
    .min(1, "Please enter a wallet address")
    .refine((address) => isAddress(address), "Invalid Ethereum wallet address"),
});

type FormValues = {
  address: string;
};

export function AddWalletModal({
  isOpen,
  onClose,
  onConfirm,
}: AddWalletModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(validation),
    defaultValues: {
      address: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    onConfirm(data.address as `0x${string}`);
    reset();
    onClose();
  };

  const onCancel = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Wallet</DialogTitle>
          <DialogDescription>
            Enter an Ethereum wallet address to add to your profile
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Input placeholder="0x..." {...register("address")} />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button className="h-9 w-full text-sm" type="submit">
              <div className="h-5">Add Wallet</div>
            </Button>

            <Button
              className="h-9 w-full bg-error text-sm"
              type="button"
              onClick={onCancel}
            >
              <div className="h-5">Cancel</div>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
