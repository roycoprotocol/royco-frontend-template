import { useQuery } from "@tanstack/react-query";
import { eq } from "lodash";
import { isSolidityAddressValid } from "royco/utils";
import { isCachedWalletValid } from "../wallet-cacher";

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
  account_address?: string;
  proof?: string;
}) => {
  if (!account_address) {
    throw new Error("Wallet address not provided");
  }

  if (!isSolidityAddressValid("address", account_address)) {
    throw new Error("Invalid wallet address");
  }

  if (!proof) {
    throw new Error("Ownership proof not provided");
  }

  if (typeof proof !== "string") {
    throw new Error("Invalid ownership proof");
  }

  const isOwnershipProofValid = await isCachedWalletValid({
    account_address,
    proof,
  });

  if (!isOwnershipProofValid) {
    throw new Error("Mismatch between wallet address and ownership proof");
  }

  const res = await fetch(
    `/api/users/info?account_address=${account_address}&proof=${proof}`
  );

  const data = await res.json();

  if (res.status !== 200) {
    const message = data.message || "Failed to fetch user info";
    throw new Error(message);
  }

  return data as TypedUserInfo;
};

export const useUserInfo = ({
  account_address,
  proof,
}: {
  account_address?: string;
  proof?: string;
}) => {
  return useQuery({
    queryKey: [
      "user",
      {
        account_address,
        proof,
      },
    ],
    queryFn: () => getUserInfoQueryFunction({ account_address, proof }),
    refetchOnWindowFocus: false,
  });
};
