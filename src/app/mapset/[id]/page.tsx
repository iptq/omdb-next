import { db } from "@/db";
import Link from "next/link";
import BeatmapCard from "@/components/Mapset/BeatmapCard";
import { Beatmap, Rating } from "@/db/types";
import { Selectable } from "kysely";
import RatingList from "@/components/Mapset/RatingList";
import classNames from "classnames";
import styles from "./page.module.scss";

interface MapsetProps {
  params: { id: string };
}

export async function generateMetadata({ params }: MapsetProps) {
  const { id } = params;
  return {
    title: `Mapset`,
  };
}

async function getBeatmaps(id: number) {
  return await db.selectFrom("Beatmap").selectAll().where("SetID", "=", id).orderBy("SR desc").execute();
}

async function getBeatmapset(id: number) {
  try {
    return await db
      .selectFrom("BeatmapSet")
      .innerJoin("OsuUser", "OsuUser.UserID", "BeatmapSet.HostID")
      .selectAll("BeatmapSet")
      .select("OsuUser.Username")
      .where("SetID", "=", id)
      .executeTakeFirst();
  } catch (error) {
    return null;
  }
}

async function getRatings(id: number) {
  return await db
    .selectFrom("Rating")
    .innerJoin("Beatmap", "Beatmap.BeatmapID", "Rating.BeatmapID")
    .innerJoin("OsuUser", "OsuUser.UserID", "Rating.UserID")
    .selectAll("Rating")
    .select("Beatmap.DifficultyName")
    .select("OsuUser.Username")
    .where("SetID", "=", id)
    .orderBy("DateRated desc")
    .execute();
}

export interface ExtendedRating extends Selectable<Rating> {
  DifficultyName: string;
  Username: string | null;
}

export default async function Page({ params }: MapsetProps) {
  const { id } = params;
  const mapset = await getBeatmapset(parseInt(id));

  if (!mapset) {
    return <>sdfsdf</>;
  }

  const difficulties: Selectable<Beatmap>[] = await getBeatmaps(parseInt(id));
  const ratings: ExtendedRating[] = await getRatings(parseInt(id));

  const groupedRatings: { [beatmapID: number]: ExtendedRating[] } = {};
  ratings.forEach((rating) => {
    const beatmapID = rating.BeatmapID;
    if (!groupedRatings[beatmapID]) {
      groupedRatings[beatmapID] = [];
    }
    groupedRatings[beatmapID].push(rating);
  });

  return (
    <main className="main content">
      <center>
        <h1>
          <Link href={`https://osu.ppy.sh/s/${id}`} target="_blank" rel="noopener noreferrer">
            {mapset.Artist} - {mapset.Title}
          </Link>{" "}
          by <Link href={`../profile/${mapset.HostID}`}>{mapset.Username}</Link>
        </h1>
      </center>
      {difficulties.map((difficulty) => {
        return <BeatmapCard key={difficulty.BeatmapID} difficulty={difficulty} />;
      })}
      <hr />
      <div className={classNames("flex-container", "column-when-mobile-container", styles.ratingCommentContainer)}>
        <RatingList ratings={ratings} />
        Gm
      </div>
    </main>
  );
}
