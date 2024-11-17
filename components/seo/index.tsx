export const Meta = {
  viewport: {
    themeColor: "#FBFBF8",
    width: "device-width",
    initialScale: 1,
    colorScheme: "light",
  },

  base: {
    name: "Royco",
    description:
      "Royco Protocol creates efficient markets for any onchain action.",
    longName: `Home | Royco Protocol`,
    og: {
      url: "/home-v2.jpg",
      width: 1200,
      height: 630,
      alt: "OG image of Royco",
    },
  },

  authors: {
    me: {
      name: "Royco Protocol",
      url: process.env.NEXT_PUBLIC_APP_URL,
    },
  },

  common: {
    metadataBase: process.env.NEXT_PUBLIC_APP_URL,
    referrer: "origin",
    generator: "Next.js",
    keywords: [
      "incentives, market, protocol, blockchain, crypto, liquidity, NFT",
    ],
    publisher: `Royco Protocol`,
    category: "General Protocol",
    locale: "en_US",
    type: "website",

    robots: {
      index: true,
      follow: true,
      noarchive: true,
      nosnippet: false,
      noimageindex: false,
      nocache: false,
      notranslate: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
      },
    },

    alternatives: {
      canonical: process.env.NEXT_PUBLIC_APP_URL,
      hreflang: {
        "en-US": process.env.NEXT_PUBLIC_APP_URL,
      },
    },

    icons: {
      icon: "/icon.png",
      shortcut: ["/shortcut-icon.png"],
      apple: [
        {
          url: "/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
      other: [
        {
          rel: "icon",
          url: "/icon.png",
        },
        {
          rel: "apple-touch-icon",
          url: "/apple-touch-icon.png",
        },
      ],
    },

    appLinks: {
      web: {
        url: process.env.NEXT_PUBLIC_APP_URL,
        should_fallback: true,
      },
    },
  },

  openGraph: {
    type: "website",
    siteName: `Home | Royco Protocol`,
  },

  twitter: {
    card: "summary_large_image",
    siteId: "1776310548982120449",
    creator: "roycoprotocol",
    creatorId: "1776310548982120449",
  },

  appleWebApp: {
    statusBarStyle: "black-translucent",
  },
};
