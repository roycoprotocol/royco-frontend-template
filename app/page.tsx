import { Meta } from "@/components/seo";
import { Blocks } from "./_components/ui";

export function generateViewport() {
  return {
    ...Meta.viewport,
  };
}

export async function generateMetadata() {
  return {
    ...Meta.common,

    title: Meta.base.longName,
    description: Meta.base.description,
    openGraph: {
      ...Meta.openGraph,

      title: Meta.base.longName,
      description: Meta.base.description,
      url: `${process.env.NEXT_PUBLIC_APP_URL}`,
      images: [Meta.base.og],
    },

    authors: [Meta.authors.me],
    creator: Meta.authors.me.name,

    twitter: {
      title: Meta.base.longName,
      description: Meta.base.description,
      images: [Meta.base.og],
    },

    appleWebApp: {
      ...Meta.appleWebApp,
      title: Meta.base.longName,

      startupImage: [
        {
          ...Meta.base.og,
          media: "(device-width: 1200px) and (device-height: 630px)",
        },
      ],
    },
  };
}

export default function Home() {
  return <Blocks />;
}
