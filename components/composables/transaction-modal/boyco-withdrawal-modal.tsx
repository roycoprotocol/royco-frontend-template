"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { DialogClose } from "@radix-ui/react-dialog";
import React from "react";

export const BoycoWithdrawalModal = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    isOpen: boolean;
    onOpenModal: (open: boolean) => void;
    onConfirm: () => void;
  }
>((props, ref) => {
  const { className, children, isOpen, onOpenModal, onConfirm, ...otherProps } =
    props;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenModal}>
      {isOpen && (
        <DialogContent
          className={cn("sm:max-w-[500px]", className)}
          ref={ref}
          {...otherProps}
        >
          <DialogHeader>
            <DialogTitle>
              Approval Required: No withdrawals until market ends
            </DialogTitle>
            <DialogDescription>
              Once deposited, there are no withdrawals until the end of the
              market. Funds must be claimed from the same address on Berachain.
            </DialogDescription>
          </DialogHeader>

          <DialogClose asChild>
            <Button
              className="mt-5 h-9 text-sm"
              onClick={onConfirm}
              type="button"
            >
              <div className="h-5">I accept there are no withdrawals</div>
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button className="h-9 bg-error text-sm" type="button">
              <div className="h-5">Go back</div>
            </Button>
          </DialogClose>
        </DialogContent>
      )}
    </Dialog>
  );
});

BoycoWithdrawalModal.displayName = "BoycoWithdrawalModal";
