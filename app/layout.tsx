import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "./_components";

import { Toaster } from "react-hot-toast";

/**
 * @description Imports for web3 modal
 * @see {@link https://docs.walletconnect.com/web3modal/nextjs/about}
 */
import { headers } from "next/headers";
import AppKitProvider from "@/components/web3-modal/context-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

import { RoycoProvider } from "@/sdk";
import { BrowserDetector } from "@/store/use-general-stats";

/**
 * @description Inter Font
 */
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

/**
 * @description GT Font
 */
const gt = localFont({
  src: [
    {
      path: "../public/fonts/Inter-ExtraLight.otf",
      weight: "200",
      style: "extralight",
    },
    {
      path: "../public/fonts/Inter-Light.otf",
      weight: "300",
      style: "light",
    },
    {
      path: "../public/fonts/Inter-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter-Medium.otf",
      weight: "500",
      style: "medium",
    },
    {
      path: "../public/fonts/Inter-Bold.otf",
      weight: "700",
      style: "bold",
    },
  ],
  display: "swap",
  variable: "--font-gt",
});

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
  /**
   * @description Fetch the previously stored state of web3 modal
   */
  const cookies = headers().get("cookie");

  return (
    <RoycoProvider
      originUrl={process.env.NEXT_PUBLIC_SUPABASE_URL!}
      originKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}
    >
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
            <AppKitProvider cookies={cookies}>
              <Navbar />
              {children}
            </AppKitProvider>

            <BrowserDetector />

            <Toaster />
          </body>
        </html>
      </TooltipProvider>
    </RoycoProvider>
  );
}
