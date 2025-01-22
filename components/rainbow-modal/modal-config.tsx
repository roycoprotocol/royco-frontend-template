import { getDefaultConfig } from "@rainbow-me/rainbowkit";
// import { cookieStorage, createStorage, http } from "wagmi";
import { fallback, http } from "wagmi";
import { unstable_connector } from "wagmi";
import { injected } from "wagmi/connectors";

import {
  EthereumSepolia,
  EthereumMainnet,
  ArbitrumOne,
  Base,
  Corn,
  Plume,
  Sonic,
} from "royco/constants";

export const metadata = {
  name: "Royco",
  description:
    "Royco is a marketplace for exclusive incentives from the best projects.",
  // url: "http://localhost:3000", // origin must match your domain & subdomain
  url: process.env.NEXT_PUBLIC_APP_URL, // origin must match your domain & subdomain
  icons: ["/icon.png"],
};

export const config = getDefaultConfig({
  appName: "Royco",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  chains: [
    EthereumMainnet,
    ArbitrumOne,
    Base,
    Corn,
    Plume,
    EthereumSepolia,
    Sonic,
  ],
  ssr: true,
  multiInjectedProviderDiscovery: true,
  transports: {
    [EthereumMainnet.id]: fallback([
      unstable_connector(injected),
      http(process.env.NEXT_PUBLIC_RPC_API_KEY_1!),
      http(),
    ]),
    [ArbitrumOne.id]: fallback([
      unstable_connector(injected),
      http(process.env.NEXT_PUBLIC_RPC_API_KEY_42161!),
      http(),
    ]),
    [Base.id]: fallback([
      unstable_connector(injected),
      http(process.env.NEXT_PUBLIC_RPC_API_KEY_8453!),
      http(),
    ]),
    [Corn.id]: fallback([
      unstable_connector(injected),
      http(process.env.NEXT_PUBLIC_RPC_API_KEY_21000000!),
      http(),
    ]),
    [Plume.id]: fallback([
      unstable_connector(injected),
      http(process.env.NEXT_PUBLIC_RPC_API_KEY_98865!),
      http(),
    ]),
    [EthereumSepolia.id]: fallback([
      unstable_connector(injected),
      http(process.env.NEXT_PUBLIC_RPC_API_KEY_11155111!),
      http(),
    ]),
    [Sonic.id]: fallback([
      unstable_connector(injected),
      http(process.env.NEXT_PUBLIC_RPC_API_KEY_146!),
      http(),
    ]),
  },
  batch: {
    multicall: true,
  },
});
