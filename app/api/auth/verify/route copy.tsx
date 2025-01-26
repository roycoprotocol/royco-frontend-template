import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const fetchCache = "force-no-store";

const CACHE_DURATION = 15 * 60; // 15 minutes in seconds

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const session_token = searchParams.get("session_token");

    if (!session_token) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    // Check Redis cache first
    const cached = await kv.get(session_token);

    if (cached !== null) {
      return NextResponse.json(
        { status: cached ? "success" : "failed" },
        { status: cached ? 200 : 400 }
      );
    }

    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: session_token,
          remoteip: ip,
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          status: `Verification request failed with status ${response.status}`,
        },
        { status: 400 }
      );
    }

    const data = await response.json();

    if (!data.success) {
      // Cache failed verification
      await kv.set(auth_token, false, { ex: CACHE_DURATION });
      return NextResponse.json(
        {
          status: `Verification failed: ${
            data["error-codes"]
              ? data["error-codes"].join(", ")
              : "Unknown error"
          }`,
        },
        { status: 400 }
      );
    }

    // Cache successful verification
    await kv.set(auth_token, true, { ex: CACHE_DURATION });
    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/auth/verify route", error);
    return Response.json({ status: "Internal Server Error" }, { status: 500 });
  }
}
