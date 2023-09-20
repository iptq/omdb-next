"use client";

import classNames from "classnames";
import styles from "./RatingList.module.scss";
import StarRatingDisplay from "../shared/StarRatingDisplay";
import UserProfilePicture from "../shared/UserProfilePicture";
import Link from "next/link";
import { ExtendedRating } from "@/app/mapset/[id]/page";
import Paginator from "../shared/Paginator";
import { useState } from "react";

export interface RatingListProps {
  ratings: ExtendedRating[];
  className?: string;
}

function getHumanTime(timestamp: string, full = false) {
  const now = new Date();
  const ago = new Date(timestamp);
  let diff = now.getTime() - ago.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const year = 365 * day;

  const intervals = [
    { label: "yr", duration: year },
    { label: "mo", duration: 30.44 * day },
    { label: "w", duration: week },
    { label: "d", duration: day },
    { label: "h", duration: hour },
    { label: "m", duration: minute },
    { label: "s", duration: 1000 },
  ];

  let result = "";

  for (const interval of intervals) {
    const count = Math.floor(diff / interval.duration);

    if (count > 0) {
      result += count + interval.label + " ";
      diff -= count * interval.duration;
    }
  }

  result = result.trim();

  if (!full) {
    result = result.split(" ")[0];
  }

  return result === "" ? "now" : result + " ago";
}

export default function RatingList({ ratings, className }: RatingListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const ratingsPerPage = 15;
  const pageCount = Math.ceil(ratings.length / ratingsPerPage);

  const startIndex = (currentPage - 1) * ratingsPerPage;
  const endIndex = startIndex + ratingsPerPage;
  const displayedRatings = ratings.slice(startIndex, endIndex);

  const handlePageChange = (shift: number) => {
    setCurrentPage(currentPage + shift);
  };

  return (
    <div className={classNames(styles.ratingListContainer)}>
      <div className={classNames("scroll-y")}>
        {displayedRatings.map((rating) => {
          return (
            <div className={classNames(styles.ratingContainer, "alternating-bg")} key={rating.RatingID}>
              <UserProfilePicture userID={rating.UserID} username={rating.Username} />
              <div>
                <Link href={`/profile/${rating.UserID}`}>{rating.Username}</Link>
                <div>
                  <StarRatingDisplay rating={parseFloat(rating.Score)} /> on {rating.DifficultyName}
                </div>
              </div>
              <div className={classNames(styles.timeStamp)}>{getHumanTime(rating.DateRated.toUTCString())}</div>
            </div>
          );
        })}
      </div>
      <Paginator
        currentPage={currentPage}
        totalPages={pageCount}
        onPageChange={(shift) => handlePageChange(shift)}
      ></Paginator>
    </div>
  );
}
