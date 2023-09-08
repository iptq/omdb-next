import { db } from "@/db";
import { sql } from "kysely";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get("query");

  // If it's a link in the query, we should just show the map.
  // TODO:

  // TODO: Translate these to Kysely queries

  const likeQuery = `%${query}%`;

  const users = (
    await sql`
    (SELECT DISTINCT UserID, Username FROM OsuUser WHERE Username LIKE ${likeQuery}) LIMIT 5;
  `.execute(db)
  )?.rows;

  const maps = (
    await sql`
    SELECT SetID, Title, Artist FROM BeatmapSet
    WHERE MATCH (Artist, Title) AGAINST(${query} IN NATURAL LANGUAGE MODE) LIMIT 25
  `.execute(db)
  )?.rows;
  console.log("maps", maps);

  return NextResponse.json({ users, maps });
}
