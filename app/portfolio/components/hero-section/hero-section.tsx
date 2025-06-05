"use client";

import React, { Fragment, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { PrimaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { useAccount } from "wagmi";
import { CrownIcon } from "@/assets/icons/crown";
import { NULL_ADDRESS } from "royco/constants";
import Avatar from "boring-avatars";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  hasRoyaltyAccessAtom,
  sessionAtom,
  showUserInfoAtom,
  userInfoAtom,
} from "@/store/global";
import { GradientText } from "@/app/vault/common/gradient-text";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/api/royco";
import { EditUserBody, UserInfo } from "royco/api";
import { Button } from "@/components/ui/button";
import { queryClientAtom } from "jotai-tanstack-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { NULL_USER_ID } from "@/constants";

export const UsernameFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Username is required" })
    .max(50, "Username must be less than 50 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Username must contain only letters and numbers"),
});

export const HeroSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { isConnected, address } = useAccount();
  const showUserInfo = useAtomValue(showUserInfoAtom);

  const [session, setSession] = useAtom(sessionAtom);
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const [queryClient] = useAtom(queryClientAtom);

  const form = useForm<z.infer<typeof UsernameFormSchema>>({
    resolver: zodResolver(UsernameFormSchema),
    defaultValues: {
      name: userInfo?.name ?? "roycoRanger",
    },
  });

  const [isEditing, setIsEditing] = useState(false);

  const { mutate } = useMutation({
    mutationKey: ["userInfo"],
    mutationFn: async (editUserBody: EditUserBody) => {
      const response = await api.userControllerEditUser(editUserBody);
      return response.data;
    },
    onMutate: async (editUserBody) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: ["userInfo"] });

      // Get previous data
      const previousUserInfo = queryClient.getQueryData<UserInfo>(["userInfo"]);
      if (!previousUserInfo) throw new Error("No previous user info found");

      // Optimistically update data
      queryClient.setQueryData(["userInfo"], (old: UserInfo | undefined) => {
        if (!old) return previousUserInfo;
        return {
          ...old,
          ...editUserBody,
        };
      });

      return { previousUserInfo };
    },
    onError: (
      error: any,
      variables,
      context: { previousUserInfo: UserInfo } | undefined
    ) => {
      const errorMessage =
        error.response?.data?.error?.message ?? "Update failed";
      toast.error(errorMessage);

      if (context?.previousUserInfo) {
        form.setValue("name", context.previousUserInfo.name);
      } else {
        form.setValue("name", "roycoRanger");
      }
    },
    onSettled: (data, error, variables, context) => {
      queryClient.refetchQueries({
        queryKey: ["userInfo"],
      });
    },
  });

  const onSubmit = (data: z.infer<typeof UsernameFormSchema>) => {
    mutate({ name: data.name });
  };

  const hasRoyaltyAccess = useAtomValue(hasRoyaltyAccessAtom);

  useEffect(() => {
    if (showUserInfo) {
      if (!isEditing && form.watch("name") !== userInfo?.name) {
        form.setValue("name", userInfo?.name ?? "roycoRanger");
      }
    } else {
      form.setValue("name", "roycoRanger");
    }
  }, [isEditing, userInfo, showUserInfo]);

  return (
    <div
      ref={ref}
      {...props}
      className={cn("flex flex-col items-center", className)}
    >
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-_surface_tertiary">
        <Avatar
          size={96}
          name={showUserInfo ? (userInfo?.id ?? NULL_ADDRESS) : NULL_ADDRESS}
          variant="beam"
          colors={["#DA913E", "#101010", "#D4C5B4", "#B6B3AD", "#83715C"]}
        />

        <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-_surface_">
          <CrownIcon className="h-6 w-6" />
        </div>
      </div>

      <Form {...form}>
        <form className="contents" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="relative mt-6 flex w-fit px-2">
            <div className="pointer-events-none w-fit select-none font-shippori text-3xl font-medium leading-relaxed text-transparent">
              {"."}
              {form.watch("name")}
            </div>

            <input
              disabled={!hasRoyaltyAccess}
              onFocus={() => setIsEditing(true)}
              ref={inputRef}
              type="text"
              value={form.watch("name")}
              pattern="[a-zA-Z0-9]*"
              onChange={(e) => {
                const value = e.target.value.trim();

                if (value.length === 0) {
                  toast.error("Username cannot be empty");
                  form.setValue("name", "");
                } else if (value && /^[a-zA-Z0-9]*$/.test(value)) {
                  form.setValue("name", value);
                } else {
                  toast.error("Username must contain only letters and numbers");
                }
              }}
              className={cn(
                "absolute inset-0 border-b border-b-transparent bg-transparent pl-3 font-shippori text-3xl font-medium leading-relaxed text-_primary_ outline-none transition-colors",
                isEditing && "border-b-_primary_",
                form.watch("name").length === 0 && "border-b"
              )}
            />
          </div>

          <div className="mt-2 flex flex-row items-center gap-3">
            {!showUserInfo && <GradientText>Wallet not connected</GradientText>}

            {showUserInfo && !hasRoyaltyAccess && (
              <GradientText>
                Add verified email to gain Royco Royalty access
              </GradientText>
            )}

            {hasRoyaltyAccess && showUserInfo && !isEditing && (
              <Button
                variant="transparent"
                onClick={() => inputRef.current?.focus()}
              >
                <GradientText>Edit Nickname</GradientText>
              </Button>
            )}

            {hasRoyaltyAccess && showUserInfo && isEditing && (
              <Fragment>
                <Button
                  type="submit"
                  disabled={
                    form.watch("name").length === 0 ||
                    form.watch("name") === userInfo?.name
                  }
                  variant="transparent"
                  onClick={() => {
                    mutate({ name: form.watch("name") });
                    setIsEditing(false);
                    inputRef.current?.blur();
                  }}
                  className={cn(
                    (form.watch("name").length === 0 ||
                      form.watch("name") === userInfo?.name) &&
                      "cursor-not-allowed",
                    "hover:bg-gray-100 active:bg-gray-200"
                  )}
                >
                  <GradientText>Save</GradientText>
                </Button>

                <div className="h-5 w-px bg-_divider_" />

                <Button
                  variant="transparent"
                  onClick={() => setIsEditing(false)}
                  className={cn("")}
                >
                  <GradientText>Cancel</GradientText>
                </Button>
              </Fragment>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
});
