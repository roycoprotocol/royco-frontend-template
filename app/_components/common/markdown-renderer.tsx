import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import ReactMarkdown, { type Components } from "react-markdown";

export const MdxComponents: Components = {
  p: ({ node, ...props }) => <p {...props} className="text-inherit" />,
  strong: ({ node, ...props }) => (
    <strong {...props} className="font-semibold" />
  ),
  em: ({ node, ...props }) => <em {...props} className="italic" />,
  a: ({ node, ...props }) => {
    const href = props.href;

    if (!href) {
      return null;
    } else if (href.startsWith("http")) {
      return (
        <a
          {...props}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "text-inherit",
            "font-medium text-blue-700 underline underline-offset-2 transition-opacity duration-300 ease-in-out hover:opacity-80"
          )}
        >
          {props.children}
        </a>
      );
    } else {
      return (
        <Link
          href={href}
          {...props}
          className={cn(
            "text-inherit",
            "font-medium text-blue-700 underline underline-offset-2 transition-opacity duration-300 ease-in-out hover:opacity-80"
          )}
        />
      );
    }
  },
};

export const MarkdownRenderer = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown components={MdxComponents}>{String(children)}</ReactMarkdown>
  );
};

MarkdownRenderer.displayName = "MarkdownRenderer";
