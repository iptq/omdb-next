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
import { Api } from "../../src/osuapi";
import { insertOsuUsers } from "./db";

const oldClient = new PrismaClient();
const newClient = db;

// Probably adjust according to RAM?
const chunkSize = 100;
let api: Api;

async function main() {
  console.log("Importing.");

  api = await Api.new();

  // await importUsers();
  // await importBeatmaps();
  await Promise.all([importRatings(), importComments()]);

  console.log("done.");

  process.exit(0);
}

async function importUsers() {
  console.log("Importing users...");

  const bar = new SingleBar({}, Presets.shades_classic);
  const howMany = await oldClient.users.count();
  bar.start(howMany, 0);

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

    await Promise.all(
      chunkOfUsers.map(async (user) => {
        let newUser: InsertObject<DB, "OsuUser"> = {
          UserID: user.UserID,
          LastFetched: new Date(),
        };
        try {
          const apiUser = await api.fetchUser(user.UserID);
          newUser.Username = apiUser.username;
          // newUser.ApiInfo = JSON.stringify(apiUser);
        } catch (e) {}
        osuUsers.push(newUser);

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
      })
    );

    await insertOsuUsers(newClient, osuUsers);
    await newClient
      .insertInto("OmdbUser")
      .values(omdbUsers)
      .onDuplicateKeyUpdate((eb) => ({
        CustomRatings: eb.ref("OmdbUser.CustomRatings"),
      }))
      .execute();

    bar.increment(chunkOfUsers.length);
    const lastUser = chunkOfUsers[chunkOfUsers.length - 1];
    cursor = lastUser.UserID;
  }

  bar.stop();
  console.log("Imported users.");
}

async function importBeatmaps() {
  console.log("Importing beatmaps...");

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

    const newUsers: InsertObject<DB, "OsuUser">[] = [];
    const newBeatmapSets: InsertObject<DB, "BeatmapSet">[] = [];
    const newBeatmaps: InsertObject<DB, "Beatmap">[] = [];

    await Promise.all(
      chunkOfBeatmaps.map(async (oldBeatmap) => {
        let host: InsertObject<DB, "OsuUser"> = {
          UserID: oldBeatmap.SetCreatorID!,
          LastFetched: new Date(),
        };
        try {
          const user = await api.fetchUser(oldBeatmap.SetCreatorID!);
          host.Username = user.username;
        } catch (e) {}
        newUsers.push(host);

        newBeatmapSets.push({
          SetID: oldBeatmap.SetID!,
          HostID: oldBeatmap.SetCreatorID!,

          Genre: oldBeatmap.Genre!,
          Lang: oldBeatmap.Lang!,
          Artist: oldBeatmap.Artist!,
          Title: oldBeatmap.Title!,
          DateRanked: oldBeatmap.DateRanked!,
        });

        newBeatmaps.push({
          BeatmapID: oldBeatmap.BeatmapID,
          SetID: oldBeatmap.SetID!,
          DifficultyName: oldBeatmap.DifficultyName!,
          Mode: oldBeatmap.Mode,
          Status: oldBeatmap.Status,
          SR: oldBeatmap.SR,
        });
      })
    );

    await insertOsuUsers(newClient, newUsers);
    await newClient
      .insertInto("BeatmapSet")
      .values(newBeatmapSets)
      .onDuplicateKeyUpdate((eb) => ({
        HostID: eb.ref("BeatmapSet.HostID"),
        Genre: eb.ref("BeatmapSet.Genre"),
        Lang: eb.ref("BeatmapSet.Lang"),
        Artist: eb.ref("BeatmapSet.Artist"),
        Title: eb.ref("BeatmapSet.Title"),
        DateRanked: eb.ref("BeatmapSet.DateRanked"),
      }))
      .execute();
    await newClient
      .insertInto("Beatmap")
      .values(newBeatmaps)
      .onDuplicateKeyUpdate((eb) => ({
        SetID: eb.ref("Beatmap.SetID"),
        DifficultyName: eb.ref("Beatmap.DifficultyName"),
        Mode: eb.ref("Beatmap.Mode"),
        Status: eb.ref("Beatmap.Status"),
        SR: eb.ref("Beatmap.SR"),
      }))
      .execute();

    bar.increment(chunkOfBeatmaps.length);
    const lastBeatmap = chunkOfBeatmaps[chunkOfBeatmaps.length - 1];
    cursor = lastBeatmap.BeatmapID;
  }

  bar.stop();
  console.log("Imported beatmaps.");
}

