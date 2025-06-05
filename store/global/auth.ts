import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Session } from "royco/api";
import Cookies from "universal-cookie";
import { accountAddressAtom } from "./atoms";
import { userInfoAtom } from "./user";

export const secureCookieConfig = {
  secure: process.env.NEXT_PUBLIC_API_ENV === "development" ? false : true,
  httpOnly: process.env.NEXT_PUBLIC_API_ENV === "development" ? false : true,
  sameSite: "strict" as const,
  path: "/",
};

export const parentSessionAtom = atom<Session | null>(null);

const cookies = new Cookies();

export const sessionCookieStorage = {
  getItem: (key: string) => {
    const cookieItem = cookies.get<string>("royco.session");
    if (!cookieItem) return null;
    try {
      // Handle both string and object formats
      if (typeof cookieItem === "string") {
        return JSON.parse(cookieItem) as Session;
      } else if (typeof cookieItem === "object") {
        return cookieItem as Session;
      }
      return null;
    } catch (e) {
      console.error("Error parsing cookie:", e);
      return null;
    }
  },
  setItem: (key: string, value: Session | null) => {
    if (value) {
      // Ensure we're storing a proper JSON string
      const stringified =
        typeof value === "string" ? value : JSON.stringify(value);
      cookies.set("royco.session", stringified, {
        ...secureCookieConfig,
      });
    } else {
      cookies.remove("royco.session", secureCookieConfig);
    }
  },
  removeItem: (key: string) => {
    cookies.remove("royco.session", secureCookieConfig);
  },
};

export const sessionAtom = atomWithStorage<Session | null>(
  "session",
  null,
  sessionCookieStorage,
  {
    getOnInit: true,
  }
);

export const authenticationStatusAtom = atom<
  "unauthenticated" | "loading" | "authenticated"
>("unauthenticated");

export const isAuthEnabledAtom = atom(true);

export const keepLoggedInAtom = atom(true);

export const showUserInfoAtom = atom((get) => {
  const accountAddress = get(accountAddressAtom);
  const session = get(sessionAtom);
  const userInfo = get(userInfoAtom);

  return Boolean(
    accountAddress &&
      session &&
      userInfo &&
      session.userId === userInfo.id &&
      accountAddress.toLowerCase() === session.walletAddress.toLowerCase()
  );
});

export const hasRoyaltyAccessAtom = atom((get) => {
  const showUserInfo = get(showUserInfoAtom);
  const userInfo = get(userInfoAtom);

  return Boolean(
    showUserInfo && userInfo && userInfo.email && userInfo.verified
  );
});
