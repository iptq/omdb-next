// Make sure both databases have been properly set up before this script is run!
// This script is idempotent; running it multiple times will not import twice the rows.
//
// Invoke this script with:
//
//   npm run import
//
// It'll wrap this script using ts-node and run it appropriately

// Reference:
//   https://github.com/iptq/omdb/blob/laravel/omdb/app/Console/Commands/ImportDump.php

import { config } from "dotenv";
config();
config({ path: ".env.local", override: true });

import { db } from "../../src/db";
import { PrismaClient, Prisma } from "../../old-db/generated/prisma-client-js";
import { DB } from "@/db/types";
import { InsertObject } from "kysely";
import { Presets, SingleBar } from "cli-progress";
import { fetchUser, getApiKey } from "./api";

const oldClient = new PrismaClient();
const newClient = db;

// Probably adjust according to RAM?
const chunkSize = 5;

async function main() {
  console.log("Importing.");

  const apiKey = await getApiKey();

  // await importUsers();
  await importBeatmaps(apiKey);

  console.log("done.");

  process.exit(0);
}

async function importUsers() {
  console.log("Importing users...");

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
      .execute();
    await newClient
      .insertInto("OmdbUser")
      .values(omdbUsers)
      .onDuplicateKeyUpdate((eb) => ({
        CustomRatings: eb.ref("OmdbUser.CustomRatings"),
      }))
      .execute();

    const lastUser = chunkOfUsers[chunkOfUsers.length - 1];
    cursor = lastUser.UserID;
  }

  console.log("Imported users.");
}

// async function insertByChunk(chunkSize: number) {}

async function importBeatmaps(apiKey: string) {
  console.log("Importing beatmaps...");

  console.log("user", await fetchUser(apiKey, { userId: 2688103 }));

  const bar = new SingleBar({}, Presets.shades_classic);
  const howMany = await oldClient.beatmaps.count();
  bar.start(howMany, 0);

  let cursor;
  while (true) {
    const findOpts: Prisma.beatmapsFindManyArgs = {
      take: chunkSize,
      orderBy: { BeatmapID: "asc" },
    };
    if (cursor) {
      findOpts.skip = 1;
      findOpts.cursor = { BeatmapID: cursor };
    }

    const chunkOfBeatmaps = await oldClient.beatmaps.findMany(findOpts);
    if (chunkOfBeatmaps.length === 0) break;

    const newBeatmapSets: InsertObject<DB, "BeatmapSet">[] =
      chunkOfBeatmaps.map((oldBeatmap) => ({
        SetID: oldBeatmap.SetID!,
        HostID: oldBeatmap.SetCreatorID!,

        Genre: oldBeatmap.Genre!,
        Lang: oldBeatmap.Lang!,
        Artist: oldBeatmap.Artist!,
        Title: oldBeatmap.Title!,
        DateRanked: oldBeatmap.DateRanked!,
      }));

    const result = await newClient
      .insertInto("BeatmapSet")
      .values(newBeatmapSets)
      .onDuplicateKeyUpdate((eb) => ({
        HostID: eb.ref("BeatmapSet.HostID"),
        Genre: eb.ref("BeatmapSet.Genre"),
        Lang: eb.ref("BeatmapSet.Lang"),
        Artist: eb.ref("BeatmapSet.Artist"),
        DateRanked: eb.ref("BeatmapSet.DateRanked"),
      }))
      .execute();
    console.log("result", result.length);
  }

  console.log("Imported beatmaps.");
}

main();
