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
import { TurnstileWrapper } from "@/auth";
import { Toaster as ToasterSonner } from "@/components/ui/sonner";
import { UserInfoSetter } from "@/components/user/hooks";
import { RoycoAnalytics } from "./royco-analytics";
import { Analytics } from "@vercel/analytics/next";
import { AtomProvider } from "./atom-provider";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get the host from headers
  const headersList = headers();

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
              {/* <UserInfoSetter /> */}

              <GeoDetector />
              <AtomProvider />
              <ToasterSonner richColors={true} position="top-center" />

              {/* <TurnstileWrapper> */}
              <Navbar />
              {children}
              {/* </TurnstileWrapper> */}
            </WalletProvider>
            {/* </AppKitProvider> */}

            <BrowserDetector />

            {/* {process.env.NODE_ENV !== "development" && (
              <RoycoAnalytics id={process.env.ANALYTICS_ID!} />
            )} */}

            <Toaster />

            <Analytics />
          </body>
        </html>
      </TooltipProvider>
    </RoycoClientProvider>

    // </RoycoProvider>
  );
}
