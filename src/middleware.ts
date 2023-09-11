import { NextRequest, NextResponse } from "next/server";
import { db } from "./db";

export const config = {
  matcher: ["/api/((?!docs).*)"],
};

export async function middleware(request: NextRequest) {
  console.log("SHIET", request.url);

  // Check if API header exists
  const apiKey = request.headers.get("Authorization");
  const userID = await tryAuthenticate(apiKey);
  if (!userID) return NextResponse.json({ success: false, message: "authentication failed" }, { status: 401 });
}

/**
 * @returns the authenticated user's ID number
 */
async function tryAuthenticate(apiKey: string | null): Promise<number | null> {
  if (!apiKey) return null;

  const result = await db
    .selectFrom("ApiKey")
    .select("ApiKey.UserID")
    .where("ApiKey.ApiKey", "=", apiKey)
    .executeTakeFirst();

  return result?.UserID ?? null;
}
