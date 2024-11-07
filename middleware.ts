import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define blocked countries
const BLOCKED_COUNTRIES = ["US"]; // Add countries you want to block

export async function middleware(request: NextRequest) {
  // Only apply geoblocking if NEXT_PUBLIC_IS_GEOBLOCKED is TRUE
  if (process.env.NEXT_PUBLIC_IS_GEOBLOCKED !== "TRUE") {
    return NextResponse.next();
  }

  // Get country from request geo data
  const country = request.geo?.country || "US";

  // Block access if user is from blocked countries
  if (BLOCKED_COUNTRIES.includes(country)) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message:
          "Access to this content is not available in your region due to legal restrictions.",
      }),
      {
        status: 451,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Add paths you want to protect
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
