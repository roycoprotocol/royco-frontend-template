import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "./_components";
import "@rainbow-me/rainbowkit/styles.css";

import { Toaster } from "react-hot-toast";

/**
 * @description Imports for web3 modal
 * @see {@link https://docs.walletconnect.com/web3modal/nextjs/about}
 */
import { headers } from "next/headers";
import { TooltipProvider } from "@/components/ui/tooltip";

import { RoycoProvider } from "royco";
import { BrowserDetector, GeoDetector } from "@/store/use-general-stats";
import { RoycoClientProvider } from "./royco-client-provider";
import RainbowKitProvider from "@/components/rainbow-modal/context-provider";
import WalletProvider from "@/components/rainbow-modal/context-provider";

/**
 * @description Inter Font
 */
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

/**
 * @description GT Font
 */
const gt = Inter({ subsets: ["latin"], variable: "--font-gt" });
// const gt = localFont({
//   src: [
//     {
//       path: "../public/fonts/GT-America-Standard-Ultra-Light-Trial.otf",
//       weight: "200",
//       style: "extralight",
//     },
//     {
//       path: "../public/fonts/GT-America-Standard-Light-Trial.otf",
//       weight: "300",
//       style: "light",
//     },
//     {
//       path: "../public/fonts/GT-America-Standard-Regular-Trial.otf",
//       weight: "400",
//       style: "normal",
//     },
//     {
//       path: "../public/fonts/GT-America-Standard-Medium-Trial.otf",
//       weight: "500",
//       style: "medium",
//     },
//     {
//       path: "../public/fonts/GT-America-Standard-Bold-Trial.otf",
//       weight: "700",
//       style: "bold",
//     },
//   ],
//   display: "swap",
//   variable: "--font-gt",
// });

/**
 * @description Ortica Font
 */
const ortica = localFont({
  src: [
    {
      path: "../public/fonts/OrticaLinear-Light.woff2",
      weight: "300",
      style: "light",
    },
  ],
  display: "swap",
  variable: "--font-ortica",
});

/**
 * @description Morion Font
 */
const morion = localFont({
  src: [
    {
      path: "../public/fonts/Morion-Bold.ttf",
      weight: "700",
      style: "bold",
    },
  ],
  display: "swap",
  variable: "--font-morion",
});

export type FrontendTag =
  | "ethereum"
  | "base"
  | "arbitrum"
  | "plume"
  | "corn"
  | "testnet"
  | "default"
  | "boyco"
  | "dev"
  | "internal";

export const findFrontendTag = (url: string) => {
  let frontendTag = "default";

  if (url.includes("ethereum")) {
    frontendTag = "ethereum";
  } else if (url.includes("base")) {
    frontendTag = "base";
  } else if (url.includes("arbitrum")) {
    frontendTag = "arbitrum";
  } else if (url.includes("plume")) {
    frontendTag = "plume";
  } else if (url.includes("corn")) {
    frontendTag = "corn";
  } else if (url.includes("internal")) {
    frontendTag = "internal";
  } else if (url.includes("testnet") || url.includes("sepolia")) {
    frontendTag = "testnet";
  } else if (url.includes("boyco")) {
    frontendTag = "boyco";
  } else if (url.includes("local")) {
    frontendTag = "dev";
  }

  return frontendTag as FrontendTag;
};

export const getFrontendTagServer = () => {
  const headersList = headers();
  const url = headersList.get("host") || "";
  return findFrontendTag(url);
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get the host from headers
  const headersList = headers();
  const host = headersList.get("host") || "";

  // Determine network tag based on URL
  const frontendTag = findFrontendTag(host);

  /**
   * @description Fetch the previously stored state of web3 modal
   */
  const cookies = headers().get("cookie");

  return (
    // <RoycoProvider
    //   originUrl={process.env.NEXT_PUBLIC_SUPABASE_URL!}
    //   originKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}
    // >

    <RoycoClientProvider>
      <TooltipProvider delayDuration={0}>
        <html lang="en">
          <body
            frontend-tag={frontendTag}
            suppressHydrationWarning
            className={cn(
              inter.variable,
              gt.variable,
              morion.variable,
              ortica.variable,
              "hide-scrollbar overflow-x-hidden scroll-smooth font-gt",
              "bg-white"
            )}
          >
            {/* <AppKitProvider cookies={cookies}> */}
            <WalletProvider>
              <GeoDetector />

              <Navbar />
              {children}
            </WalletProvider>
            {/* </AppKitProvider> */}

            <BrowserDetector />

            <Toaster />
          </body>
        </html>
      </TooltipProvider>
    </RoycoClientProvider>

    // </RoycoProvider>
  );
}
