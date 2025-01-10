// "use client";

// import { z } from "zod";

// import { matcher } from "./matcher";
// import { isSolidityAddressValid } from "royco/utils";

// export const RoyaltyFormSchema = z.object({
//   email: z
//     .string()
//     .min(1, { message: "Email is required." })
//     .email("This is not a valid email."),
//   username: z
//     .string()
//     .min(3, { message: "Username must be at least 3 characters." })
//     .refine((value) => /^[a-zA-Z0-9_ ]+$/.test(value), {
//       message: "Username cannot contain special symbols.",
//     })
//     .refine((value) => !matcher.hasMatch(value), {
//       message: "Username contains offensive words.",
//     }),
//   telegram: z.string().optional(),
//   wallets: z.array(
//     z.object({
//       account_address: z
//         .string()
//         .min(1, { message: "Wallet is required." })
//         .refine(
//           (value) => {
//             return isSolidityAddressValid("address", value);
//           },
//           { message: "Invalid wallet address." }
//         ),
//       proof: z
//         .string()
//         .min(1, { message: "Proof of ownership is required." })
//         .refine((value) => value.trim().length > 0, {
//           message: "Proof of ownership is required.",
//         }),
//     })
//   ),
// });
