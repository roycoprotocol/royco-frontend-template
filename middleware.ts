import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_FRONTEND_TAG === "boyco") {
    // Check if the request is for the auth/verify route
    if (
      request.nextUrl.pathname.startsWith("/api/") &&
      !request.nextUrl.pathname.startsWith("/api/auth/verify") &&
      !request.nextUrl.pathname.startsWith("/api/push/token")
    ) {
      const authToken = request.headers.get("auth-token");

      const isValid = await fetch("/api/auth/verify?auth_token=" + authToken);

      if (!isValid) {
        return new NextResponse(JSON.stringify({ status: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
    }
  }

  // Check API key specifically for /api/push/token route
  if (request.nextUrl.pathname === "/api/push/token") {
    // 1. Auth token can be passed in header
    const headerToken = request.headers.get("auth-token");

    // 2. Auth token can be passed in url params
    const urlToken = request.nextUrl.searchParams.get("auth_token");

    // It must be one of the two
    const authToken = headerToken || urlToken;

    // Check if auth token is valid
    if (!authToken || authToken !== process.env.API_SECRET_KEY) {
      return new NextResponse(JSON.stringify({ status: "Unauthorized" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }

  // Content-type checking for all API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    if (["POST", "PUT", "PATCH"].includes(request.method)) {
      // Check if content-type is application/json
      const contentType = request.headers.get("content-type");

      // If not application/json, return 415
      if (!contentType || contentType !== "application/json") {
        return new NextResponse(
          JSON.stringify({ error: "Content-Type must be application/json" }),
          {
            status: 415,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
