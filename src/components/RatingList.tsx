import classNames from "classnames";
import styles from "./RatingList.module.scss";
import StarRatingDisplay from "./StarRatingDisplay";
import { db } from "@/db";

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
          <div
            className={classNames(styles.ratingContainer, "alternating-bg")}
            key={rating.RatingID}
          >
            <div className={styles.setImage}>
              <a href={`/mapset/${rating.SetID}`}>
                <img
                  src={`https://b.ppy.sh/thumb/${rating.SetID}l.jpg`}
                  className={styles.diffThumb}
                />
              </a>
            </div>
            <div>
              <a href={`/profile/${rating.UserID}`}>
                <img
                  src={`https://s.ppy.sh/a/${rating.UserID}`}
                  className={styles.profilePicture}
                  title="<?php echo GetUserNameFromId($row['UserID'], $conn); ?>"
                />
              </a>
            </div>

            <div className="flex-child">
              <a href={`/profile/${rating.UserID}`}>{rating.Username}</a>
              <div>
                <StarRatingDisplay rating={parseFloat(rating.Score)} /> on
                <a href={`/mapset/${rating.SetID}`}>{rating.DifficultyName}</a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
