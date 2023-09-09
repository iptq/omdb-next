"use client";

import styles from "./StarRatingDisplay.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalf } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useMemo, useState } from "react";

export interface StarRatingDisplayProps {
  rating: number;
  interactive: boolean;
}

export default function StarRatingDisplay({
  rating,
  interactive = true,
}: StarRatingDisplayProps) {
  const [currentRating, setCurrentRating] = useState<number>(rating);
  const [newRating, setNewRating] = useState<number>(rating);

  const numbers = [0, 1, 2, 3, 4];

  const handleStarHover = useCallback(
    (
      event: React.MouseEvent<SVGSVGElement, MouseEvent> | undefined,
      index: number,
    ) => {
      if (!event) {
        setNewRating(currentRating);
        return;
      }

      const starSize =
        event.currentTarget.getBoundingClientRect().right -
        event.currentTarget.getBoundingClientRect().left;
      const offsetX = event.nativeEvent.offsetX;

      const hoveredRating = offsetX / starSize + (index - 1);
      const roundedRating = Math.round(hoveredRating * 2) / 2;

      setNewRating(roundedRating);
    },
    [currentRating],
  );

  const foregroundStars = useMemo(() => {
    return numbers
      .filter((x) => x < newRating)
      .map((x) => {
        return (
          <FontAwesomeIcon
            key={x}
            icon={newRating - 0.5 === x ? faStarHalf : faStar}
            size="sm"
            style={{ pointerEvents: "none" }}
          />
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newRating]);

  const backgroundStars = useMemo(
    () => (
      <div className={styles.starBackground}>
        {[...Array(5)].map((_, x) => (
          <FontAwesomeIcon
            key={x}
            icon={faStar}
            size="sm"
            onMouseMove={
              interactive ? (e) => handleStarHover(e, x + 1) : undefined
            }
            onMouseLeave={
              interactive
                ? () => handleStarHover(undefined, currentRating)
                : undefined
            }
          />
        ))}
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentRating],
  );

  return (
    <div className={styles.starRatingDisplay}>
      {backgroundStars}
      <div className={styles.starForeground}>{foregroundStars}</div>
    </div>
  );
}
