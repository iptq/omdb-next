"use client";

import classNames from "classnames";
import styles from "./CommentContainer.module.scss";
import { ExtendedComment } from "@/app/mapset/[id]/page";
import UserProfilePicture from "@/components/shared/UserProfilePicture";
import Link from "next/link";
import { useState } from "react";
import Paginator from "@/components/shared/Paginator";

interface CommentContainerProps {
  comments: ExtendedComment[];
}

export default function CommentContainer({ comments }: CommentContainerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 15;
  const pageCount = Math.ceil(comments.length / commentsPerPage);

  const startIndex = (currentPage - 1) * commentsPerPage;
  const endIndex = startIndex + commentsPerPage;
  const displayedComments = comments.slice(startIndex, endIndex);

  const handlePageChange = (shift: number) => {
    setCurrentPage(currentPage + shift);
  };

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

  return (
    <div
      style={{
        width: "60%",
      }}
    >
      <div className={classNames(styles.commentContainer)}>
        <div className={classNames(styles.composer)}>
          <form>
            <textarea
              id="commentForm"
              name="commentForm"
              placeholder="Write your comment here!"
              value=""
              readOnly
            ></textarea>
            <a href="/rules/" target="_blank" rel="noopener noreferrer">
              Rules{" "}
            </a>
            <input type="button" name="commentSubmit" id="commentSubmit" value="Post"></input>
          </form>
          <hr />
        </div>
        {displayedComments.map((comment) => (
          <>
            <div className={classNames(styles.header)}>
              <UserProfilePicture userID={comment.UserID} username={comment.Username} />
              <Link href={`/profile/${comment.UserID}`}>{comment.Username}</Link>
              <div className={classNames(styles.timeStamp)}>{getHumanTime(comment.DatePosted.toUTCString())}</div>
            </div>
            <div className={classNames(styles.content)}>{comment.Content}</div>
          </>
        ))}
      </div>
      <Paginator
        currentPage={currentPage}
        totalPages={pageCount}
        onPageChange={(shift) => handlePageChange(shift)}
      ></Paginator>
    </div>
  );
}
