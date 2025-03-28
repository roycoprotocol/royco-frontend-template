import { cn } from "@/lib/utils";

export const MAX_SCREEN_WIDTH = cn("max-w-[1600px]");

export const RPC_API_KEYS: {
  [chain_id: number]: string;
} = {
  1: process.env.NEXT_PUBLIC_RPC_API_KEY_1!,
  11155111: process.env.NEXT_PUBLIC_RPC_API_KEY_11155111!,
  42161: process.env.NEXT_PUBLIC_RPC_API_KEY_42161!,
  421614: process.env.NEXT_PUBLIC_RPC_API_KEY_421614!,
  8453: process.env.NEXT_PUBLIC_RPC_API_KEY_8453!,
  84532: process.env.NEXT_PUBLIC_RPC_API_KEY_84532!,
  146: process.env.NEXT_PUBLIC_RPC_API_KEY_146!,
  98866: process.env.NEXT_PUBLIC_RPC_API_KEY_98866!,
  999: process.env.NEXT_PUBLIC_RPC_API_KEY_999!,
};

export const OwnershipProofMessage =
  "This is the message to verify your ownership status of the wallet address. No assets will leave your wallet.";
