"use client";

import { useQuery } from "@tanstack/react-query";
import validator from "validator";

export type GetEmailStatusQueryParams = {
  email?: string | null;
};

export type UseEmailStatusParams = GetEmailStatusQueryParams;

export const getEmailStatusQueryFunction = async ({
  email,
}: GetEmailStatusQueryParams) => {
  if (!email) {
    throw new Error("Email is required");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Invalid email address");
  }

  const res = await fetch(`/api/users/email/status?email=${email}`);
  const data = await res.json();

  if (data.status === "success") {
    return true;
  }

  return false;
};

export const useEmailStatus = ({ email }: UseEmailStatusParams) => {
  return useQuery({
    queryKey: ["email-status", { email }],
    queryFn: () => getEmailStatusQueryFunction({ email }),
  });
};
