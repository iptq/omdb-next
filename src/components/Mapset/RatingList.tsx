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

export default function RatingList({ ratings, className }: RatingListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const ratingsPerPage = 15;
  const pageCount = Math.ceil(ratings.length / ratingsPerPage);

  const startIndex = (currentPage - 1) * ratingsPerPage;
  const endIndex = startIndex + ratingsPerPage;
  const displayedRatings = ratings.slice(startIndex, endIndex);

  const handlePageChange = (shift: number) => {
    console.log(shift);
    setCurrentPage(currentPage + shift);
  };

  return (
    <div className={classNames(styles.ratingListContainer)}>
      <div className={classNames("scroll-y")}>
        {displayedRatings.map((rating) => {
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
      <Paginator
        currentPage={currentPage}
        totalPages={pageCount}
        onPageChange={(shift) => handlePageChange(shift)}
      ></Paginator>
    </div>
  );
}
