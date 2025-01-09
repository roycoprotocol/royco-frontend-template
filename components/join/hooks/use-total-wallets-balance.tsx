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
        let balances = wallets.map((wallet) => {
          return 0;
        });

        await Promise.all(
          wallets.map(async (wallet, index) => {
            const res = await fetch(
              `/api/users/balance?account_address=${wallet}`
            );
            const data = await res.json();

            let balance = parseFloat(data.balance);

            if (isNaN(balance)) {
              balances[index] = 0;
            } else {
              balances[index] = balance;
            }
          })
        );

        let balance = balances.reduce((acc, curr) => {
          return acc + curr;
        }, 0);

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
