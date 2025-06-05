import { Input } from "@/components/ui/input";
import { userInfoAtom } from "@/store/global";
import { useAtom, useAtomValue } from "jotai";
import { cn } from "@/lib/utils";
import React, { Fragment, useEffect, useState } from "react";
import { useAccount } from "wagmi";
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
  CheckCircleIcon,
  InboxIcon,
  InfoIcon,
  MailIcon,
  MailWarningIcon,
  ShieldCheckIcon,
  TriangleAlert,
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
  React.HTMLAttributes<HTMLDivElement> & {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
  }
>(({ className, isOpen, onOpenChange, ...props }, ref) => {
  const userInfo = useAtomValue(userInfoAtom);

  const queryClient = useAtomValue(queryClientAtom);

  const [step, setStep] = useState<
    | "info"
    | "delete"
    | "change"
    | "verify-email"
    | "delete-success"
    | "change-success"
    | "check-inbox"
  >("info");

  const form = useForm<z.infer<typeof EmailEditorSchema>>({
    resolver: zodResolver(EmailEditorSchema),
    defaultValues: {
      email: userInfo?.email ?? "",
    },
  });

  const [isSendingVerificationLink, setIsSendingVerificationLink] =
    useState(false);
  const [isDeletingEmail, setIsDeletingEmail] = useState(false);

  const sendVerificationLink = async () => {
    setIsSendingVerificationLink(true);

    try {
      await api.userControllerEditUser({
        email: form.getValues("email"),
      });

      if (step !== "check-inbox") {
        setStep("check-inbox");
      }
    } catch (error: any) {
      toast.error(
        error.response.data.error.message ?? "Error sending verification link"
      );
    }

    setIsSendingVerificationLink(false);
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
    } catch (error: any) {
      toast.error(error.response.data.error.message ?? "Error deleting email");
    }

    setIsDeletingEmail(false);
  };

  useEffect(() => {
    if (isOpen) {
      if (userInfo?.email) {
        if (userInfo?.verified) {
          setStep("info");
        } else {
          setStep("verify-email");
        }
      } else {
        setStep("change");
      }

      form.reset({
        email: userInfo?.email ?? "",
      });
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
                    Your Email
                  </PrimaryLabel>
                </Fragment>
              )}

              {step === "verify-email" && (
                <Fragment>
                  <ShieldCheckIcon className="h-10 w-10 text-_primary_" />

                  <PrimaryLabel className="mt-6 text-2xl text-_primary_">
                    Verify Your Email
                  </PrimaryLabel>
                </Fragment>
              )}

              {step === "delete" && (
                <Fragment>
                  <TriangleAlert className="h-10 w-10 text-_primary_" />

                  <PrimaryLabel className="mt-6 text-2xl text-_primary_">
                    Are you sure you want to delete your email?
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

              {step === "check-inbox" && (
                <Fragment>
                  <InboxIcon className="h-10 w-10 text-_primary_" />

                  <PrimaryLabel className="mt-6 text-2xl text-_primary_">
                    Check Your Inbox
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
            </DialogTitle>
          </DialogHeader>

          <DialogDescription>
            {step === "info" && (
              <div className="flex flex-col">
                <PrimaryLabel className="text-_secondary_">
                  {userInfo?.email}
                </PrimaryLabel>

                <SecondaryLabel className="mt-3 text-_secondary_">
                  This email is verified and used to unify your activity on
                  Royco.
                </SecondaryLabel>

                <div className="mt-6 flex flex-row items-center justify-between gap-3">
                  <Button
                    size="fixed"
                    type="button"
                    onClick={() => setStep("change")}
                    variant="outline"
                    className="w-full"
                  >
                    Change Email
                  </Button>

                  <Button
                    size="fixed"
                    type="button"
                    disabled={isDeletingEmail}
                    onClick={deleteEmail}
                    variant="outline"
                    className={cn(
                      "w-full bg-error text-white",
                      isDeletingEmail && "cursor-not-allowed"
                    )}
                  >
                    {isDeletingEmail ? <LoadingCircle /> : "Delete Email"}
                  </Button>
                </div>
              </div>
            )}

            {step === "verify-email" && (
              <div className="flex flex-col">
                <SecondaryLabel className="mt-3 text-_secondary_">
                  Click the below button to verify your email and join Royco
                  Royalty.
                </SecondaryLabel>

                <div className="mt-6 flex flex-row items-center justify-between gap-3">
                  <Button
                    size="fixed"
                    disabled={isSendingVerificationLink}
                    type="button"
                    onClick={sendVerificationLink}
                    variant="outline"
                    className={cn(
                      "w-full",
                      isSendingVerificationLink && "cursor-not-allowed"
                    )}
                  >
                    {isSendingVerificationLink ? (
                      <LoadingCircle />
                    ) : (
                      "Verify Email"
                    )}
                  </Button>

                  <Button
                    size="fixed"
                    type="button"
                    onClick={() => setStep("delete")}
                    variant="outline"
                    className={cn(
                      "w-full bg-error text-white",
                      isDeletingEmail && "cursor-not-allowed"
                    )}
                  >
                    Delete Email
                  </Button>
                </div>
              </div>
            )}

            {step === "delete" && (
              <div className="flex flex-col">
                <SecondaryLabel className="mt-3 text-_secondary_">
                  Your email will be deleted immediately and you will lose all
                  your access to Royco Royalty. You can't undo this action.
                </SecondaryLabel>

                <div className="mt-6 flex flex-row items-center justify-between gap-3">
                  <Button
                    size="fixed"
                    type="button"
                    onClick={() => setStep("info")}
                    variant="outline"
                    className="w-full"
                  >
                    Cancel
                  </Button>

                  <Button
                    size="fixed"
                    type="button"
                    disabled={isDeletingEmail}
                    onClick={deleteEmail}
                    variant="outline"
                    className={cn(
                      "w-full bg-error text-white",
                      isDeletingEmail && "cursor-not-allowed"
                    )}
                  >
                    {isDeletingEmail ? <LoadingCircle /> : "Yes, delete it."}
                  </Button>
                </div>
              </div>
            )}

            {step === "delete-success" && (
              <div className="flex flex-col">
                <SecondaryLabel className="mt-3 text-_secondary_">
                  Your email has been deleted and your access to Royco Royalty
                  has been revoked. Link a new email to re-gain the access.
                </SecondaryLabel>

                <div className="mt-6 flex flex-row items-center justify-between gap-3">
                  <Button
                    size="fixed"
                    type="button"
                    onClick={() => onOpenChange(false)}
                    variant="outline"
                    className="w-full bg-_primary_ text-white"
                  >
                    Close
                  </Button>
                </div>
              </div>
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
                  placeholder="you@gmail.com"
                  className="text-_primary_"
                />

                <div className="mt-6 flex flex-row items-center justify-between gap-3">
                  <Button
                    disabled={
                      !form.formState.isValid || isSendingVerificationLink
                    }
                    size="fixed"
                    type="button"
                    onClick={sendVerificationLink}
                    variant="outline"
                    className={cn(
                      "w-full bg-_primary_ text-white",
                      !form.formState.isValid || isSendingVerificationLink
                        ? "cursor-not-allowed"
                        : ""
                    )}
                  >
                    {isSendingVerificationLink ? <LoadingCircle /> : "Confirm"}
                  </Button>
                </div>
              </div>
            )}

            {step === "check-inbox" && (
              <div className="flex flex-col">
                <SecondaryLabel className="mt-3 text-_secondary_">
                  We sent a magic link to {form.watch("email")}. Please click
                  the link to confirm your address. Note that mail might take a
                  few mins to arrive.
                </SecondaryLabel>

                <div className="mt-6 flex flex-row items-center justify-between gap-3">
                  <Button
                    size="fixed"
                    disabled={isSendingVerificationLink}
                    type="button"
                    onClick={sendVerificationLink}
                    variant="outline"
                    className={cn(
                      "w-full",
                      isSendingVerificationLink && "cursor-not-allowed"
                    )}
                  >
                    {isSendingVerificationLink ? (
                      <LoadingCircle />
                    ) : (
                      "Resend Link"
                    )}
                  </Button>

                  <Button
                    size="fixed"
                    type="button"
                    onClick={() => onOpenChange(false)}
                    variant="outline"
                    className={cn("w-full bg-_primary_ text-white")}
                  >
                    Close
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
