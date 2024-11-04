export const RPC_API_KEYS: {
  [chain_id: number]: string;
} = {
  1: process.env.NEXT_PUBLIC_RPC_API_KEY_1!,
  11155111: process.env.NEXT_PUBLIC_RPC_API_KEY_11155111!,
  42161: process.env.NEXT_PUBLIC_RPC_API_KEY_42161!,
  421614: process.env.NEXT_PUBLIC_RPC_API_KEY_421614!,
  8453: process.env.NEXT_PUBLIC_RPC_API_KEY_8453!,
  84532: process.env.NEXT_PUBLIC_RPC_API_KEY_84532!,
};

export const ETHERSCAN_API_KEYS: {
  [chain_id: number]: string;
} = {
  1: `https://api.etherscan.io/api?apikey=${process.env.ETHERSCAN_API_KEY_1!}`,
  11155111: `https://api-sepolia.etherscan.io/api?apikey=${process.env.ETHERSCAN_API_KEY_1!}`,
  42161: `https://api.arbiscan.io/api?apikey=${process.env.ETHERSCAN_API_KEY_42161!}`,
  421614: `https://api-sepolia.arbiscan.io/api?apikey=${process.env.ETHERSCAN_API_KEY_421614!}`,
  8453: `https://api.basescan.org/api?apikey=${process.env.ETHERSCAN_API_KEY_8453!}`,
  84532: `https://api-sepolia.basescan.org/api?apikey=${process.env.ETHERSCAN_API_KEY_84532!}`,
};
