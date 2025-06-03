import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `Royco`,
    short_name: "Royco",
    description:
      "Royco Protocol creates efficient markets for any onchain action.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#FBFBF8",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
    categories: ["protocol"],
  };
}
