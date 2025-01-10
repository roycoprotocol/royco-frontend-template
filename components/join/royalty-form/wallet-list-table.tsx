// "use client";

// import { cn } from "@/lib/utils";
// import React, { useEffect, useState } from "react";
// import { RoyaltyFormSchema } from "./royality-form-schema";
// import { z } from "zod";
// import { UseFormReturn } from "react-hook-form";
// import { useTotalWalletBalance, useTotalWalletsBalance } from "../hooks";
// import { SpringNumber } from "@/components/composables";
// import { shortAddress } from "royco/utils";
// import { useImmer } from "use-immer";
// import { isEqual } from "lodash";
// import { produce } from "immer";

// export const WalletListTabRowContainer = React.forwardRef<
//   HTMLDivElement,
//   React.HTMLAttributes<HTMLDivElement>
// >(({ className, ...props }, ref) => {
//   return (
//     <div
//       ref={ref}
//       {...props}
//       className={cn(
//         "flex flex-row items-center justify-between text-sm font-normal text-black",
//         className
//       )}
//     />
//   );
// });

// export const WalletListTableRow = React.forwardRef<
//   HTMLDivElement,
//   React.HTMLAttributes<HTMLDivElement> & {
//     wallet: z.infer<typeof RoyaltyFormSchema>["wallets"][number];
//   }
// >(({ className, wallet, ...props }, ref) => {
//   const { data: totalWalletBalance } = useTotalWalletBalance({
//     wallet: wallet.account_address,
//   });

//   return (
//     <WalletListTabRowContainer>
//       <div>{shortAddress(wallet.account_address)}</div>

//       <div>
//         <SpringNumber
//           previousValue={0}
//           currentValue={totalWalletBalance ?? 0}
//           numberFormatOptions={{
//             style: "currency",
//             currency: "USD",
//             useGrouping: true,
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2,
//           }}
//         />
//       </div>
//     </WalletListTabRowContainer>
//   );
// });

// export const WalletListTable = React.forwardRef<
//   HTMLDivElement,
//   React.HTMLAttributes<HTMLDivElement> & {
//     royaltyForm: UseFormReturn<z.infer<typeof RoyaltyFormSchema>>;
//   }
// >(({ className, royaltyForm, ...props }, ref) => {
//   const propsTotalWalletsBalance = useTotalWalletsBalance({
//     wallets: royaltyForm
//       .watch("wallets")
//       .filter((wallet) => wallet.proof.length > 0)
//       .map((wallet) => wallet.account_address.toLowerCase()),
//   });

//   const [placeholderTotalWalletsBalance, setPlaceholderTotalWalletsBalance] =
//     useImmer<Array<number | null | undefined>>([null, null]);

//   useEffect(() => {
//     if (
//       propsTotalWalletsBalance.isLoading === false &&
//       propsTotalWalletsBalance.isRefetching === false &&
//       !isEqual(propsTotalWalletsBalance.data, placeholderTotalWalletsBalance[1])
//     ) {
//       setPlaceholderTotalWalletsBalance((prevDatas) => {
//         return produce(prevDatas, (draft) => {
//           // Prevent overwriting previous data with the same object reference
//           if (!isEqual(draft[1], propsTotalWalletsBalance.data)) {
//             draft[0] = draft[1] as typeof propsTotalWalletsBalance.data; // Set previous data to the current data
//             draft[1] =
//               propsTotalWalletsBalance.data as typeof propsTotalWalletsBalance.data; // Set current data to the new data
//           }
//         });
//       });
//     }
//   }, [
//     propsTotalWalletsBalance.isLoading,
//     propsTotalWalletsBalance.isRefetching,
//     propsTotalWalletsBalance.data,
//   ]);

//   return (
//     <div ref={ref} {...props} className={cn("flex flex-col gap-2", className)}>
//       {royaltyForm
//         .watch("wallets")
//         .filter((wallet) => wallet.proof.length > 0)
//         .map((wallet) => {
//           return (
//             <WalletListTableRow
//               key={`join:wallet:${wallet.account_address}`}
//               wallet={wallet}
//             />
//           );
//         })}

//       <div className="h-px w-full bg-divider" />

//       <WalletListTabRowContainer>
//         <div>Total Assets</div>

//         <div>
//           <SpringNumber
//             previousValue={placeholderTotalWalletsBalance[0] ?? 0}
//             currentValue={placeholderTotalWalletsBalance[1] ?? 0}
//             numberFormatOptions={{
//               style: "currency",
//               currency: "USD",
//               useGrouping: true,
//               minimumFractionDigits: 2,
//               maximumFractionDigits: 2,
//             }}
//           />
//         </div>
//       </WalletListTabRowContainer>
//     </div>
//   );
// });
