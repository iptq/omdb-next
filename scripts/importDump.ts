// Make sure both databases have been properly set up before this script is run!
// This script is idempotent; running it multiple times will not import twice the rows.

// Reference:
//   https://github.com/iptq/omdb/blob/laravel/omdb/app/Console/Commands/ImportDump.php

import { config } from "dotenv";
config();
config({ path: ".env.local", override: true });

import { db } from "../src/db";
import { PrismaClient, Prisma } from "../old-db/generated/prisma-client-js";
import { DB } from "@/db/types";
import { InsertObject } from "kysely";

export type InsertObjectOrList<DB, TB extends keyof DB> =
  | InsertObject<DB, TB>
  | ReadonlyArray<InsertObject<DB, TB>>;

const oldClient = new PrismaClient();
const newClient = db;

// Probably adjust according to RAM?
const chunkSize = 5;

async function main() {
  console.log("Importing.");

  const apiKey = await getApiKey();

  await importUsers();
  console.log("done.");

  process.exit(0);
}

async function getApiKey() {
  const body = new URLSearchParams({
    client_id: process.env.OSU_CLIENT_ID!,
    client_secret: process.env.OSU_CLIENT_SECRET!,
    grant_type: "client_credentials",
    scope: "public",
  });
  const resp = await fetch("https://osu.ppy.sh/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const result = await resp.json();
  console.log("Got api token.", result);
  return result["access_token"];
}

async function importUsers() {
  console.log("importing users...");

  let cursor;
  while (true) {
    const findOpts: Prisma.usersFindManyArgs = {
      take: chunkSize,
      orderBy: { UserID: "asc" },
    };
    if (cursor) {
      findOpts.skip = 1;
      findOpts.cursor = { UserID: cursor };
    }

    const chunkOfUsers = await oldClient.users.findMany(findOpts);
    if (chunkOfUsers.length === 0) break;

    const osuUsers: InsertObject<DB, "OsuUser">[] = [];
    const omdbUsers: InsertObject<DB, "OmdbUser">[] = [];
    for (const user of chunkOfUsers) {
      osuUsers.push({ UserID: user.UserID, Username: user.Username! });
      const customRatings = {
        "0.0": user.Custom00Rating,
        "0.5": user.Custom05Rating,
        "1.0": user.Custom10Rating,
        "1.5": user.Custom15Rating,
        "2.0": user.Custom20Rating,
        "2.5": user.Custom25Rating,
        "3.0": user.Custom30Rating,
        "3.5": user.Custom35Rating,
        "4.0": user.Custom40Rating,
        "4.5": user.Custom45Rating,
        "5.0": user.Custom50Rating,
      };
      omdbUsers.push({
        UserID: user.UserID,
        CustomRatings: JSON.stringify(customRatings),
      });
    }

    await newClient
      .insertInto("OsuUser")
      .values(osuUsers)
      .onDuplicateKeyUpdate((eb) => ({
        Username: eb.ref("OsuUser.Username"),
      }))
      //   .onConflict((oc) =>
      //     oc
      //       .column("UserID")
      //       .doUpdateSet((eb) => ({ Username: eb.ref("OsuUser.Username") }))
      //   )
      .execute();
    await newClient
      .insertInto("OmdbUser")
      .values(omdbUsers)
      .onDuplicateKeyUpdate((eb) => ({
        CustomRatings: eb.ref("OmdbUser.CustomRatings"),
      }))
      //   .onConflict((oc) =>
      //     oc.column("UserID").doUpdateSet((eb) => ({
      //       CustomRatings: eb.ref("OmdbUser.CustomRatings"),
      //     }))
      //   )
      .execute();

    const lastUser = chunkOfUsers[chunkOfUsers.length - 1];
    cursor = lastUser.UserID;
  }

  console.log("imported users.");
}

main();
