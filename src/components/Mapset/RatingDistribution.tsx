import { ExtendedRating } from "@/app/mapset/[id]/page";
import classNames from "classnames";
import styles from "./RatingDistribution.module.scss";
import { Tooltip } from "react-tooltip";

interface RatingDistributionProps {
  beatmapID: number;
  ratings: ExtendedRating[];
}

export default function RatingDistribution({ ratings, beatmapID }: RatingDistributionProps) {
  const scoreCounts: { [score: string]: number } = {};

  for (let score = 0; score <= 5; score += 0.5) {
    scoreCounts[score.toFixed(1)] = 0;
  }

  let maxCount = 0;

  ratings.forEach((rating) => {
    const score = rating.Score;
    if (scoreCounts[score]) {
      scoreCounts[score]++;
    } else {
      scoreCounts[score] = 1;
    }

    if (scoreCounts[score] > maxCount) {
      maxCount = scoreCounts[score];
    }
  });

  const scoreCountArray = Object.entries(scoreCounts).map(([score, count]) => ({
    score: Number(score),
    count,
  }));

  scoreCountArray.sort((a, b) => a.score - b.score);

  return (
    <div className={classNames(styles.ratingDistributionContainer)}>
      {scoreCountArray.map(({ score, count }) => (
        <div
          className={classNames(styles.bar)}
          key={score}
          style={{
            height: `${(count / maxCount) * 90}%`,
          }}
          data-tooltip-content={score.toString() + ": " + count.toString() + " votes"}
          data-tooltip-id={beatmapID + " " + score.toString()}
        >
          <Tooltip id={beatmapID + " " + score.toString()} />
        </div>
      ))}
    </div>
  );
}
