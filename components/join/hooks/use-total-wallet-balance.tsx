"use client";

import { useQuery } from "@tanstack/react-query";

export const useTotalWalletBalance = ({ wallet }: { wallet: string }) => {
  return useQuery({
    queryKey: [
      "total-wallet-balance",
      {
        wallet,
      },
    ],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/balance?account_address=${wallet}`);
        const data = await res.json();

        let balance = parseFloat(data.balance);

        if (isNaN(balance)) {
          throw new Error("Invalid balance");
        }

        return balance;
      } catch (err) {
        console.error("Error in fetching balance", err);
        return 0;
      }
    },
  });
};
