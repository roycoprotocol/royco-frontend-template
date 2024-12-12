import { getDefaultConfig } from "@rainbow-me/rainbowkit";
// import { cookieStorage, createStorage, http } from "wagmi";

import {
  EthereumSepolia,
  EthereumMainnet,
  ArbitrumOne,
  Base,
  Corn,
  Plume,
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
    ...(process.env.NEXT_PUBLIC_FRONTEND_TYPE === "TESTNET"
      ? [EthereumSepolia]
      : []),
  ],
  ssr: true,
  // storage: createStorage({
  //   storage:
  //     typeof window !== "undefined" ? window.localStorage : cookieStorage,
  // }),
  batch: {
    multicall: true,
  },
});
