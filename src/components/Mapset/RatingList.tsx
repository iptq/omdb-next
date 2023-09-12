import classNames from "classnames";
import styles from "./RatingList.module.scss";
import StarRatingDisplay from "../shared/StarRatingDisplay";
import UserProfilePicture from "../shared/UserProfilePicture";
import Link from "next/link";
import { ExtendedRating } from "@/app/mapset/[id]/page";

export interface RatingListProps {
  ratings: ExtendedRating[];
  className?: string;
}

export default async function RatingList({ ratings, className }: RatingListProps) {
  return (
    <div className={classNames("scroll-y", className)}>
      {ratings.map((rating) => {
        return (
          <div className={classNames(styles.ratingContainer, "alternating-bg")} key={rating.RatingID}>
            <UserProfilePicture userID={rating.UserID} username="Michael" />
            <div className="flex-child">
              <Link href={`/profile/${rating.UserID}`}>{rating.Username}</Link>
              <div>
                <StarRatingDisplay rating={parseFloat(rating.Score)} /> on {rating.DifficultyName}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
