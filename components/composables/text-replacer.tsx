"use client";

import { useTextReplacer } from "./use-text-replacer";

export function TextReplacer() {
  const { isProcessed, attempts } = useTextReplacer({
    replacements: [
      // {
      //   target: "Verify your account",
      //   replacement: "Custom Text",
      // },
      // {
      //   target:
      //     "To finish connecting, you must sign a message in your wallet to verify that you are the owner of this account.",
      //   replacement: "Custom Test Message",
      // },
    ],
    selectors: ["[data-rk]", "body"],
    interval: 300,
    maxAttempts: 30,
  });

  // Optional: Log for debugging
  if (process.env.NODE_ENV === "development") {
    console.log(
      `Text replacer: ${isProcessed ? "Processed" : "Processing"} (attempts: ${attempts})`
    );
  }

  return null;
}
