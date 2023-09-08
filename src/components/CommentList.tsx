import { db } from "@/db";
import UserProfilePicture from "./UserProfilePicture";
import classNames from "classnames";
import styles from "./CommentList.module.scss";

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
            <div>
              <a href={`/mapset/${comment.SetID}`}>
                <img
                  src={`https://b.ppy.sh/thumb/${comment.SetID}l.jpg`}
                  className="diffThumb"
                  style={{ width: "32px", height: "32px" }}
                />
              </a>
            </div>

            <div>
              <div>
                <UserProfilePicture
                  userID={comment.UserID}
                  username={comment.Username}
                />
              </div>
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
