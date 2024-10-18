import { mainnet, sepolia } from "viem/chains";
import { http, createConfig } from "@wagmi/core";

export const baseWagmiClient = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
