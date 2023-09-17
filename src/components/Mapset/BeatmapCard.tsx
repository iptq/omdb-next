"use client";

import { Beatmap } from "@/db/types";
import RulesetIcon from "../shared/Icons/RulesetIcon";
import classNames from "classnames";
import StarRatingDisplay from "../shared/StarRatingDisplay";
import styles from "./BeatmapCard.module.scss";
import { Selectable } from "kysely";
import useSWR from "swr";

interface BeatmapCardProps {
  difficulty: Selectable<Beatmap>;
  rating?: number;
}

async function fetcher(url: RequestInfo | URL) {
  const resp = await fetch(url);
  return await resp.json();
}

export default function BeatmapCard({ difficulty, rating }: BeatmapCardProps) {
  const { data, error, isLoading, mutate } = useSWR("/auth/user", fetcher);

  return (
    <div className={classNames(styles.beatmapCard, "alternating-bg")} key={difficulty.BeatmapID}>
      <div>
        <div>
          <span className={styles.alignWithText}>
            <RulesetIcon ruleset={difficulty.Mode} />
          </span>{" "}
          {difficulty.DifficultyName} <span className="subText">{difficulty.SR.toFixed(2)}*</span>
        </div>
      </div>
      <div>
        <div>sdfsdf</div>
      </div>
      <div>
        <div className="alignRight">
          Rating: <b>{difficulty.WeightedAvg}</b>{" "}
          <span className="subText">
            / 5.00 from <span className="forceTextColor">{difficulty.RatingCount}</span> votes
          </span>{" "}
          <br />
          Friend rating: <b>3.43</b>{" "}
          <span className="subText">
            / 5.00 from <span className="forceTextColor">6</span> votes
          </span>
        </div>
      </div>
      <div>{data && <StarRatingDisplay interactive rating={rating || 0} size="lg" showNumber />}</div>
    </div>
  );
}
