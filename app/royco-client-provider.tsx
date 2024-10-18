"use client";

import { RoycoProvider } from "@/sdk";

export const RoycoClientProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <RoycoProvider
      originUrl={process.env.NEXT_PUBLIC_SUPABASE_URL!}
      originKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}
    >
      {children}
    </RoycoProvider>
  );
};
