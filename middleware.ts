import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    if (["POST", "PUT", "PATCH"].includes(request.method)) {
      const contentType = request.headers.get("content-type");

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
