import CommentList from "@/components/CommentList";
import styles from "./page.module.css";
import RatingList from "@/components/RatingList";
import { db } from "@/db";
import classNames from "classnames";

async function getData() {
  const result = await db
    .selectFrom("OmdbUser")
    .select(({ selectFrom }) => [
      selectFrom("OmdbUser")
        .select(({ fn }) => fn.countAll<number>().as("userCount"))
        .as("userCount"),
      selectFrom("Rating")
        .select(({ fn }) => fn.countAll<number>().as("ratingCount"))
        .as("ratingCount"),
      selectFrom("Comment")
        .select(({ fn }) => fn.countAll<number>().as("commentCount"))
        .as("commentCount"),
    ])
    .executeTakeFirst();

  return result;
}

export default async function Home() {
  const { userCount, ratingCount, commentCount } = await getData();

  return (
    <main className={styles.main}>
      welcome to OMDB - a place to rate maps! discover new maps, check out
      people's ratings, AND STUFF. <br />
      <span>
        {userCount} users,
        {ratingCount} ratings,
        {commentCount} comments
      </span>
      <hr />
      <div
        className={classNames(
          "flex-container",
          "column-when-mobile-container",
          styles.ratingCommentContainer
        )}
      >
        <RatingList className={styles.child} />
        <CommentList className={styles.child} />
      </div>
    </main>
  );
}
