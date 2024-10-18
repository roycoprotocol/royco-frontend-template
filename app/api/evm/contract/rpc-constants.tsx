export const RPC_API_KEYS: {
  [chain_id: number]: string;
} = {
  1: process.env.RPC_API_KEY_1!,
  11155111: process.env.RPC_API_KEY_11155111!,
  42161: process.env.RPC_API_KEY_42161!,
  421614: process.env.RPC_API_KEY_421614!,
};

export const ETHERSCAN_API_KEYS: {
  [chain_id: number]: string;
} = {
  1: `https://api.etherscan.io/api?apikey=${process.env.ETHERSCAN_API_KEY_1!}`,
  11155111: `https://api-sepolia.etherscan.io/api?apikey=${process.env.ETHERSCAN_API_KEY_1!}`,
  42161: `https://api.arbiscan.io/api?apikey=${process.env.ETHERSCAN_API_KEY_42161!}`,
  421614: `https://api-sepolia.arbiscan.io/api?apikey=${process.env.ETHERSCAN_API_KEY_421614!}`,
};
