import CommentList from "@/components/CommentList";
import styles from "./page.module.css";
import RatingList from "@/components/RatingList";
import { db } from "@/db";
import classNames from "classnames";
import { Metadata } from "next";
import { sql } from "kysely";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Home | OMDB",
};

interface Data {
  userCount: number;
  ratingCount: number;
  commentCount: number;
}

async function getData(): Promise<Data> {
  const result = await sql<Data>`
    select
      (select count(*) from OmdbUser) as userCount,
      (select count(*) from Rating) as ratingCount,
      (select count(*) from Comment) as commentCount
  `.execute(db);

  return result.rows[0];
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
