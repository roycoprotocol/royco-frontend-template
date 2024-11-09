"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { DialogClose } from "@radix-ui/react-dialog";
import React from "react";

export const ConnectWalletAlertModal = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    isOpen: boolean;
    onOpenModal: (value: boolean) => void;
  }
>((props, ref) => {
  const { className, children, isOpen, onOpenModal, ...otherProps } = props;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenModal}>
      {isOpen && (
        <DialogContent
          className={cn("sm:max-w-[500px]", className)}
          ref={ref}
          {...otherProps}
        >
          <DialogHeader>
            <DialogTitle>Access Restricted</DialogTitle>
            <DialogDescription>
              Due to regulatory restrictions, we are unable to provide services
              to users from your region.
            </DialogDescription>
          </DialogHeader>

          <DialogClose asChild>
            <Button className="mt-2 h-9 bg-error text-sm">
              <div className="h-5">Close</div>
            </Button>
          </DialogClose>
        </DialogContent>
      )}
    </Dialog>
  );
});

ConnectWalletAlertModal.displayName = "ConnectWalletAlertModal";
