import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { Inter, Shippori_Mincho_B1, Fragment_Mono } from "next/font/google";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";

import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RoycoClientProvider } from "./_containers/providers/royco-client-provider";
import WalletProvider from "@/components/rainbow-modal/context-provider";
import { Toaster as ToasterSonner } from "@/components/ui/sonner";

import { Analytics } from "@vercel/analytics/next";
import { BrowserDetector } from "@/store/use-general-stats";
import { GeoDetector } from "@/store/use-general-stats";
import { NavigationWrapper } from "./_components/header/navigation-wrapper";
import { FooterWrapper } from "./_components/footer/footer-wrapper";
import { DataProvider } from "./_containers/providers/data-provider";
import { headers } from "next/headers";
import { WalletEditor } from "./_components/user/wallet-editor";
import { EmailEditor } from "./_components/user/email-editor";
import { MixpanelWrapper } from "../services/mixpanel/mixpanel-wrapper";

/**
 * Inter Font
 */
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const gt = Inter({ subsets: ["latin"], variable: "--font-gt" });

/**
 * Shippori Mincho Font
 */
const shippori = Shippori_Mincho_B1({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-shippori",
});

/**
 * Fragment Mono Font
 */
const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-fragment-mono",
});

/**
 * Ortica Font
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
 * Morion Font
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

const fontsVariables = [
  inter.variable,
  gt.variable,
  shippori.variable,
  fragmentMono.variable,
  ortica.variable,
  morion.variable,
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = headers().get("cookie");

  return (
    <RoycoClientProvider>
      <TooltipProvider delayDuration={0}>
        <MixpanelWrapper>
          <html lang="en-US">
            <body
              suppressHydrationWarning
              className={cn(
                ...fontsVariables,
                "hide-scrollbar overflow-x-hidden scroll-smooth font-gt"
              )}
            >
              <WalletProvider cookies={cookie}>
                <DataProvider />

                <EmailEditor />
                <WalletEditor />

                <GeoDetector />

                <ToasterSonner richColors={true} position="top-center" />

                <div className="flex min-h-screen flex-col">
                  <NavigationWrapper />

                  <div className="grow">{children}</div>

                  <FooterWrapper />
                </div>
              </WalletProvider>

              <BrowserDetector />

              <Toaster />

              {process.env.NODE_ENV !== "development" && <Analytics />}

              {/* <TextReplacer /> */}
            </body>
          </html>
        </MixpanelWrapper>
      </TooltipProvider>
    </RoycoClientProvider>
  );
}
