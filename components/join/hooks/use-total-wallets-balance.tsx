"use client";

import { useQuery } from "@tanstack/react-query";

export const useTotalWalletsBalance = ({ wallets }: { wallets: string[] }) => {
  return useQuery({
    queryKey: [
      "total-wallets-balance",
      {
        wallets,
      },
    ],
    queryFn: async () => {
      try {
        const balances = await Promise.all(
          wallets.map(async (wallet, index) => {
            const res = await fetch(
              `/api/users/balance?account_address=${wallet}`
            );
            const data = await res.json();

            let balance = parseFloat(data.balance);

            if (isNaN(balance)) {
              balance = 0;
            }

            return {
              account_address: wallet.toLowerCase(),
              balance: balance,
            };
          })
        );

        return balances;
      } catch (err) {
        console.error("Error in fetching balance", err);
        return [];
      }
    },
  });
};
