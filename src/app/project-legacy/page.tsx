import UserProfilePicture from "@/components/UserProfilePicture";
import styles from "./page.module.scss";
import { db } from "@/db";
import classNames from "classnames";

export default async function Page() {
  const { setsLeft, edits, mapsWithoutNominatorData } = await getData();

  return (
    <div className={classNames("container")}>
      <div className={classNames(styles.body)}>
        <h2>{setsLeft} sets left.</h2>
        There are {setsLeft} sets from modding v1 that have missing nominator
        data, and this project tracks progress on backfilling it. <br />
        <span className={styles.subText}>
          (you might get something cool in the future if you get at least 50
          nominator edits!!)
        </span>
      </div>

      <div className="flex-container">
        <div className="flex-child">
          Most approved nominator edits
          {edits.map((edit, idx) => {
            return (
              <div
                className={classNames("alternating-bg", styles.box1)}
                key={edit.UserID}
              >
                {idx}
                <UserProfilePicture userID={1} />
                {edit.Username} - {edit.count.toString()}
              </div>
            );
          })}
        </div>

        <div className="flex-child">
          Highest charting maps without nominator data
          {mapsWithoutNominatorData.map((row) => {
            return (
              <div
                className={classNames("alternating-bg", styles.box2)}
                key={row.BeatmapID}
              >
                <a href='/mapset/{$row["SetID"]}'>
                  {row.ChartRank}: {row.Artist} - {row.Title}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

async function getData() {
  const [setsLeft, edits, mapsWithoutNominatorData] = await Promise.all([
    getSetsLeft(),
    getEdits(),
    getMapsWithoutNominatorData(),
  ]);
  return { setsLeft, edits, mapsWithoutNominatorData };
}

async function getEdits() {
  return await db
    .selectFrom("BeatmapEditRequest")
    .innerJoin("Beatmap", "BeatmapEditRequest.BeatmapID", "Beatmap.BeatmapID")
    .innerJoin("OsuUser", "BeatmapEditRequest.UserID", "OsuUser.UserID")
    .select(({ fn }) => [
      "OsuUser.UserID",
      fn.countAll().as("count"),
      "OsuUser.Username",
    ])
    .where("Beatmap.SetID", "is not", null)
    .groupBy("UserID")
    .orderBy("count desc")
    .limit(25)
    .execute();
}

async function getMapsWithoutNominatorData() {
  return await db
    .selectFrom("Beatmap")
    .innerJoin("BeatmapSet", "Beatmap.SetID", "BeatmapSet.SetID")
    .leftJoin(
      "BeatmapSetNominator",
      "Beatmap.SetID",
      "BeatmapSetNominator.SetID"
    )
    .select([
      "Beatmap.BeatmapID",
      "Beatmap.ChartRank",
      "BeatmapSet.Artist",
      "BeatmapSet.Title",
    ])
    .where("BeatmapSetNominator.SetID", "is", null)
    .where("Beatmap.ChartRank", "is not", null)
    .orderBy("Beatmap.ChartRank asc")
    .limit(42)
    .execute();
}

async function getSetsLeft() {
  const row = await db
    .selectFrom("Beatmap")
    .leftJoin(
      "BeatmapSetNominator",
      "Beatmap.SetID",
      "BeatmapSetNominator.SetID"
    )
    .select(({ fn }) =>
      fn.agg<number>("count", ["Beatmap.SetID"]).distinct().as("count")
    )
    .where("BeatmapSetNominator.SetID", "is", null)
    .executeTakeFirst();
  return row?.count ?? 0;
}
