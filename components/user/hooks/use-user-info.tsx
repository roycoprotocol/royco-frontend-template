"use client";

import { useQuery } from "@tanstack/react-query";
import { eq } from "lodash";
import { isSolidityAddressValid } from "royco/utils";
import { useLocalStorage } from "usehooks-ts";
import { isWalletValid } from "../validators";
import { useAccount } from "wagmi";

export type TypedUserInfo = {
  username: string;
  email: string;
  wallets: string[];
  created_at: string;
};

export type UserInfo = TypedUserInfo | null;

export const getUserInfoQueryFunction = async ({
  proof,
  account_address,
}: {
  proof?: string | null;
  account_address?: string | null;
}) => {
  const res = await fetch(
    `/api/users/info?proof=${proof}&account_address=${account_address}`
  );

  const data = await res.json();

  if (!res.ok) {
    const message = data.message || "Failed to fetch user info";
    throw new Error(message);
  }

  return data as TypedUserInfo;
};

export const useUserInfo = ({
  proof,
  account_address,
}: {
  proof?: string | null;
  account_address?: string | null;
}) => {
  return useQuery({
    queryKey: [
      "user-info",
      {
        proof,
        account_address,
      },
    ],
    queryFn: () =>
      getUserInfoQueryFunction({
        proof,
        account_address,
      }),
    enabled: Boolean(proof && account_address),
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 1, // 1 minute
  });
};
