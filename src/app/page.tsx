import CommentList from "@/components/CommentList";
import styles from "./page.module.css";
import RatingList from "@/components/RatingList";
import { db } from "@/db";
import classNames from "classnames";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Home",
};

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

  return result!;
}

export default async function Home() {
  const { userCount, ratingCount, commentCount } = await getData();

  return (
    <main className={classNames(styles.main, "container")}>
      welcome to OMDB - a place to rate maps! discover new maps, check out
      people&quot;s ratings, AND STUFF. <br />
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