async function importRatings() {
  const bar = new SingleBar({}, Presets.shades_classic);
  const howMany = await oldClient.ratings.count();
  console.log(`Importing ${howMany} ratings...`);
  bar.start(howMany, 0);

  let cursor;
  while (true) {
    const findOpts: Prisma.ratingsFindManyArgs = {
      take: chunkSize,
      orderBy: { BeatmapID: "asc" },
    };
    if (cursor) {
      findOpts.skip = 1;
      findOpts.cursor = { RatingID: cursor };
    }

    const chunkOfRatings = await oldClient.ratings.findMany(findOpts);
    if (chunkOfRatings.length === 0) break;

    const newRatings: InsertObject<DB, "Rating">[] = [];

    await Promise.all(
      chunkOfRatings.map(async (oldRating) => {
        newRatings.push({
          RatingID: oldRating.RatingID,
          BeatmapID: oldRating.BeatmapID,
          UserID: oldRating.UserID,
          Score: oldRating.Score!.toString(),
          DateRated: oldRating.date,
        });
      })
    );

    try {
      await newClient
        .insertInto("Rating")
        .values(newRatings)
        .onDuplicateKeyUpdate((eb) => ({
          Score: eb.ref("Rating.Score"),
          DateRated: eb.ref("Rating.DateRated"),
        }))
        .execute();
    } catch (e) {
      console.log();
      console.error("error", e, JSON.stringify(e));
      console.log();
    }

    bar.increment(chunkOfRatings.length);
    const lastRating = chunkOfRatings[chunkOfRatings.length - 1];
    cursor = lastRating.RatingID;
  }

  bar.stop();
  console.log("Imported ratings.");
}

async function importComments() {
  const bar = new SingleBar({}, Presets.shades_classic);
  const howMany = await oldClient.comments.count();
  console.log(`Importing ${howMany} comments...`);
  bar.start(howMany, 0);

  let cursor;
  while (true) {
    const findOpts: Prisma.commentsFindManyArgs = {
      take: chunkSize,
      orderBy: { CommentID: "asc" },
    };
    if (cursor) {
      findOpts.skip = 1;
      findOpts.cursor = { CommentID: cursor };
    }

    const chunkOfComments = await oldClient.comments.findMany(findOpts);
    if (chunkOfComments.length === 0) break;

    const newComments: InsertObject<DB, "Comment">[] = [];

    await Promise.all(
      chunkOfComments.map(async (oldRating) => {
        newComments.push({
          CommentID: oldRating.CommentID,
          SetID: oldRating.SetID,
          UserID: oldRating.UserID,
          Content: oldRating.Comment!,
          DatePosted: oldRating.date!,
        });
      })
    );

    try {
      await newClient
        .insertInto("Comment")
        .values(newComments)
        .onDuplicateKeyUpdate((eb) => ({
          Content: eb.ref("Comment.Content"),
          DatePosted: eb.ref("Comment.DatePosted"),
        }))
        .execute();
    } catch (e) {
      console.log();
      console.error("error", e, JSON.stringify(e));
      console.log();
    }

    bar.increment(chunkOfComments.length);
    const lastComment = chunkOfComments[chunkOfComments.length - 1];
    cursor = lastComment.CommentID;
  }

  bar.stop();
  console.log("Imported comments.");
}

main();
