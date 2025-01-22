"use client";

import Script from "next/script";

export const RoycoAnalytics = ({ id }: { id: string }) => {
  if (typeof window !== "undefined") {
    return (
      <Script
        defer
        src={`${window.location.origin}/script.js`}
        data-website-id={id}
        data-host-url={`${window.location.origin}/api/event`}
      />
    );
  }
};
