import { db } from "@/db";
import UserProfilePicture from "./shared/UserProfilePicture";
import classNames from "classnames";
import styles from "./CommentList.module.scss";
import BeatmapsetThumbnail from "./shared/BeatmapsetThumbnail";

export interface CommentListProps {
  className?: string;
}

export async function getData() {
  const comments = await db
    .selectFrom("Comment")
    .innerJoin("BeatmapSet", "Comment.SetID", "BeatmapSet.SetID")
    .innerJoin("OmdbUser", "Comment.UserID", "OmdbUser.UserID")
    .innerJoin("OsuUser", "Comment.UserID", "OsuUser.UserID")
    .selectAll("Comment")
    .select("BeatmapSet.SetID")
    .select("OsuUser.Username")
    .select("OmdbUser.CustomRatings")
    .orderBy("Comment.DatePosted desc")
    .limit(10)
    .execute();

  return { comments };
}

export default async function CommentList({ className }: CommentListProps) {
  const { comments } = await getData();
  const isBlocked = false; // TODO: Implement

  return (
    <div className={classNames("scroll-y", className, styles.commentContainer)}>
      {comments.map((comment) => {
        return (
          <div
            className={classNames(
              "flex-container alternating-bg",
              styles.comment
            )}
            key={comment.CommentID}
          >
            <BeatmapsetThumbnail setID={comment.SetID} />
            <a href={`/profile/${comment.UserID}`}>
            <UserProfilePicture
                userID={comment.UserID}
                username={comment.Username}
            />
            </a>
            <div className="flex-child">
              <a href={`/profile/${comment.UserID}`}>{comment.Username}</a>
              <div className={styles.commentContent}>
                <a href={`/mapset/${comment.SetID}`}>
                  {isBlocked ? "[blocked comment]" : comment.Content}
                </a>
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}
