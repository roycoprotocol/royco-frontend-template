"use client";

import { useQuery } from "@tanstack/react-query";

export type TypedUserInfo = {
  username: string;
  email: string;
  wallets: string[];
  created_at: string;
};

export type UserInfo = TypedUserInfo | null;

export const getUserInfoQueryFunction = async ({
  sign_in_token,
  account_address,
}: {
  sign_in_token?: string | null;
  account_address?: string | null;
}) => {
  const res = await fetch(
    `/api/users/info?sign_in_token=${sign_in_token}&account_address=${account_address}`
  );

  const data = await res.json();

  if (!res.ok) {
    const message = data.message || "Failed to fetch user info";
    throw new Error(message);
  }

  return data as TypedUserInfo;
};

export const useUserInfo = ({
  sign_in_token,
  account_address,
}: {
  sign_in_token?: string | null;
  account_address?: string | null;
}) => {
  return useQuery({
    queryKey: [
      "user-info",
      {
        sign_in_token,
        account_address,
      },
    ],
    queryFn: () =>
      getUserInfoQueryFunction({
        sign_in_token,
        account_address,
      }),
    enabled: Boolean(sign_in_token && account_address),
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 1, // 1 minute
  });
};
