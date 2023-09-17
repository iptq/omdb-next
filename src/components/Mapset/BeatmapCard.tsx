"use client";

import { Beatmap } from "@/db/types";
import RulesetIcon from "../shared/Icons/RulesetIcon";
import classNames from "classnames";
import StarRatingDisplay from "../shared/StarRatingDisplay";
import styles from "./BeatmapCard.module.scss";
import { Selectable } from "kysely";
import useSWR from "swr";
import { ExtendedRating } from "@/app/mapset/[id]/page";

interface BeatmapCardProps {
  difficulty: Selectable<Beatmap>;
  ratings: ExtendedRating[];
}

async function fetcher(url: RequestInfo | URL) {
  const resp = await fetch(url);
  return await resp.json();
}

export default function BeatmapCard({ difficulty, ratings }: BeatmapCardProps) {
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
            X.XX / 5.00 from <span className="forceTextColor">{ratings.length}</span> votes
          </span>{" "}
          <br />
          Friend rating: <b>3.43</b>{" "}
          <span className="subText">
            X.XX / 5.00 from <span className="forceTextColor">XXX</span> votes
          </span>
        </div>
      </div>
      <div>
        {data && (
          <StarRatingDisplay
            interactive
            rating={
              Number(
                ratings.find((rating) => {
                  return rating.UserID === data.UserID && rating.BeatmapID === difficulty.BeatmapID;
                })?.Score,
              ) || 0
            }
            size="lg"
            showNumber
          />
        )}
      </div>
    </div>
  );
}
