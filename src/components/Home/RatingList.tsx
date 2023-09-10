import classNames from "classnames";
import styles from "./RatingList.module.scss";
import StarRatingDisplay from "../shared/StarRatingDisplay";
import { db } from "@/db";
import BeatmapsetThumbnail from "../shared/BeatmapsetThumbnail";
import UserProfilePicture from "../shared/UserProfilePicture";
import Link from "next/link";

export interface RatingListProps {
  className?: string;
}

export async function getData() {
  const ratings = await db
    .selectFrom("Rating")
    .innerJoin("Beatmap", "Rating.BeatmapID", "Beatmap.BeatmapID")
    .innerJoin("OmdbUser", "Rating.UserID", "OmdbUser.UserID")
    .innerJoin("OsuUser", "Rating.UserID", "OsuUser.UserID")
    .selectAll("Rating")
    .select("Beatmap.SetID")
    .select("Beatmap.DifficultyName")
    .select("OsuUser.Username")
    .select("OmdbUser.CustomRatings")
    .orderBy("Rating.DateRated desc")
    .limit(20)
    .execute();

  return { ratings };
}

export default async function RatingList({ className }: RatingListProps) {
  const { ratings } = await getData();

  return (
    <div className={classNames("scroll-y", className)}>
      {ratings.map((rating) => {
        return (
          <div className={classNames(styles.ratingContainer, "alternating-bg")} key={rating.RatingID}>
            <BeatmapsetThumbnail setID={rating.SetID} />
            <UserProfilePicture userID={rating.UserID} username={rating.Username} />
            <div className="flex-child">
              <Link href={`/profile/${rating.UserID}`}>{rating.Username}</Link>
              <div>
                <StarRatingDisplay rating={parseFloat(rating.Score)} /> on{" "}
                <Link href={`/mapset/${rating.SetID}`}>{rating.DifficultyName}</Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
