import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { KJUR } from "jsrsasign";

dotenv.config();

const JWT_HEADER = { alg: "HS256", typ: "JWT" };
const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const oneYear = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
const anonToken = `
{
  "role": "anon",
  "iat": ${Math.floor(today.valueOf() / 1000)},
  "exp": ${Math.floor(oneYear.valueOf() / 1000)}
}
`.trim();

const generateAnonKey = (jwtSecret: string) => {
  const signedJWT = KJUR.jws.JWS.sign(null, JWT_HEADER, anonToken, jwtSecret);
  return signedJWT;
};

// Example usage
const main = () => {
  const jwtSecret = process.env.SUPABASE_JWT_SECRET;

  if (!jwtSecret) {
    console.error("SUPABASE_JWT_SECRET environment variable is required");
    process.exit(1);
  }

  try {
    const newAnonKey = generateAnonKey(jwtSecret);
    console.log("New Anon Key:", newAnonKey);
  } catch (error) {
    console.error("Error generating anon key:", error);
    process.exit(1);
  }
};

main();
