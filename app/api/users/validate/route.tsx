import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { OwnershipProofMessage } from "@/components/constants";
import { verifyMessage } from "viem";
import { sign } from "jsonwebtoken";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const fetchCache = "force-no-store";

export async function POST(request: Request) {
  try {
    const { signed_message, account_address } = await request.json();

    if (!signed_message) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    // Check if ownership proof message was signed by the user
    const isValid = verifyMessage({
      message: OwnershipProofMessage,
      signature: signed_message,
      address: account_address.toLowerCase(),
    });

    if (!isValid) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    // Create a new JWT that is valid for 7 * 24 hours
    const sign_in_token = sign(
      {
        account_address,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    return NextResponse.json({ sign_in_token }, { status: 200 });
  } catch (error) {
    console.error("Error  in /api/auth/validate route", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
