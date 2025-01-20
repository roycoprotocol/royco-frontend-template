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
  account_address,
  proof,
}: {
  account_address?: string | null;
  proof?: string | null;
}) => {
  const res = await fetch(
    `/api/users/info?account_address=${account_address}&proof=${proof}`
  );

  const data = await res.json();

  if (!res.ok) {
    const message = data.message || "Failed to fetch user info";
    throw new Error(message);
  }

  return data as TypedUserInfo;
};

export const useUserInfo = ({
  account_address,
  proof,
}: {
  account_address?: string | null;
  proof?: string | null;
}) => {
  return useQuery({
    queryKey: [
      "user-info",
      {
        account_address: account_address?.toLowerCase(),
        proof,
      },
    ],
    queryFn: () =>
      getUserInfoQueryFunction({
        account_address: account_address?.toLowerCase(),
        proof,
      }),
    enabled: Boolean(account_address && proof),
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 1, // 1 minute
  });
};
