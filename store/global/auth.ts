import { atom } from "jotai";

const getCookieDomain = () => {
  if (process.env.NEXT_PUBLIC_API_ENV === "development") {
    return "localhost";
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    const url = new URL(process.env.NEXT_PUBLIC_APP_URL);
    return url.hostname;
  }

  return undefined;
};

export const secureCookieConfig = {
  secure: process.env.NEXT_PUBLIC_API_ENV !== "development",
  httpOnly: process.env.NEXT_PUBLIC_API_ENV !== "development",
  sameSite: "strict" as const,
  path: "/",
  domain: getCookieDomain(),
  maxAge: 60 * 60 * 24 * 30,
};

export const authenticationStatusAtom = atom<
  "unauthenticated" | "loading" | "authenticated"
>("unauthenticated");

export const isAuthEnabledAtom = atom(true);

export const isAuthenticatedAtom = atom((get) => {
  const authenticationStatus = get(authenticationStatusAtom);
  return authenticationStatus === "authenticated";
});
