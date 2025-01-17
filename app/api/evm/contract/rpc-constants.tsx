export const RPC_API_KEYS: {
  [chain_id: number]: string;
} = {
  1: process.env.NEXT_PUBLIC_RPC_API_KEY_1!,
  11155111: process.env.NEXT_PUBLIC_RPC_API_KEY_11155111!,
  42161: process.env.NEXT_PUBLIC_RPC_API_KEY_42161!,
  8453: process.env.NEXT_PUBLIC_RPC_API_KEY_8453!,
  21000000: process.env.NEXT_PUBLIC_RPC_API_KEY_21000000!,
  98865: process.env.NEXT_PUBLIC_RPC_API_KEY_98865!,
  146: process.env.NEXT_PUBLIC_RPC_API_KEY_146!,
};

export const ETHERSCAN_API_KEYS: {
  [chain_id: number]: string;
} = {
  1: `https://api.etherscan.io/api?apikey=${process.env.ETHERSCAN_API_KEY_1!}`,
  11155111: `https://api-sepolia.etherscan.io/api?apikey=${process.env.ETHERSCAN_API_KEY_1!}`,
  42161: `https://api.arbiscan.io/api?apikey=${process.env.ETHERSCAN_API_KEY_42161!}`,
  8453: `https://api.basescan.org/api?apikey=${process.env.ETHERSCAN_API_KEY_8453!}`,
  21000000: `https://api.routescan.io/v2/network/mainnet/evm/21000000/etherscan/api?apikey=${process.env.ETHERSCAN_API_KEY_21000000!}`,
  98865: `https://phoenix-explorer.plumenetwork.xyz/api?apikey=${process.env.ETHERSCAN_API_KEY_98865!}`,
  146: `https://api.sonic.io/api?apikey=${process.env.ETHERSCAN_API_KEY_146!}`,
};
