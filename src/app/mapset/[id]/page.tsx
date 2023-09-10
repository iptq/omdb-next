import { db } from "@/db";
import Link from "next/link";
import styles from "./page.module.scss";
import classNames from "classnames";
import RulesetIcon from "@/components/shared/Icons/RulesetIcon";

interface MapsetProps {
  params: { id: string };
}

export async function generateMetadata({ params }: MapsetProps) {
  const { id } = params;
  return {
    title: `Mapset`,
  };
}

async function getBeatmapset(id: number) {
  try {
    return await db
      .selectFrom("BeatmapSet")
      .innerJoin("OsuUser", "OsuUser.UserID", "BeatmapSet.HostID")
      .selectAll("BeatmapSet")
      .select("OsuUser.Username")
      .where("SetID", "=", id)
      .executeTakeFirst();
  } catch (error) {
    return null;
  }
}

export default async function Page({ params }: MapsetProps) {
  const { id } = params;
  const mapset = await getBeatmapset(parseInt(id));

  if (!mapset) {
    return <>sdfsdf</>;
  }

  return (
    <main className="main content">
      <center>
        <h1>
          <Link href={`https://osu.ppy.sh/s/${id}`} target="_blank" rel="noopener noreferrer">
            {mapset.Artist} - {mapset.Title}
          </Link>{" "}
          by <Link href={`../profile/${mapset.HostID}`}>{mapset.Username}</Link>
        </h1>
      </center>
      <div className={classNames(styles.beatmapCard)}>
        <div>
          <span className={styles.alignWithText}>
            <RulesetIcon ruleset="osu" />
          </span>{" "}
          Hard <span className="subText">3.03*</span>
        </div>
        <div>sdfsdf</div>
        <div className="alignRight">
          Rating: <b>3.43</b>{" "}
          <span className="subText">
            / 5.00 from <span className="forceTextColor">6</span> votes
          </span>{" "}
          <br />
          Friend rating: <b>3.43</b>{" "}
          <span className="subText">
            / 5.00 from <span className="forceTextColor">6</span> votes
          </span>
        </div>
        <div>sdfsdf</div>
      </div>
    </main>
  );
}
