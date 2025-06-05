import { sessionAtom, userInfoAtom } from "@/store/global";
import { useAtom, useAtomValue } from "jotai";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WalletIcon, XIcon } from "lucide-react";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { toast } from "sonner";
import { LoadingCircle } from "@/components/animations/loading-circle";
import { api } from "@/app/api/royco";
import { parentSessionAtom } from "@/store/global";

export const WalletEditor = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedWallet: string | null;
  }
>(({ className, isOpen, onOpenChange, selectedWallet, ...props }, ref) => {
  const userInfo = useAtomValue(userInfoAtom);

  const [session, setSession] = useAtom(sessionAtom);
  const [parentSession, setParentSession] = useAtom(parentSessionAtom);

  const [isLoading, setIsLoading] = useState(false);

  const [step, setStep] = useState<"info" | "delete" | "delete-success">(
    "info"
  );

  const [isDeletingWallet, setIsDeletingWallet] = useState(false);

  const deleteWallet = async () => {
    setIsDeletingWallet(true);

    try {
      if (!selectedWallet) {
        toast.error("No wallet selected");
        return;
      }

      await api.userControllerEditUser({
        deleteWallet: selectedWallet,
      });
    } catch (error) {
      toast.error(
        (error as any)?.response?.data?.error?.message ??
          "Error deleting wallet"
      );
    }

    setIsDeletingWallet(false);
  };

  const linkNewWallet = async () => {
    setIsLoading(true);

    try {
      if (!selectedWallet) {
        toast.error("No wallet selected");
        return;
      }

      setParentSession(session);
    } catch (error) {
      toast.error(
        (error as any)?.response?.data?.error?.message ??
          "Error linking new wallet"
      );
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {isOpen && (
        <DialogContent
          className={cn("p-6 sm:max-w-[500px]", className)}
          ref={ref}
          {...props}
        >
          <Button
            type="button"
            variant="transparent"
            className="absolute right-3 top-3"
            onClick={() => onOpenChange(false)}
          >
            <XIcon className="h-6 w-6 text-_secondary_" />
          </Button>

          <DialogHeader>
            <DialogTitle>
              <WalletIcon className="h-10 w-10 text-_primary_" />

              <PrimaryLabel className="mt-6 text-2xl text-_primary_">
                {selectedWallet ? "Delete Wallet" : "Link New Wallet"}
              </PrimaryLabel>
            </DialogTitle>
          </DialogHeader>

          <DialogDescription>
            <div className="flex flex-col">
              <SecondaryLabel className="mt-3 text-_secondary_">
                {selectedWallet
                  ? "Your wallet will be deleted immediately and it will no longer be associated with your account. You can't undo this action."
                  : "The more wallets you link, the more access features you receive via Royco Royalty."}
              </SecondaryLabel>

              <div className="mt-6 flex flex-row items-center justify-between gap-3">
                <Button
                  size="fixed"
                  type="button"
                  onClick={() => onOpenChange(false)}
                  variant="outline"
                  className="w-full"
                >
                  Cancel
                </Button>

                <Button
                  size="fixed"
                  type="button"
                  disabled={isLoading}
                  onClick={linkNewWallet}
                  variant="outline"
                  className={cn(
                    "w-full bg-_primary_ text-white",
                    isLoading && "cursor-not-allowed"
                  )}
                >
                  {isLoading ? <LoadingCircle /> : "Confirm"}
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogContent>
      )}
    </Dialog>
  );
});

WalletEditor.displayName = "WalletEditor";
