import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { SignJWT, jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);
const JWT_EXPIRY = "15m";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const fetchCache = "force-no-store";

const CACHE_DURATION = 15 * 60; // 15 minutes in seconds

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const turnstileToken = searchParams.get("turnstile_token");
    const sessionToken = searchParams.get("session_token");

    // If session token is provided, verify it
    if (sessionToken) {
      try {
        const { payload } = await jwtVerify(sessionToken, SECRET_KEY);
        return NextResponse.json(
          { status: "success", sessionToken },
          { status: 200 }
        );
      } catch (error) {
        return NextResponse.json({ status: "invalid_token" }, { status: 401 });
      }
    }

    // If no turnstile token provided when no session token exists
    if (!turnstileToken) {
      return NextResponse.json(
        { status: "verification_required" },
        { status: 401 }
      );
    }

    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

    // Verify turnstile token
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: turnstileToken,
          remoteip: ip,
        }),
      }
    );

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(
        {
          status: "verification_failed",
          error: data["error-codes"]
            ? data["error-codes"].join(", ")
            : "Unknown error",
        },
        { status: 400 }
      );
    }

    // Create new JWT token
    const newToken = await new SignJWT({})
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRY)
      .sign(SECRET_KEY);

    const newResponse = NextResponse.json(
      { status: "success", sessionToken: newToken },
      { status: 200 }
    );

    // Set the session token as an HTTP-only cookie
    newResponse.cookies.set({
      name: "session-token",
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 minutes in seconds
      path: "/",
    });

    return newResponse;
  } catch (error) {
    console.error("Error in /api/auth/verify route", error);
    return Response.json({ status: "Internal Server Error" }, { status: 500 });
  }
}
