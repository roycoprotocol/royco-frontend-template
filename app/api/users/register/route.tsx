import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/components/data";
import axios from "axios";
import validator from "validator";
import { Resend } from "resend";
import jwt from "jsonwebtoken";
import { isSolidityAddressValid } from "royco/utils";
import {
  areWalletsValid,
  isEmailValid,
  isHashValid,
  isUsernameValid,
  isWalletValid,
} from "@/components/user";
import { RegisterUserTemplate } from "@/components/constants";
import { createHash } from "crypto";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const fetchCache = "force-no-store";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export async function POST(request: Request) {
  try {
    const { username, email, wallets } = await request.json();

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Create and sign JWT with OTP
    const token = jwt.sign(
      {
        username,
        email,
        wallets,
        otp: Number(otp), // Convert otp to number
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "10m" } // Shorter expiration for OTP
    );

    const hash = createHash("sha256").update(token).digest("hex");

    const [usernameValid, emailValid, walletsValid, hashValid] =
      await Promise.all([
        isUsernameValid({ username }),
        isEmailValid({ email }),
        areWalletsValid({ wallets }),
        isHashValid({ hash }),
      ]);

    if (!usernameValid) {
      return Response.json({ status: "Invalid username" }, { status: 400 });
    }

    if (!emailValid) {
      return Response.json({ status: "Invalid email" }, { status: 400 });
    }

    if (!walletsValid) {
      return Response.json({ status: "Invalid wallets" }, { status: 400 });
    }

    await supabaseClient.from("user_hash_map").insert({
      hash,
    });

    // Send email with OTP
    const email_response = await resend.emails.send({
      from: "Royco Royalty <intern@royco.org>",
      to: email,
      subject: `${otp} is your verification code`,
      react: RegisterUserTemplate({
        username,
        otp,
      }),
    });

    if (email_response.error) {
      return Response.json({ status: "Failed to send email" }, { status: 500 });
    }

    return Response.json(
      {
        status: "Success",
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/users/register route", error);
    return Response.json({ status: "Internal Server Error" }, { status: 500 });
  }
}
