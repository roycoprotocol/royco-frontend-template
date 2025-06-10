"use client";

import { Input } from "@/components/ui/input";
import { isEmailEditorOpenAtom, userInfoAtom } from "@/store/global";
import { useAtom, useAtomValue } from "jotai";
import { cn } from "@/lib/utils";
import React, { Fragment, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  InboxIcon,
  MailIcon,
  ShieldCheckIcon,
  TriangleAlertIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { SuccessIcon } from "@/assets/icons/success";
import { toast } from "sonner";
import { api } from "@/app/api/royco";
import { LoadingCircle } from "@/components/animations/loading-circle";
import { queryClientAtom } from "jotai-tanstack-query";

export const EmailEditorSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
});

export const EmailEditor = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [step, setStep] = useState<
    | "info"
    | "delete"
    | "delete-success"
    | "change"
    | "verify"
    | "update-success"
  >("info");

  const userInfo = useAtomValue(userInfoAtom);
  const queryClient = useAtomValue(queryClientAtom);
  const [isOpen, onOpenChange] = useAtom(isEmailEditorOpenAtom);

  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isDeletingEmail, setIsDeletingEmail] = useState(false);

  const form = useForm<z.infer<typeof EmailEditorSchema>>({
    resolver: zodResolver(EmailEditorSchema),
    defaultValues: {
      email: "",
    },
  });

  const updateEmail = async () => {
    setIsUpdatingEmail(true);

    try {
      await api.userControllerEditUser({
        email: form.getValues("email"),
      });

      if (step !== "update-success") {
        setStep("update-success");
      }

      queryClient.refetchQueries({
        queryKey: ["userInfo"],
      });
    } catch (error: any) {
      toast.error(error.response.data.error.message ?? "Error updating email");
    }

    setIsUpdatingEmail(false);
  };

  const deleteEmail = async () => {
    setIsDeletingEmail(true);

    try {
      await api.userControllerEditUser({
        deleteEmail: true,
      });

      if (step !== "delete-success") {
        setStep("delete-success");
      }

      queryClient.refetchQueries({
        queryKey: ["userInfo"],
      });
    } catch (error) {
      toast.error(
        (error as any)?.response?.data?.error?.message ?? "Error deleting email"
      );
    }

    setIsDeletingEmail(false);
  };

  useEffect(() => {
    if (isOpen) {
      form.reset({
        email: userInfo?.email ?? "",
      });

      if (userInfo?.email) {
        setStep("info");
      } else {
        setStep("change");
      }
    }
  }, [isOpen]);

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
              {step === "info" && (
                <Fragment>
                  <UserIcon className="h-10 w-10 text-_primary_" />

                  <PrimaryLabel className="mt-6 text-2xl text-_primary_">
                    {userInfo?.email ? "Your Email" : "Add Email"}
                  </PrimaryLabel>
                </Fragment>
              )}

              {step === "delete" && (
                <Fragment>
                  <TriangleAlertIcon className="h-10 w-10 text-_primary_" />

                  <PrimaryLabel className="mt-6 text-2xl text-_primary_">
                    Are you sure you want to delete your email?
                  </PrimaryLabel>
                </Fragment>
              )}

              {step === "delete-success" && (
                <Fragment>
                  <SuccessIcon className="h-10 w-10 text-success" />

                  <PrimaryLabel className="mt-6 text-2xl text-_primary_">
                    Email Deleted
                  </PrimaryLabel>
                </Fragment>
              )}

              {step === "change" && (
                <Fragment>
                  <MailIcon className="h-10 w-10 text-_primary_" />

                  <PrimaryLabel className="mt-6 text-2xl text-_primary_">
                    {userInfo?.email ? "Change Email" : "Add Email"}
                  </PrimaryLabel>
                </Fragment>
              )}

              {step === "verify" && (
                <Fragment>
                  <ShieldCheckIcon className="h-10 w-10 text-_primary_" />

                  <PrimaryLabel className="mt-6 text-2xl text-_primary_">
                    Verify Your Email
                  </PrimaryLabel>
                </Fragment>
              )}

              {step === "update-success" && (
                <Fragment>
                  <InboxIcon className="h-10 w-10 text-_primary_" />

                  <PrimaryLabel className="mt-6 text-2xl text-_primary_">
                    Check Your Inbox
                  </PrimaryLabel>
                </Fragment>
              )}
            </DialogTitle>
          </DialogHeader>

          <DialogDescription className="flex flex-col">
            {step === "info" && (
              <Fragment>
                <PrimaryLabel className="text-_secondary_">
                  {userInfo?.email}
                </PrimaryLabel>

                <SecondaryLabel className="mt-3 text-_secondary_">
                  {userInfo?.verified
                    ? "This email is verified and used to unify your activity on Royco."
                    : "This email is not verified. Please verify to join Royco Royalty."}
                </SecondaryLabel>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {userInfo?.email && (
                    <Button
                      size="fixed"
                      type="button"
                      onClick={() => setStep("change")}
                      variant="outline"
                    >
                      Change Email
                    </Button>
                  )}

                  {!userInfo?.email && (
                    <Button
                      size="fixed"
                      type="button"
                      onClick={() => setStep("change")}
                      variant="outline"
                      className="bg-_primary_ text-white"
                    >
                      Add Email
                    </Button>
                  )}

                  {userInfo?.email && !userInfo?.verified && (
                    <Button
                      size="fixed"
                      type="button"
                      onClick={() => setStep("verify")}
                      variant="outline"
                      className="bg-success text-white"
                    >
                      Verify Email
                    </Button>
                  )}

                  {userInfo?.email && (
                    <Button
                      size="fixed"
                      type="button"
                      onClick={() => setStep("delete")}
                      variant="outline"
                      className="bg-error text-white"
                    >
                      Delete Email
                    </Button>
                  )}

                  <Button
                    size="fixed"
                    type="button"
                    onClick={() => onOpenChange(false)}
                    variant="outline"
                    className="col-span-2"
                  >
                    Close
                  </Button>
                </div>
              </Fragment>
            )}

            {step === "delete" && (
              <Fragment>
                <SecondaryLabel className="mt-3 text-_secondary_">
                  Your email will be deleted immediately and you will lose all
                  your access to Royco Royalty. This action cannot be undone.
                </SecondaryLabel>

                <div className="mt-6 grid grid-cols-2 gap-3">
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
                    aria-disabled={isDeletingEmail}
                    size="fixed"
                    type="button"
                    disabled={isDeletingEmail}
                    onClick={deleteEmail}
                    variant="outline"
                    className="bg-error text-white"
                  >
                    {isDeletingEmail ? <LoadingCircle /> : "Yes, delete it."}
                  </Button>
                </div>
              </Fragment>
            )}

            {step === "delete-success" && (
              <Fragment>
                <SecondaryLabel className="mt-3 text-_secondary_">
                  Your email has been deleted and your access to Royco Royalty
                  has been revoked. Link a new email to re-gain the access.
                </SecondaryLabel>

                <div className="mt-6 grid grid-cols-1 gap-3">
                  <Button
                    size="fixed"
                    type="button"
                    onClick={() => onOpenChange(false)}
                    variant="outline"
                    className="bg-_primary_ text-white"
                  >
                    Close
                  </Button>
                </div>
              </Fragment>
            )}

            {step === "verify" && (
              <Fragment>
                <SecondaryLabel className="mt-3 text-_secondary_">
                  Click the below button to verify your email and join Royco
                  Royalty.
                </SecondaryLabel>

                <div className="mt-6 grid grid-cols-2 gap-3">
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
                    aria-disabled={isUpdatingEmail}
                    size="fixed"
                    disabled={isUpdatingEmail}
                    type="button"
                    onClick={updateEmail}
                    variant="outline"
                  >
                    {isUpdatingEmail ? <LoadingCircle /> : "Verify Email"}
                  </Button>
                </div>
              </Fragment>
            )}

            {step === "change" && (
              <div className="flex flex-col">
                <SecondaryLabel className="mt-3 text-_secondary_">
                  This email will grant you access to Royco Royalty and will be
                  used to unify your activity on Royco.
                </SecondaryLabel>

                <Input
                  {...form.register("email")}
                  containerClassName="mt-5 rounded-none"
                  type="email"
                  placeholder="you@email.com"
                  className="text-_primary_"
                />

                <div className="mt-6 grid grid-cols-2 gap-3">
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
                    aria-disabled={!form.formState.isValid || isUpdatingEmail}
                    disabled={!form.formState.isValid || isUpdatingEmail}
                    size="fixed"
                    type="button"
                    onClick={updateEmail}
                    variant="outline"
                    className="bg-_primary_ text-white"
                  >
                    {isUpdatingEmail ? (
                      <LoadingCircle />
                    ) : userInfo?.email ? (
                      "Change Email"
                    ) : (
                      "Add Email"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {step === "update-success" && (
              <div className="flex flex-col">
                <SecondaryLabel className="mt-3 text-_secondary_">
                  We have sent a magic link to {form.watch("email")}. Please
                  click the link to confirm your address. It might take a few
                  minutes for the mail to arrive.
                </SecondaryLabel>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button
                    size="fixed"
                    type="button"
                    onClick={() => onOpenChange(false)}
                    variant="outline"
                  >
                    Close
                  </Button>

                  <Button
                    aria-disabled={isUpdatingEmail}
                    size="fixed"
                    disabled={isUpdatingEmail}
                    type="button"
                    onClick={updateEmail}
                    variant="outline"
                    className="bg-_primary_ text-white"
                  >
                    {isUpdatingEmail ? <LoadingCircle /> : "Resend Link"}
                  </Button>
                </div>

                <SecondaryLabel className="mt-6 text-center italic text-_secondary_">
                  Please check your spam folder if you don't see the mail in
                  your inbox. The verification link will auto-expire in 24
                  hours.
                </SecondaryLabel>
              </div>
            )}
          </DialogDescription>
        </DialogContent>
      )}
    </Dialog>
  );
});

EmailEditor.displayName = "EmailEditor";
